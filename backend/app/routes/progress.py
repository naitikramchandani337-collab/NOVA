from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, UserProgress, PhaseCompletion, RocketPart, Achievement
from app.schemas import UserStatsResponse, UserProgressResponse, PhaseCompletionResponse, RocketPartResponse, AchievementResponse
from app.security import get_current_user
from typing import List

router = APIRouter()


@router.get("/progress", response_model=UserProgressResponse)
async def get_user_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get user's progress."""
    progress = db.query(UserProgress).filter(UserProgress.user_id == current_user.id).first()
    
    if not progress:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User progress not found",
        )
    
    return progress


@router.get("/stats", response_model=UserStatsResponse)
async def get_user_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get user's statistics."""
    progress = db.query(UserProgress).filter(UserProgress.user_id == current_user.id).first()
    phases_completed = db.query(PhaseCompletion).filter(
        PhaseCompletion.user_id == current_user.id
    ).count()
    rocket_parts = db.query(RocketPart).filter(
        RocketPart.user_id == current_user.id
    ).count()
    achievements = db.query(Achievement).filter(
        Achievement.user_id == current_user.id
    ).count()
    
    return {
        "user": current_user,
        "progress": progress,
        "phases_completed": phases_completed,
        "rocket_parts_unlocked": rocket_parts,
        "achievements_unlocked": achievements,
    }


@router.get("/phases-completed", response_model=List[PhaseCompletionResponse])
async def get_phases_completed(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get list of completed phases."""
    completions = db.query(PhaseCompletion).filter(
        PhaseCompletion.user_id == current_user.id
    ).order_by(PhaseCompletion.phase_id).all()
    
    return completions


@router.get("/rocket-parts", response_model=List[RocketPartResponse])
async def get_rocket_parts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get unlocked rocket parts."""
    parts = db.query(RocketPart).filter(
        RocketPart.user_id == current_user.id
    ).order_by(RocketPart.phase_id).all()
    
    return parts


@router.get("/achievements", response_model=List[AchievementResponse])
async def get_achievements(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get unlocked achievements."""
    achievements = db.query(Achievement).filter(
        Achievement.user_id == current_user.id
    ).order_by(Achievement.unlocked_at).all()
    
    return achievements
