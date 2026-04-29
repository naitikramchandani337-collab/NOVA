from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.security import get_current_user
from app.models import User, UserProgress
import json

router = APIRouter()

ROCKET_PART_NAMES = {
    1: "Engine Core",     2: "Fuel Tanks",         3: "Thrust Nozzles",
    4: "Lower Hull",      5: "Sensor Array",        6: "Middle Hull",
    7: "Communication Dish", 8: "Upper Hull",       9: "Guidance Fins",
    10: "Control Module", 11: "Payload Bay",        12: "Nose Cone",
}


def _get_progress(user_id: str, db: Session) -> UserProgress:
    p = db.query(UserProgress).filter(UserProgress.user_id == user_id).first()
    if not p:
        p = UserProgress(user_id=user_id)
        db.add(p)
        db.commit()
        db.refresh(p)
    return p


@router.get("/state")
async def get_rocket_state(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    progress = _get_progress(current_user.id, db)

    # Parse unlocked phases from rocket_parts relationship
    from app.models import RocketPart
    rocket_parts = db.query(RocketPart).filter(RocketPart.user_id == current_user.id).all()
    unlocked_phases = [rp.phase_id for rp in rocket_parts]

    current_phase = progress.current_phase or 1

    parts = [
        {
            "phase":      phase,
            "isUnlocked": phase in unlocked_phases,
            "isCurrent":  phase == current_phase,
            "unlockedAt": None,
        }
        for phase in range(1, 13)
    ]

    return {
        "totalParts":   12,
        "unlockedParts": len(unlocked_phases),
        "currentPhase":  current_phase,
        "isLaunched":    len(unlocked_phases) >= 12,
        "launchDate":    None,
        "parts":         parts,
    }


@router.post("/unlock")
async def unlock_rocket_part(
    data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    phase = data.get("phase")
    if not phase or phase < 1 or phase > 12:
        raise HTTPException(status_code=400, detail="Invalid phase")

    from app.models import RocketPart
    existing = db.query(RocketPart).filter(
        RocketPart.user_id == current_user.id,
        RocketPart.phase_id == phase
    ).first()

    if not existing:
        part = RocketPart(
            user_id=current_user.id,
            phase_id=phase,
            part_name=ROCKET_PART_NAMES[phase],
        )
        db.add(part)

        # Update progress
        progress = _get_progress(current_user.id, db)
        xp_gain  = 500 if phase == 12 else 100
        progress.total_xp = (progress.total_xp or 0) + xp_gain
        if phase < 12:
            progress.current_phase = phase + 1

        db.commit()

    return {
        "message":   f"Phase {phase} — {ROCKET_PART_NAMES[phase]} unlocked",
        "part_name": ROCKET_PART_NAMES[phase],
        "xp_gained": 500 if phase == 12 else 100,
    }


@router.get("/history")
async def get_rocket_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    from app.models import RocketPart
    parts = db.query(RocketPart).filter(RocketPart.user_id == current_user.id).all()
    return [{"phase": p.phase_id, "unlockedAt": p.unlocked_at.isoformat() if p.unlocked_at else None} for p in parts]
