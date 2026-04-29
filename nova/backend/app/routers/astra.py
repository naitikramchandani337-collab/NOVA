from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.schemas import AstraRequest, AstraResponse
from app.services.ai_service import stream_astra_response, get_astra_response
import json

router = APIRouter()


@router.get("/ping")
async def ping():
    return {
        "status": "ASTRA online",
        "message": "Mission Control connected",
        "version": "2.0.0",
    }


@router.post("/chat/stream")
async def chat_stream(req: AstraRequest):
    async def event_generator():
        try:
            async for chunk in stream_astra_response(req):
                data = json.dumps({"chunk": chunk, "done": False})
                yield f"data: {data}\n\n"
            yield f"data: {json.dumps({'chunk': '', 'done': True})}\n\n"
        except Exception as e:
            error_data = json.dumps({
                "error": f"ASTRA system error: {str(e)}",
                "done": True
            })
            yield f"data: {error_data}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
    )


@router.post("/chat", response_model=AstraResponse)
async def chat(req: AstraRequest):
    try:
        response = await get_astra_response(req)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"ASTRA system error: {str(e)}"
        )


@router.post("/analyze-confusion")
async def analyze_confusion(req: AstraRequest):
    from app.services.ai_service import analyze_confusion_signals

    if not req.context:
        raise HTTPException(
            status_code=400,
            detail="Learning context required"
        )

    analysis = analyze_confusion_signals(req.context)
    return {
        "analysis": analysis,
        "recommendations": {
            "high": "Switch to simpler explanations",
            "medium": "Provide additional clarity",
            "low": "Continue current approach"
        }.get(analysis["frustration_level"], "Continue monitoring")
    }


@router.post("/celebrate-progress")
async def celebrate_progress(data: dict):
    xp_earned = data.get("xp_earned", 0)
    quiz_score = data.get("quiz_score", 0)
    streak = data.get("streak", 0)

    if quiz_score >= 90:
        celebration = f"🚀 FLAWLESS launch sequence, Commander! +{xp_earned} XP earned. "
        if streak > 0:
            celebration += f"Streak at {streak} days! "
        celebration += "You're mastering these concepts!"
    elif quiz_score >= 70:
        celebration = f"🌟 Solid performance! +{xp_earned} XP earned. {quiz_score}% — mission-ready accuracy!"
    else:
        celebration = f"🪐 Every commander has rough launches. +{xp_earned} XP for the attempt. Let's review and get back on course!"

    return {
        "celebration": celebration,
        "encouragement": "Keep pushing forward, Commander 🚀"
    }


@router.get("/student-profile/{user_id}")
async def get_student_profile(user_id: str):
    return {
        "user_id": user_id,
        "learning_style": "balanced",
        "learning_speed": "medium",
        "weak_topics": [],
        "strong_topics": [],
        "preferred_explanation_depth": "medium",
        "total_interactions": 0,
        "success_rate": 0.0,
    }
