from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database import get_db
from app.models import User, UserProgress, PhaseCompletion
from app.schemas import LeaderboardResponse, LeaderboardEntry
from app.security import get_current_user
from typing import List

router = APIRouter()


@router.get("/leaderboard", response_model=LeaderboardResponse)
async def get_leaderboard(
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get global leaderboard."""
    # Get all users sorted by XP
    users_with_progress = db.query(User, UserProgress).join(
        UserProgress, User.id == UserProgress.user_id
    ).order_by(desc(UserProgress.total_xp)).limit(limit).all()
    
    entries = []
    user_rank = None
    
    for rank, (user, progress) in enumerate(users_with_progress, 1):
        phases_completed = db.query(PhaseCompletion).filter(
            PhaseCompletion.user_id == user.id
        ).count()
        
        entry = LeaderboardEntry(
            rank=rank,
            username=user.username,
            total_xp=progress.total_xp,
            current_level=progress.current_level,
            phases_completed=phases_completed,
        )
        entries.append(entry)
        
        if user.id == current_user.id:
            user_rank = rank
    
    return LeaderboardResponse(
        entries=entries,
        user_rank=user_rank,
        total_users=db.query(User).count(),
    )


@router.get("/stats/xp-breakdown")
async def get_xp_breakdown(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get XP breakdown by phase."""
    completions = db.query(PhaseCompletion).filter(
        PhaseCompletion.user_id == current_user.id
    ).all()
    
    breakdown = {}
    for completion in completions:
        breakdown[f"phase_{completion.phase_id}"] = completion.xp_earned
    
    return {
        "total_xp": sum(breakdown.values()),
        "breakdown": breakdown,
    }


@router.post("/streak/freeze")
async def use_streak_freeze(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Use streak freeze to maintain current streak."""
    progress = db.query(UserProgress).filter(
        UserProgress.user_id == current_user.id
    ).first()
    
    # In production, track streak freeze usage
    return {
        "message": "Streak freeze used",
        "current_streak": progress.streak_days,
    }
