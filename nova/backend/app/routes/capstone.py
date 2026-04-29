from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.security import get_current_user
from app.models import User, CapstoneProgress, RocketPart, UserProgress
from datetime import datetime
from pydantic import BaseModel
from typing import Optional
import json

router = APIRouter()

TRACK_INFO = {
    "A": {
        "name": "Image Classifier",
        "description": "Build a full image classification system with CNN, PyTorch, FastAPI, and React.",
        "stack": ["PyTorch", "CNN", "FastAPI", "React", "Docker"],
    },
    "B": {
        "name": "NLP Chatbot",
        "description": "Build a domain-specific intelligent chatbot with transformer fine-tuning and RAG.",
        "stack": ["Transformers", "RAG", "FastAPI", "React", "LangChain"],
    },
    "C": {
        "name": "RL Agent",
        "description": "Build an agent that learns to play a game or solve a task using reinforcement learning.",
        "stack": ["Q-Learning", "Policy Gradients", "Gymnasium", "React Dashboard"],
    },
}

SUB_PHASES = {
    1: {"title": "Select Your Track",           "description": "Choose which capstone project you will build."},
    2: {"title": "Architecture Plan",           "description": "Design your system architecture. ASTRA will review it."},
    3: {"title": "Data Pipeline",               "description": "Collect, clean, and preprocess your dataset."},
    4: {"title": "Build the Model",             "description": "Implement your model architecture in code."},
    5: {"title": "Train and Evaluate",          "description": "Train your model and hit the accuracy threshold."},
    6: {"title": "Build the API Backend",       "description": "Create a FastAPI backend to serve your model."},
    7: {"title": "Build the Frontend",          "description": "Build a React interface connected to your backend."},
    8: {"title": "Deploy and Submit",           "description": "Deploy to a live URL and submit your final project."},
}


def get_or_create_capstone(user_id: str, db: Session) -> CapstoneProgress:
    cap = db.query(CapstoneProgress).filter(CapstoneProgress.user_id == user_id).first()
    if not cap:
        cap = CapstoneProgress(user_id=user_id)
        db.add(cap)
        db.commit()
        db.refresh(cap)
    return cap


class SelectTrackRequest(BaseModel):
    track: str  # A, B, or C


class CompleteStepRequest(BaseModel):
    step:       int
    submission: Optional[str] = ""


@router.get("/status")
async def get_status(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    cap = get_or_create_capstone(current_user.id, db)
    completed = json.loads(cap.completed_steps or "[]")
    submissions = json.loads(cap.submissions or "{}")

    return {
        "track":           cap.track,
        "current_step":    cap.current_step,
        "completed_steps": completed,
        "submissions":     submissions,
        "is_complete":     cap.is_complete,
        "started_at":      cap.started_at.isoformat() if cap.started_at else None,
        "completed_at":    cap.completed_at.isoformat() if cap.completed_at else None,
        "track_info":      TRACK_INFO.get(cap.track) if cap.track else None,
        "sub_phases":      SUB_PHASES,
        "progress_pct":    round((len(completed) / 8) * 100),
    }


@router.post("/select-track")
async def select_track(
    body: SelectTrackRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if body.track not in ("A", "B", "C"):
        raise HTTPException(status_code=400, detail="Track must be A, B, or C")

    cap = get_or_create_capstone(current_user.id, db)
    cap.track        = body.track
    cap.current_step = 2  # Move to architecture plan
    completed        = json.loads(cap.completed_steps or "[]")
    if 1 not in completed:
        completed.append(1)
    cap.completed_steps = json.dumps(completed)
    db.commit()

    return {
        "status":     "track_selected",
        "track":      body.track,
        "track_info": TRACK_INFO[body.track],
        "next_step":  2,
        "message":    f"Track {body.track} selected. Proceeding to architecture planning.",
    }


@router.post("/complete-step")
async def complete_step(
    body: CompleteStepRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if body.step < 1 or body.step > 8:
        raise HTTPException(status_code=400, detail="Step must be between 1 and 8")

    cap = get_or_create_capstone(current_user.id, db)

    completed   = json.loads(cap.completed_steps or "[]")
    submissions = json.loads(cap.submissions or "{}")

    if body.step not in completed:
        completed.append(body.step)

    if body.submission:
        submissions[str(body.step)] = body.submission

    cap.completed_steps = json.dumps(completed)
    cap.submissions     = json.dumps(submissions)
    cap.current_step    = min(body.step + 1, 8) if body.step < 8 else 8

    # Check if all 8 steps complete
    all_done = all(s in completed for s in range(1, 9))
    if all_done and not cap.is_complete:
        cap.is_complete   = True
        cap.completed_at  = datetime.utcnow()

        # Unlock nose cone (phase 12 rocket part)
        existing = db.query(RocketPart).filter(
            RocketPart.user_id == current_user.id,
            RocketPart.phase_id == 12
        ).first()
        if not existing:
            nose_cone = RocketPart(
                user_id=current_user.id,
                phase_id=12,
                part_name="Nose Cone",
            )
            db.add(nose_cone)

            # Update progress
            progress = db.query(UserProgress).filter(
                UserProgress.user_id == current_user.id
            ).first()
            if progress:
                progress.total_xp = (progress.total_xp or 0) + 500

    db.commit()

    return {
        "status":          "step_complete",
        "step":            body.step,
        "completed_steps": completed,
        "next_step":       cap.current_step,
        "is_complete":     cap.is_complete,
        "nose_cone_unlocked": all_done,
        "astra_message": (
            "● All systems confirmed, Commander.\n"
            "Your AI system is live. Your code is deployed. Your architecture is sound.\n\n"
            "Phase 12 complete.\n\n"
            "━━━━━━━━━━━━━━━━━━━━━━\n\n"
            "Initiating final assembly sequence.\n"
            "Nose cone locked. Rocket assembly complete.\n\n"
            "You are no longer a student. You are an AI Engineer.\n\n"
            "Preparing launch sequence. T-minus 10 seconds.\n\n"
            "✦"
        ) if all_done else None,
    }


@router.get("/tracks")
async def get_tracks():
    """Public endpoint — no auth needed"""
    return TRACK_INFO


@router.get("/sub-phases")
async def get_sub_phases():
    """Public endpoint — no auth needed"""
    return SUB_PHASES
