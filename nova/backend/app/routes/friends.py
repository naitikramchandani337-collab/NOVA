from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from app.database import get_db
from app.security import get_current_user
from app.models import User, Friendship, UserProfile, UserProgress, Notification, Activity
from datetime import datetime
from pydantic import BaseModel

router = APIRouter()


class SendFriendRequestBody(BaseModel):
    receiver_id: str


def _profile(user_id: str, db: Session):
    return db.query(UserProfile).filter(UserProfile.user_id == user_id).first()

def _progress(user_id: str, db: Session):
    return db.query(UserProgress).filter(UserProgress.user_id == user_id).first()

def _friend_entry(user: User, profile, progress, since: datetime):
    return {
        "user_id":      user.id,
        "username":     user.username,
        "display_name": profile.display_name if profile else user.username,
        "avatar_url":   profile.avatar_url   if profile else "",
        "title":        profile.title        if profile else "Space Cadet",
        "level":        progress.current_level  if progress else 1,
        "current_phase": progress.current_phase if progress else 1,
        "streak_days":  progress.streak_days    if progress else 0,
        "total_xp":     progress.total_xp       if progress else 0,
        "friendship_since": since.isoformat() if since else None,
    }


@router.get("/")
async def get_friends(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    friendships = db.query(Friendship).filter(
        and_(
            or_(
                Friendship.sender_id   == current_user.id,
                Friendship.receiver_id == current_user.id,
            ),
            Friendship.status == "accepted"
        )
    ).all()

    result = []
    for f in friendships:
        friend_id = f.receiver_id if f.sender_id == current_user.id else f.sender_id
        friend    = db.query(User).filter(User.id == friend_id).first()
        if friend:
            result.append(_friend_entry(
                friend,
                _profile(friend_id, db),
                _progress(friend_id, db),
                f.accepted_at or f.created_at
            ))
    return result


@router.get("/requests")
async def get_friend_requests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    requests = db.query(Friendship).filter(
        Friendship.receiver_id == current_user.id,
        Friendship.status == "pending"
    ).all()

    result = []
    for r in requests:
        sender  = db.query(User).filter(User.id == r.sender_id).first()
        profile = _profile(r.sender_id, db)
        progress = _progress(r.sender_id, db)
        if sender:
            result.append({
                "request_id":   r.id,
                "sender_id":    sender.id,
                "sender_name":  profile.display_name if profile else sender.username,
                "sender_avatar": profile.avatar_url  if profile else "",
                "sender_level": progress.current_level if progress else 1,
                "sender_title": profile.title if profile else "Space Cadet",
                "sent_at":      r.created_at.isoformat(),
            })
    return result


@router.post("/request")
async def send_friend_request(
    body: SendFriendRequestBody,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if body.receiver_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot add yourself")

    receiver = db.query(User).filter(User.id == body.receiver_id).first()
    if not receiver:
        raise HTTPException(status_code=404, detail="User not found")

    existing = db.query(Friendship).filter(
        or_(
            and_(Friendship.sender_id == current_user.id,   Friendship.receiver_id == body.receiver_id),
            and_(Friendship.sender_id == body.receiver_id,  Friendship.receiver_id == current_user.id),
        )
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Friend request already exists")

    friendship = Friendship(sender_id=current_user.id, receiver_id=body.receiver_id)
    db.add(friendship)

    # Notification
    notif = Notification(
        user_id=body.receiver_id,
        type="friend_request",
        title="New Friend Request",
        message=f"{current_user.username} sent you a friend request",
    )
    db.add(notif)
    db.commit()
    return {"status": "request_sent"}


@router.post("/accept/{request_id}")
async def accept_friend_request(
    request_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    friendship = db.query(Friendship).filter(
        Friendship.id == request_id,
        Friendship.receiver_id == current_user.id,
        Friendship.status == "pending"
    ).first()

    if not friendship:
        raise HTTPException(status_code=404, detail="Request not found")

    friendship.status      = "accepted"
    friendship.accepted_at = datetime.utcnow()

    notif = Notification(
        user_id=friendship.sender_id,
        type="friend_accepted",
        title="Friend Request Accepted",
        message=f"{current_user.username} accepted your friend request",
    )
    db.add(notif)
    db.commit()
    return {"status": "accepted"}


@router.post("/decline/{request_id}")
async def decline_friend_request(
    request_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    friendship = db.query(Friendship).filter(
        Friendship.id == request_id,
        Friendship.receiver_id == current_user.id,
        Friendship.status == "pending"
    ).first()

    if not friendship:
        raise HTTPException(status_code=404, detail="Request not found")

    friendship.status = "declined"
    db.commit()
    return {"status": "declined"}


@router.delete("/{friend_id}")
async def remove_friend(
    friend_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    friendship = db.query(Friendship).filter(
        or_(
            and_(Friendship.sender_id == current_user.id,   Friendship.receiver_id == friend_id),
            and_(Friendship.sender_id == friend_id,          Friendship.receiver_id == current_user.id),
        ),
        Friendship.status == "accepted"
    ).first()

    if not friendship:
        raise HTTPException(status_code=404, detail="Friendship not found")

    db.delete(friendship)
    db.commit()
    return {"status": "removed"}


@router.get("/search/{query}")
async def search_users(
    query: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if len(query) < 2:
        return []

    users = db.query(User).filter(
        User.username.ilike(f"%{query}%"),
        User.id != current_user.id
    ).limit(10).all()

    result = []
    for u in users:
        profile  = _profile(u.id, db)
        progress = _progress(u.id, db)

        existing = db.query(Friendship).filter(
            or_(
                and_(Friendship.sender_id == current_user.id, Friendship.receiver_id == u.id),
                and_(Friendship.sender_id == u.id,             Friendship.receiver_id == current_user.id),
            )
        ).first()

        result.append({
            "user_id":      u.id,
            "username":     u.username,
            "display_name": profile.display_name if profile else u.username,
            "avatar_url":   profile.avatar_url   if profile else "",
            "title":        profile.title        if profile else "Space Cadet",
            "level":        progress.current_level  if progress else 1,
            "current_phase": progress.current_phase if progress else 1,
            "is_friend":    existing.status == "accepted" if existing else False,
            "request_pending": existing.status == "pending" if existing else False,
        })
    return result


@router.get("/activity/feed")
async def get_friends_activity(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get friend IDs
    friendships = db.query(Friendship).filter(
        or_(
            Friendship.sender_id   == current_user.id,
            Friendship.receiver_id == current_user.id,
        ),
        Friendship.status == "accepted"
    ).all()

    friend_ids = []
    for f in friendships:
        fid = f.receiver_id if f.sender_id == current_user.id else f.sender_id
        friend_ids.append(fid)

    if not friend_ids:
        return []

    activities = (
        db.query(Activity)
        .filter(Activity.user_id.in_(friend_ids))
        .order_by(Activity.created_at.desc())
        .limit(30)
        .all()
    )

    result = []
    for a in activities:
        user    = db.query(User).filter(User.id == a.user_id).first()
        profile = _profile(a.user_id, db)
        if user:
            result.append({
                "id":           a.id,
                "user_id":      a.user_id,
                "display_name": profile.display_name if profile else user.username,
                "avatar_url":   profile.avatar_url   if profile else "",
                "type":         a.activity_type,
                "title":        a.title,
                "description":  a.description,
                "xp_earned":    a.xp_earned,
                "phase":        a.phase,
                "created_at":   a.created_at.isoformat(),
            })
    return result


@router.get("/leaderboard/friends")
async def get_friends_leaderboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    friendships = db.query(Friendship).filter(
        or_(
            Friendship.sender_id   == current_user.id,
            Friendship.receiver_id == current_user.id,
        ),
        Friendship.status == "accepted"
    ).all()

    friend_ids = [current_user.id]
    for f in friendships:
        fid = f.receiver_id if f.sender_id == current_user.id else f.sender_id
        friend_ids.append(fid)

    entries = []
    for uid in friend_ids:
        user     = db.query(User).filter(User.id == uid).first()
        profile  = _profile(uid, db)
        progress = _progress(uid, db)
        if user:
            entries.append({
                "user_id":      uid,
                "display_name": profile.display_name if profile else user.username,
                "avatar_url":   profile.avatar_url   if profile else "",
                "title":        profile.title        if profile else "Space Cadet",
                "total_xp":     progress.total_xp       if progress else 0,
                "level":        progress.current_level  if progress else 1,
                "current_phase": progress.current_phase if progress else 1,
                "streak_days":  progress.streak_days    if progress else 0,
                "is_you":       uid == current_user.id,
            })

    entries.sort(key=lambda x: x["total_xp"], reverse=True)
    for i, e in enumerate(entries):
        e["rank"] = i + 1

    return entries
