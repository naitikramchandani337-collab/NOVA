# NOVA API Documentation

## Base URL
```
http://localhost:8000/api
```

## Authentication
All endpoints (except `/auth/register` and `/auth/login`) require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "password123"
}

Response: 201 Created
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "username",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Login
```
POST /auth/login
Content-Type: application/x-www-form-urlencoded

username=user@example.com&password=password123

Response: 200 OK
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username"
  }
}
```

### Get Current User
```
GET /auth/me

Response: 200 OK
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "username",
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

## User Progress Endpoints

### Get User Progress
```
GET /user/progress

Response: 200 OK
{
  "user_id": "uuid",
  "current_phase": 1,
  "total_xp": 150,
  "current_level": 2,
  "streak_days": 5,
  "last_activity_date": "2024-01-15",
  "phases_completed": [1],
  "rocket_parts_unlocked": [1]
}
```

### Get User Stats
```
GET /user/stats

Response: 200 OK
{
  "total_xp": 150,
  "current_level": 2,
  "streak_days": 5,
  "total_phases_completed": 1,
  "total_achievements": 2,
  "rank": 45
}
```

### Get Achievements
```
GET /user/achievements

Response: 200 OK
{
  "achievements": [
    {
      "key": "first_steps",
      "name": "First Steps",
      "description": "Complete Phase 1",
      "unlocked_at": "2024-01-10T12:00:00Z",
      "icon": "url"
    }
  ]
}
```

---

## Phase Endpoints

### List All Phases
```
GET /phases

Response: 200 OK
{
  "phases": [
    {
      "id": 1,
      "name": "Foundations",
      "description": "What is AI?",
      "rocket_part": "Base",
      "xp_reward": 100,
      "status": "locked|in_progress|completed",
      "progress": 0
    }
  ]
}
```

### Get Phase Details
```
GET /phases/{id}

Response: 200 OK
{
  "id": 1,
  "name": "Foundations",
  "description": "What is AI?",
  "rocket_part": "Base",
  "xp_reward": 100,
  "lessons": [
    {
      "id": "lesson_1",
      "title": "Introduction to AI",
      "content": "markdown content...",
      "duration": 15,
      "video_url": "https://..."
    }
  ],
  "ai_demo": {
    "title": "Neural Network Visualization",
    "description": "See how neurons fire",
    "model_type": "neural_network"
  },
  "quiz": {
    "questions": [
      {
        "id": "q1",
        "question": "What is AI?",
        "options": ["...", "...", "...", "..."],
        "explanation": "AI stands for..."
      }
    ],
    "passing_score": 70
  }
}
```

### Start Phase
```
POST /phases/{id}/start

Response: 200 OK
{
  "phase_id": 1,
  "started_at": "2024-01-15T10:00:00Z",
  "status": "in_progress"
}
```

### Complete Phase
```
POST /phases/{id}/complete
Content-Type: application/json

{
  "quiz_score": 85
}

Response: 200 OK
{
  "phase_id": 1,
  "completed_at": "2024-01-15T11:00:00Z",
  "xp_earned": 100,
  "rocket_part_unlocked": "Base",
  "level_up": true,
  "new_level": 2
}
```

---

## AI Demo Endpoints

### Get Demo Data
```
GET /phases/{id}/demo

Response: 200 OK
{
  "demo_id": "demo_1",
  "title": "Neural Network Visualization",
  "data": {
    "neurons": [...],
    "connections": [...],
    "activations": [...]
  }
}
```

### Run Live Demo
```
POST /phases/{id}/demo/run
Content-Type: application/json

{
  "input": "sample input data",
  "parameters": {
    "learning_rate": 0.01,
    "epochs": 10
  }
}

Response: 200 OK
{
  "demo_id": "demo_1",
  "status": "running|completed",
  "progress": 50,
  "results": {
    "output": "...",
    "metrics": {...}
  }
}
```

---

## Gamification Endpoints

### Get Leaderboard
```
GET /leaderboard?limit=100&offset=0

Response: 200 OK
{
  "leaderboard": [
    {
      "rank": 1,
      "user_id": "uuid",
      "username": "user1",
      "total_xp": 5000,
      "level": 10,
      "streak": 30
    }
  ],
  "total": 1000
}
```

### Get Weekly Leaderboard
```
GET /leaderboard/weekly?limit=100&offset=0

Response: 200 OK
{
  "week": "2024-01-08 to 2024-01-14",
  "leaderboard": [...]
}
```

### Use Streak Freeze
```
POST /streak/freeze

Response: 200 OK
{
  "streak_frozen": true,
  "freeze_expires_at": "2024-02-15T00:00:00Z"
}
```

---

## Project Endpoints

### Get Project Status
```
GET /project/status

Response: 200 OK
{
  "project_id": "nova_ai",
  "name": "NOVA AI",
  "description": "Build an AI system across 10 phases",
  "progress": 10,
  "tasks": [
    {
      "id": "task_1",
      "phase_id": 1,
      "title": "Set up environment",
      "status": "completed",
      "completed_at": "2024-01-10T12:00:00Z"
    }
  ]
}
```

### Submit Project Task
```
POST /project/task/{id}/submit
Content-Type: application/json

{
  "code": "python code...",
  "output": "execution output..."
}

Response: 200 OK
{
  "task_id": "task_1",
  "status": "submitted|approved|rejected",
  "feedback": "Great work!",
  "xp_earned": 15
}
```

### Get Project Code
```
GET /project/code

Response: 200 OK
{
  "code": "full project code...",
  "language": "python",
  "last_updated": "2024-01-15T10:00:00Z"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Invalid input"
}
```

### 401 Unauthorized
```json
{
  "detail": "Not authenticated"
}
```

### 403 Forbidden
```json
{
  "detail": "Not enough permissions"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

---

## Rate Limiting

- 100 requests per minute per user
- 1000 requests per hour per user

---

## WebSocket Endpoints (Future)

### Live Demo Stream
```
WS /ws/demo/{demo_id}

Messages:
{
  "type": "progress|result|error",
  "data": {...}
}
```

### Leaderboard Updates
```
WS /ws/leaderboard

Messages:
{
  "type": "update",
  "data": {
    "user_id": "uuid",
    "new_xp": 5000,
    "new_rank": 1
  }
}
```
