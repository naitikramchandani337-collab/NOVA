from sqlalchemy import Column, String, Integer, DateTime, Boolean, ForeignKey, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id            = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email         = Column(String, unique=True, nullable=False, index=True)
    username      = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    created_at    = Column(DateTime, default=datetime.utcnow)
    updated_at    = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    progress          = relationship("UserProgress",   back_populates="user", uselist=False, cascade="all, delete-orphan")
    phase_completions = relationship("PhaseCompletion", back_populates="user", cascade="all, delete-orphan")
    rocket_parts      = relationship("RocketPart",     back_populates="user", cascade="all, delete-orphan")
    achievements      = relationship("Achievement",    back_populates="user", cascade="all, delete-orphan")
    profile           = relationship("UserProfile",    back_populates="user", uselist=False, cascade="all, delete-orphan")
    settings          = relationship("UserSettings",   back_populates="user", uselist=False, cascade="all, delete-orphan")
    sent_requests     = relationship("Friendship", foreign_keys="Friendship.sender_id",   back_populates="sender",   cascade="all, delete-orphan")
    received_requests = relationship("Friendship", foreign_keys="Friendship.receiver_id", back_populates="receiver", cascade="all, delete-orphan")
    notifications     = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    activities        = relationship("Activity",     back_populates="user", cascade="all, delete-orphan")


class UserProgress(Base):
    __tablename__ = "user_progress"

    id                 = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id            = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    current_phase      = Column(Integer, default=1)
    total_xp           = Column(Integer, default=0)
    current_level      = Column(Integer, default=1)
    streak_days        = Column(Integer, default=0)
    last_activity_date = Column(DateTime, nullable=True)
    created_at         = Column(DateTime, default=datetime.utcnow)
    updated_at         = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="progress")


class PhaseCompletion(Base):
    __tablename__ = "phase_completions"

    id           = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id      = Column(String, ForeignKey("users.id"), nullable=False)
    phase_id     = Column(Integer, nullable=False)
    completed_at = Column(DateTime, default=datetime.utcnow)
    quiz_score   = Column(Integer, nullable=True)
    xp_earned    = Column(Integer, default=0)
    created_at   = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="phase_completions")
    __table_args__ = (UniqueConstraint("user_id", "phase_id", name="uq_user_phase"),)


class RocketPart(Base):
    __tablename__ = "rocket_parts"

    id          = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id     = Column(String, ForeignKey("users.id"), nullable=False)
    phase_id    = Column(Integer, nullable=False)
    part_name   = Column(String, nullable=False)
    unlocked_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="rocket_parts")
    __table_args__ = (UniqueConstraint("user_id", "phase_id", name="uq_user_rocket_phase"),)


class Achievement(Base):
    __tablename__ = "achievements"

    id               = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id          = Column(String, ForeignKey("users.id"), nullable=False)
    achievement_key  = Column(String, nullable=False)
    achievement_name = Column(String, nullable=False)
    description      = Column(String, nullable=True)
    unlocked_at      = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="achievements")
    __table_args__ = (UniqueConstraint("user_id", "achievement_key", name="uq_user_achievement"),)


# ── Profile ──────────────────────────────────────────────
class UserProfile(Base):
    __tablename__ = "user_profiles"

    id           = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id      = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    display_name = Column(String(50),  nullable=True)
    bio          = Column(String(250), default="")
    avatar_url   = Column(String(500), default="")
    avatar_frame = Column(String(50),  default="default")
    title        = Column(String(100), default="Space Cadet")
    country      = Column(String(50),  default="")
    timezone     = Column(String(50),  default="UTC")
    rocket_name  = Column(String(50),  default="Nova-1")

    is_profile_public = Column(Boolean, default=True)
    show_activity     = Column(Boolean, default=True)
    show_stats        = Column(Boolean, default=True)
    show_rocket       = Column(Boolean, default=True)

    joined_at   = Column(DateTime, default=datetime.utcnow)
    last_active = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="profile")


# ── Settings ─────────────────────────────────────────────
class UserSettings(Base):
    __tablename__ = "user_settings"

    id      = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False)

    # Appearance
    theme             = Column(String(20), default="dark")
    accent_color      = Column(String(20), default="teal")
    font_size         = Column(String(10), default="medium")
    reduce_animations = Column(Boolean, default=False)
    compact_mode      = Column(Boolean, default=False)

    # ASTRA
    astra_mode         = Column(String(20), default="explain")
    astra_auto_open    = Column(Boolean, default=False)
    astra_show_hints   = Column(Boolean, default=True)
    astra_difficulty   = Column(String(20), default="adaptive")

    # Notifications
    notify_friend_requests = Column(Boolean, default=True)
    notify_achievements    = Column(Boolean, default=True)
    notify_streak_reminder = Column(Boolean, default=True)
    notify_leaderboard     = Column(Boolean, default=True)
    notify_new_content     = Column(Boolean, default=True)
    notify_email           = Column(Boolean, default=False)

    # Privacy
    allow_friend_requests  = Column(Boolean, default=True)
    show_online_status     = Column(Boolean, default=True)
    show_learning_activity = Column(Boolean, default=True)

    user = relationship("User", back_populates="settings")


# ── Friendships ───────────────────────────────────────────
class Friendship(Base):
    __tablename__ = "friendships"

    id          = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    sender_id   = Column(String, ForeignKey("users.id"), nullable=False)
    receiver_id = Column(String, ForeignKey("users.id"), nullable=False)
    status      = Column(String(20), default="pending")  # pending | accepted | declined | blocked
    created_at  = Column(DateTime, default=datetime.utcnow)
    accepted_at = Column(DateTime, nullable=True)

    sender   = relationship("User", foreign_keys=[sender_id],   back_populates="sent_requests")
    receiver = relationship("User", foreign_keys=[receiver_id], back_populates="received_requests")

    __table_args__ = (UniqueConstraint("sender_id", "receiver_id", name="uq_friendship"),)


# ── Notifications ─────────────────────────────────────────
class Notification(Base):
    __tablename__ = "notifications"

    id         = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id    = Column(String, ForeignKey("users.id"), nullable=False)
    type       = Column(String(30), nullable=False)
    title      = Column(String(100), nullable=False)
    message    = Column(String(500), nullable=False)
    data       = Column(Text, default="{}")
    is_read    = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")


# ── Activity Feed ─────────────────────────────────────────
class Activity(Base):
    __tablename__ = "activities"

    id            = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id       = Column(String, ForeignKey("users.id"), nullable=False)
    activity_type = Column(String(30), nullable=False)
    title         = Column(String(200), nullable=False)
    description   = Column(String(500), default="")
    xp_earned     = Column(Integer, default=0)
    phase         = Column(Integer, nullable=True)
    created_at    = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="activities")


# ── Capstone Progress (Phase 12) ─────────────────────────
class CapstoneProgress(Base):
    __tablename__ = "capstone_progress"

    id              = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id         = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    track           = Column(String(1), nullable=True)          # A, B, or C
    completed_steps = Column(Text, default="[]")                # JSON array [1,2,3...]
    current_step    = Column(Integer, default=1)
    submissions     = Column(Text, default="{}")                # JSON {step: submission}
    is_complete     = Column(Boolean, default=False)
    started_at      = Column(DateTime, default=datetime.utcnow)
    completed_at    = Column(DateTime, nullable=True)

    user = relationship("User", backref="capstone")
