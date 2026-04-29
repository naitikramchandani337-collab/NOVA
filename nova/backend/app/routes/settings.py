from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.security import get_current_user
from app.models import User, UserSettings
from typing import Optional
from pydantic import BaseModel

router = APIRouter()


def get_or_create_settings(user: User, db: Session) -> UserSettings:
    settings = db.query(UserSettings).filter(UserSettings.user_id == user.id).first()
    if not settings:
        settings = UserSettings(user_id=user.id)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings


class SettingsUpdateRequest(BaseModel):
    # Appearance
    theme:             Optional[str]  = None
    accent_color:      Optional[str]  = None
    font_size:         Optional[str]  = None
    reduce_animations: Optional[bool] = None
    compact_mode:      Optional[bool] = None
    # ASTRA
    astra_mode:        Optional[str]  = None
    astra_auto_open:   Optional[bool] = None
    astra_show_hints:  Optional[bool] = None
    astra_difficulty:  Optional[str]  = None
    # Notifications
    notify_friend_requests: Optional[bool] = None
    notify_achievements:    Optional[bool] = None
    notify_streak_reminder: Optional[bool] = None
    notify_leaderboard:     Optional[bool] = None
    notify_new_content:     Optional[bool] = None
    notify_email:           Optional[bool] = None
    # Privacy
    allow_friend_requests:  Optional[bool] = None
    show_online_status:     Optional[bool] = None
    show_learning_activity: Optional[bool] = None


@router.get("/")
async def get_settings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    s = get_or_create_settings(current_user, db)
    return {
        "theme":             s.theme,
        "accent_color":      s.accent_color,
        "font_size":         s.font_size,
        "reduce_animations": s.reduce_animations,
        "compact_mode":      s.compact_mode,
        "astra_mode":        s.astra_mode,
        "astra_auto_open":   s.astra_auto_open,
        "astra_show_hints":  s.astra_show_hints,
        "astra_difficulty":  s.astra_difficulty,
        "notify_friend_requests": s.notify_friend_requests,
        "notify_achievements":    s.notify_achievements,
        "notify_streak_reminder": s.notify_streak_reminder,
        "notify_leaderboard":     s.notify_leaderboard,
        "notify_new_content":     s.notify_new_content,
        "notify_email":           s.notify_email,
        "allow_friend_requests":  s.allow_friend_requests,
        "show_online_status":     s.show_online_status,
        "show_learning_activity": s.show_learning_activity,
    }


@router.patch("/")
async def update_settings(
    body: SettingsUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    s = get_or_create_settings(current_user, db)
    for field, value in body.dict(exclude_none=True).items():
        setattr(s, field, value)
    db.commit()
    return {"status": "updated"}
