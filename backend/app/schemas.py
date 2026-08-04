from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List
from uuid import UUID


# Auth Schemas
class UserRegister(BaseModel):
    email: EmailStr
    username: str
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# User Schemas
class UserResponse(BaseModel):
    id: UUID
    email: str
    username: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserProgressResponse(BaseModel):
    current_phase: int
    total_xp: int
    current_level: int
    streak_days: int
    last_activity_date: Optional[datetime]
    
    class Config:
        from_attributes = True


class UserStatsResponse(BaseModel):
    user: UserResponse
    progress: UserProgressResponse
    phases_completed: int
    rocket_parts_unlocked: int
    achievements_unlocked: int


# Phase Schemas
class PhaseCompletionResponse(BaseModel):
    phase_id: int
    completed_at: datetime
    quiz_score: Optional[int]
    xp_earned: int
    
    class Config:
        from_attributes = True


class RocketPartResponse(BaseModel):
    phase_id: int
    part_name: str
    unlocked_at: datetime
    
    class Config:
        from_attributes = True


class AchievementResponse(BaseModel):
    achievement_key: str
    achievement_name: str
    description: Optional[str]
    unlocked_at: datetime
    
    class Config:
        from_attributes = True


# Leaderboard Schemas
class LeaderboardEntry(BaseModel):
    rank: int
    username: str
    total_xp: int
    current_level: int
    phases_completed: int


class LeaderboardResponse(BaseModel):
    entries: List[LeaderboardEntry]
    user_rank: Optional[int]
    total_users: int


# AI Schemas (Enhanced ASTRA)
from enum import Enum

class AstraMode(str, Enum):
    hint       = "hint"
    explain    = "explain"
    visualize  = "visualize"
    debug      = "debug"
    socratic   = "socratic"

class ChatMessage(BaseModel):
    # ✅ Accept both 'assistant' and 'astra' from frontend
    role:    str
    content: str

class LearningContext(BaseModel):
    quiz_attempts:   Optional[int] = 0
    time_on_section: Optional[int] = 0
    replays:         Optional[int] = 0
    weak_topics:     Optional[List[str]] = []

class AstraRequest(BaseModel):
    message:         str
    mode:            Optional[str] = "explain"
    phase:           Optional[int] = 1
    lesson:          Optional[str] = ""
    user_id:         Optional[str] = "anonymous"
    history:         Optional[List[ChatMessage]] = []
    context:         Optional[LearningContext] = None
    failed_attempts: Optional[int] = 0

class AstraResponse(BaseModel):
    # ✅ Use 'message' field — matches ai_service.py output
    message:        str
    mode:           Optional[str] = "explain"
    emotion:        Optional[str] = "explaining"
    xp_reward:      Optional[int] = 5
    suggested_mode: Optional[str] = None
    phase_complete: Optional[bool] = False

class AIChatRequest(BaseModel):
    message: str
    phase_id: Optional[int] = None
    lesson_id: Optional[str] = None
    context: Optional[str] = None
    history: List[dict] = []

class AIChatResponse(BaseModel):
    response: str
    state: str = "idle"
