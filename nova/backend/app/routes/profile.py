from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.security import get_current_user
from app.models import User, UserProfile, UserProgress, Achievement, Activity
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

router = APIRouter()


def get_or_create_profile(user: User, db: Session) -> UserProfile:
    profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
    if not profile:
        profile = UserProfile(user_id=user.id, display_name=user.username)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile


class ProfileUpdateRequest(BaseModel):
    display_name: Optional[str] = Field(None, max_length=50)
    bio:          Optional[str] = Field(None, max_length=250)
    avatar_url:   Optional[str] = None
    title:        Optional[str] = None
    country:      Optional[str] = None
    rocket_name:  Optional[str] = Field(None, max_length=50)
    is_profile_public: Optional[bool] = None
    show_activity:     Optional[bool] = None
    show_stats:        Optional[bool] = None
    show_rocket:       Optional[bool] = None


@router.get("/me")
async def get_my_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile  = get_or_create_profile(current_user, db)
    progress = db.query(UserProgress).filter(UserProgress.user_id == current_user.id).first()
    achievements = db.query(Achievement).filter(Achievement.user_id == current_user.id).all()

    return {
        "user_id":      current_user.id,
        "username":     current_user.username,
        "email":        current_user.email,
        "display_name": profile.display_name or current_user.username,
        "bio":          profile.bio,
        "avatar_url":   profile.avatar_url,
        "title":        profile.title,
        "country":      profile.country,
        "rocket_name":  profile.rocket_name,
        "is_profile_public": profile.is_profile_public,
        "show_activity":     profile.show_activity,
        "show_stats":        profile.show_stats,
        "show_rocket":       profile.show_rocket,
        "joined_at":    profile.joined_at.isoformat() if profile.joined_at else None,
        "last_active":  profile.last_active.isoformat() if profile.last_active else None,
        # Progress
        "total_xp":        progress.total_xp       if progress else 0,
        "level":           progress.current_level  if progress else 1,
        "current_phase":   progress.current_phase  if progress else 1,
        "streak_days":     progress.streak_days    if progress else 0,
        "phases_completed": len(db.query(Achievement).filter(
            Achievement.user_id == current_user.id
        ).all()),
        # Achievements
        "achievements": [
            {
                "key":   a.achievement_key,
                "name":  a.achievement_name,
                "desc":  a.description,
                "unlocked_at": a.unlocked_at.isoformat()
            }
            for a in achievements
        ],
    }


@router.patch("/me")
async def update_my_profile(
    body: ProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = get_or_create_profile(current_user, db)

    for field, value in body.dict(exclude_none=True).items():
        setattr(profile, field, value)

    profile.last_active = datetime.utcnow()
    db.commit()
    db.refresh(profile)
    return {"status": "updated"}


@router.get("/me/activity")
async def get_my_activity(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    activities = (
        db.query(Activity)
        .filter(Activity.user_id == current_user.id)
        .order_by(Activity.created_at.desc())
        .limit(20)
        .all()
    )
    return [
        {
            "id":            a.id,
            "type":          a.activity_type,
            "title":         a.title,
            "description":   a.description,
            "xp_earned":     a.xp_earned,
            "phase":         a.phase,
            "created_at":    a.created_at.isoformat(),
        }
        for a in activities
    ]


@router.get("/{user_id}")
async def get_public_profile(
    user_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    profile  = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    progress = db.query(UserProgress).filter(UserProgress.user_id == user_id).first()

    if profile and not profile.is_profile_public and user_id != current_user.id:
        raise HTTPException(status_code=403, detail="This profile is private")

    return {
        "user_id":      user.id,
        "username":     user.username,
        "display_name": profile.display_name if profile else user.username,
        "bio":          profile.bio          if profile else "",
        "avatar_url":   profile.avatar_url   if profile else "",
        "title":        profile.title        if profile else "Space Cadet",
        "country":      profile.country      if profile else "",
        "total_xp":     progress.total_xp      if progress else 0,
        "level":        progress.current_level  if progress else 1,
        "current_phase": progress.current_phase if progress else 1,
        "streak_days":  progress.streak_days    if progress else 0,
        "joined_at":    profile.joined_at.isoformat() if profile and profile.joined_at else None,
    }
