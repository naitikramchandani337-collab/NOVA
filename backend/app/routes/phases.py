from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, UserProgress, PhaseCompletion, RocketPart, Achievement
from app.security import get_current_user
from datetime import datetime
from typing import List, Dict, Any

router = APIRouter()

# Phase data (would be in database in production)
PHASES_DATA = {
    1: { "id": 1, "name": "Python", "description": "Programming Foundation", "rocket_part": "body", "xp_reward": 100 },
    2: { "id": 2, "name": "Math", "description": "Mathematical Foundation", "rocket_part": "fuel_tank", "xp_reward": 150 },
    3: { "id": 3, "name": "ML Basics", "description": "Learning Algorithms", "rocket_part": "engine", "xp_reward": 150 },
    4: { "id": 4, "name": "Evaluation", "description": "Performance Metrics", "rocket_part": "brain_core", "xp_reward": 150 },
    5: { "id": 5, "name": "Neural Networks", "description": "Deep Foundations", "rocket_part": "power_systems", "xp_reward": 200 },
    6: { "id": 6, "name": "PyTorch", "description": "Deep Learning Framework", "rocket_part": "navigation_system", "xp_reward": 200 },
    7: { "id": 7, "name": "CNNs", "description": "Computer Vision", "rocket_part": "consciousness", "xp_reward": 250 },
    8: { "id": 8, "name": "RNNs", "description": "Sequential Data", "rocket_part": "payload", "xp_reward": 250 },
    9: { "id": 9, "name": "Transformers", "description": "Attention Mechanism", "rocket_part": "boosters", "xp_reward": 300 },
    10: { "id": 10, "name": "Advanced Architectures", "description": "Cutting Edge", "rocket_part": "full_assembly", "xp_reward": 300 },
    11: { "id": 11, "name": "ML Engineering", "description": "Production Systems", "rocket_part": "production_engine", "xp_reward": 350 },
    12: { "id": 12, "name": "Capstone", "description": "Deep Space Launch", "rocket_part": "launch_pad", "xp_reward": 500 },
}


@router.get("/")
async def get_all_phases(current_user: User = Depends(get_current_user)):
    """Get all learning phases."""
    return list(PHASES_DATA.values())


@router.get("/{phase_id}")
async def get_phase(
    phase_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get specific phase details."""
    if phase_id not in PHASES_DATA:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Phase not found",
        )
    
    phase = PHASES_DATA[phase_id]
    
    # Check if completed
    completion = db.query(PhaseCompletion).filter(
        (PhaseCompletion.user_id == current_user.id) &
        (PhaseCompletion.phase_id == phase_id)
    ).first()
    
    return {
        **phase,
        "completed": completion is not None,
        "quiz_score": completion.quiz_score if completion else None,
    }


@router.post("/{phase_id}/complete")
async def complete_phase(
    phase_id: int,
    quiz_score: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Mark a phase as complete."""
    if phase_id not in PHASES_DATA:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Phase not found",
        )
    
    # Check if already completed
    existing = db.query(PhaseCompletion).filter(
        (PhaseCompletion.user_id == current_user.id) &
        (PhaseCompletion.phase_id == phase_id)
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phase already completed",
        )
    
    phase_data = PHASES_DATA[phase_id]
    xp_earned = phase_data["xp_reward"]
    
    # Create phase completion record
    completion = PhaseCompletion(
        user_id=current_user.id,
        phase_id=phase_id,
        quiz_score=quiz_score,
        xp_earned=xp_earned,
    )
    db.add(completion)
    
    # Unlock rocket part
    rocket_part = RocketPart(
        user_id=current_user.id,
        phase_id=phase_id,
        part_name=phase_data["rocket_part"],
    )
    db.add(rocket_part)
    
    # Update user progress
    progress = db.query(UserProgress).filter(UserProgress.user_id == current_user.id).first()
    progress.total_xp += xp_earned
    progress.current_level = (progress.total_xp // 100) + 1
    progress.current_phase = max(progress.current_phase, phase_id + 1)
    progress.last_activity_date = datetime.utcnow()
    
    # Check for achievements
    phases_completed = db.query(PhaseCompletion).filter(
        PhaseCompletion.user_id == current_user.id
    ).count() + 1
    
    if phases_completed == 1:
        achievement = Achievement(
            user_id=current_user.id,
            achievement_key="first_steps",
            achievement_name="First Steps",
            description="Complete Phase 1",
        )
        db.add(achievement)
    elif phases_completed == 5:
        achievement = Achievement(
            user_id=current_user.id,
            achievement_key="rocket_scientist",
            achievement_name="Rocket Scientist",
            description="Complete Phase 5",
        )
        db.add(achievement)
    elif phases_completed == 12:
        achievement = Achievement(
            user_id=current_user.id,
            achievement_key="ai_master",
            achievement_name="AI Master",
            description="Complete all 12 phases",
        )
        db.add(achievement)
    
    db.commit()
    
    return {
        "message": "Phase completed successfully",
        "xp_earned": xp_earned,
        "new_level": progress.current_level,
        "total_xp": progress.total_xp,
    }
