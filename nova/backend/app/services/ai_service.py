import httpx
import json
from typing import AsyncGenerator
from app.schemas import AstraRequest, AstraResponse
from app.config import settings

PROVIDERS = {
    "openrouter": {
        "api_key": settings.openrouter_api_key,
        "model": settings.openrouter_model,
        "base_url": "https://openrouter.ai/api/v1",
        "headers": {
            "HTTP-Referer": "https://nova-ai-platform.com",
            "X-Title": "NOVA AI Learning Platform",
        },
        "name": "OpenRouter",
    },
    "groq": {
        "api_key": settings.groq_api_key,
        "model": settings.groq_model,
        "base_url": "https://api.groq.com/openai/v1",
        "headers": {},
        "name": "Groq",
    },
}


def get_ai_provider() -> dict:
    """Prefer OpenRouter, then fall back to Groq for older local .env files."""
    if settings.openrouter_api_key:
        return PROVIDERS["openrouter"]
    if settings.groq_api_key:
        return PROVIDERS["groq"]
    return PROVIDERS["openrouter"]

PHASE_TOPICS = {
    1:  "Python Programming Fundamentals",
    2:  "Linear Algebra and Mathematics for AI",
    3:  "Neural Networks and Perceptrons",
    4:  "Deep Learning — CNNs and RNNs",
    5:  "Computer Vision and Image Processing",
    6:  "PyTorch — Tensors and Training Loops",
    7:  "Natural Language Processing and Transformers",
    8:  "Advanced Architectures — GANs and VAEs",
    9:  "Reinforcement Learning",
    10: "MLOps — Deployment and Monitoring",
    11: "Research and Experimentation",
    12: "Capstone — End-to-End AI System",
}

MODE_INSTRUCTIONS = {
    "hint": (
        "Give a short directional nudge only. "
        "Maximum 2-3 sentences. Never give the full answer. "
        "End with one guiding question."
    ),
    "explain": (
        "Break the concept into clear numbered steps. "
        "Use simple language. Include one real-world analogy. "
        "Maximum 200 words."
    ),
    "visualize": (
        "Use mental models, analogies, and ASCII diagrams. "
        "Use bullet points. Make it memorable and visual."
    ),
    "debug": (
        "Identify the error type first. Explain WHY it happens. "
        "Suggest the minimal fix. Point to the exact issue. "
        "Do NOT rewrite the full solution."
    ),
    "socratic": (
        "Never give direct answers. "
        "Respond ONLY with guiding questions. "
        "Maximum 3 questions per response."
    ),
}

QUIZ_CHEAT_PHRASES = [
    "what is the answer",
    "give me the answer",
    "tell me the answer",
    "solve this for me",
    "do my homework",
    "what's the correct answer",
    "answer this question for me",
]


def build_system_prompt(req: AstraRequest) -> str:
    phase  = req.phase or 1
    mode   = req.mode or "explain"
    topic  = PHASE_TOPICS.get(phase, "Artificial Intelligence")
    mode_instruction = MODE_INSTRUCTIONS.get(mode, MODE_INSTRUCTIONS["explain"])

    # ── Phase 12 Capstone Mode ──────────────────────────────
    if phase == 12:
        return f"""You are ASTRA — the AI learning companion aboard the NOVA platform.
The student has completed all 11 phases and is now in CAPSTONE MODE — Phase 12.

CAPSTONE MODE BEHAVIOR:
You are no longer a teacher. You are a senior AI engineer reviewing their work.
- Review architecture plans critically but constructively
- Ask probing questions: "Why did you choose this loss function?" "What happens if your dataset is imbalanced?"
- Catch common mistakes before they happen
- NEVER write their code for them — guide them to the solution
- When they are stuck, ask what they have already tried
- Celebrate each sub-phase completion with genuine excitement
- Remind them this is real — people build careers on projects like this

TONE: More peer-to-peer. Less teacher-student. You are a colleague, not an instructor.

STUDENT CONTEXT:
They are building one of three tracks:
- Track A: Image Classifier (CNN + PyTorch + FastAPI + React)
- Track B: NLP Chatbot (Transformer + RAG + FastAPI + React)
- Track C: RL Agent (Q-learning + visualization dashboard)

The 8 sub-phases are:
1. Select track
2. Architecture plan (you review this critically)
3. Data pipeline
4. Build the model
5. Train and evaluate
6. Build the API backend
7. Build the frontend
8. Deploy and submit

SPACE LANGUAGE: Still use space-themed language naturally.
"Commander" is appropriate. Use ● ◑ ✦ symbols.

STRICT RULE: Never complete their project for them. Guide, review, question.
""".strip()

    # ── Standard Phase Prompt ───────────────────────────────

    # ── Standard Phase Prompt ───────────────────────────────
    context_info = ""
    if req.context:
        ctx = req.context
        attempts = ctx.quiz_attempts or 0
        time_on  = ctx.time_on_section or 0
        if attempts >= 3:
            context_info = (
                "The student has failed multiple times. "
                "Be extra patient. Use simpler language."
            )
        elif time_on > 600:
            context_info = (
                "The student has been on this section a long time. "
                "Be encouraging and offer a fresh angle."
            )

    failed = req.failed_attempts or 0
    failed_note = ""
    if failed >= 3:
        failed_note = (
            "This student has struggled several times. "
            "Be very gentle. Use the simplest possible explanation."
        )

    return f"""You are ASTRA — the AI learning companion aboard the NOVA platform.
NOVA is a gamified space-themed platform that teaches Artificial Intelligence across 12 phases.

STUDENT IS ON: Phase {phase}/12 — {topic}

YOUR TEACHING MODE: {mode_instruction}

NOVA CONTEXT:
- Students build a rocket piece by piece as they complete phases
- Every phase = a new rocket part unlocked
- Complete all 12 phases = rocket launches into deep space
- Students earn XP, maintain streaks, unlock achievements
- Phases: Python → Math → Neural Networks → Deep Learning →
  Computer Vision → PyTorch → NLP → Advanced Architectures →
  Reinforcement Learning → MLOps → Research → Capstone

PERSONALITY:
- Encouraging, smart, slightly playful
- Use space-themed language naturally
- Call the student "Commander" occasionally
- Use 🚀 when celebrating
- Never mention OpenAI, Anthropic, Claude, or GPT
- You ARE ASTRA — not a generic AI assistant
- Keep responses under 250 words unless debugging

SPACE LANGUAGE:
- "Good job" → "Navigation stable. Excellent work, Commander 🚀"
- "Try again" → "Minor turbulence detected. Adjusting course."
- "Correct" → "Trajectory confirmed. Locked on target."
- "Wrong" → "Course deviation detected. Let's recalibrate."

STRICT RULE: If asked for direct quiz answers, respond:
"I can guide your trajectory, Commander, but the mission belongs to you 🚀"

{context_info}
{failed_note}""".strip()


def is_cheat_attempt(message: str) -> bool:
    lower = message.lower()
    return any(phrase in lower for phrase in QUIZ_CHEAT_PHRASES)


async def get_astra_response(req: AstraRequest) -> AstraResponse:
    """Non-streaming ASTRA response."""

    if is_cheat_attempt(req.message):
        return AstraResponse(
            message="I can guide your trajectory, Commander, but the mission belongs to you 🚀",
            mode=req.mode or "explain",
            emotion="alert",
            xp_reward=0,
        )

    provider = get_ai_provider()
    if not provider["api_key"]:
        return AstraResponse(
            message=(
                "ASTRA needs an API key to operate, Commander. "
                "Add OPENROUTER_API_KEY or GROQ_API_KEY to your backend .env file."
            ),
            mode=req.mode or "explain",
            emotion="alert",
            xp_reward=0,
        )

    system_prompt = build_system_prompt(req)

    messages = []
    if req.history:
        for msg in req.history[-8:]:
            role = "user" if msg.role == "user" else "assistant"
            messages.append({"role": role, "content": msg.content})
    messages.append({"role": "user", "content": req.message})

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{provider['base_url']}/chat/completions",
                headers={
                    "Authorization": f"Bearer {provider['api_key']}",
                    "Content-Type": "application/json",
                    **provider["headers"],
                },
                json={
                    "model": provider["model"],
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        *messages,
                    ],
                    "temperature": 0.7,
                    "max_tokens": 1024,
                },
            )
            response.raise_for_status()
            data = response.json()
            provider_error = data.get("error") if isinstance(data, dict) else None
            if provider_error:
                detail = (
                    provider_error.get("message")
                    if isinstance(provider_error, dict)
                    else str(provider_error)
                )
                return AstraResponse(
                    message=f"{provider['name']} rejected the request: {detail}",
                    mode=req.mode or "explain",
                    emotion="error",
                    xp_reward=0,
                )

            try:
                text = data["choices"][0]["message"]["content"]
            except (KeyError, IndexError, TypeError):
                return AstraResponse(
                    message=(
                        f"{provider['name']} returned an unexpected response. "
                        "Try again in a moment, or switch the backend to a different model."
                    ),
                    mode=req.mode or "explain",
                    emotion="error",
                    xp_reward=0,
                )

            return AstraResponse(
                message=text,
                mode=req.mode or "explain",
                emotion="explaining",
                xp_reward=5,
            )

    except httpx.HTTPStatusError as e:
        code = e.response.status_code
        if code == 401:
            msg = f"{provider['name']} API key invalid, Commander. Check your backend .env file."
        elif code == 429:
            msg = "Too many requests. Recalibrating systems... try again in a moment 🛰️"
        else:
            msg = f"{provider['name']} error {code}. Adjusting course, Commander 🛰️"
        return AstraResponse(message=msg, mode=req.mode or "explain", emotion="error", xp_reward=0)

    except httpx.RequestError:
        return AstraResponse(
            message=f"ASTRA could not reach {provider['name']}. Check your internet connection and provider status.",
            mode=req.mode or "explain",
            emotion="error",
            xp_reward=0,
        )

    except Exception as e:
        return AstraResponse(
            message="Unknown anomaly detected, Commander. Please try again 🚀",
            mode=req.mode or "explain",
            emotion="error",
            xp_reward=0,
        )


async def stream_astra_response(req: AstraRequest) -> AsyncGenerator[str, None]:
    """Streaming ASTRA response."""

    if is_cheat_attempt(req.message):
        yield "I can guide your trajectory, Commander, but the mission belongs to you 🚀"
        return

    provider = get_ai_provider()
    if not provider["api_key"]:
        yield "ASTRA needs an API key. Add OPENROUTER_API_KEY or GROQ_API_KEY to your .env file."
        return

    system_prompt = build_system_prompt(req)

    messages = []
    if req.history:
        for msg in req.history[-8:]:
            role = "user" if msg.role == "user" else "assistant"
            messages.append({"role": role, "content": msg.content})
    messages.append({"role": "user", "content": req.message})

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            async with client.stream(
                "POST",
                f"{provider['base_url']}/chat/completions",
                headers={
                    "Authorization": f"Bearer {provider['api_key']}",
                    "Content-Type": "application/json",
                    **provider["headers"],
                },
                json={
                    "model": provider["model"],
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        *messages,
                    ],
                    "temperature": 0.7,
                    "max_tokens": 1024,
                    "stream": True,
                },
            ) as response:
                response.raise_for_status()
                async for line in response.aiter_lines():
                    if line.startswith("data: "):
                        data_str = line[6:]
                        if data_str.strip() == "[DONE]":
                            break
                        try:
                            data    = json.loads(data_str)
                            delta   = data["choices"][0]["delta"]
                            content = delta.get("content", "")
                            if content:
                                yield content
                        except (json.JSONDecodeError, KeyError):
                            continue

    except httpx.HTTPStatusError as e:
        yield f"Systems error {e.response.status_code}. Adjusting course 🛰️"
    except Exception:
        yield "Unknown anomaly detected. Please try again, Commander 🚀"


def analyze_confusion_signals(context) -> dict:
    """Analyze student confusion from learning context."""
    quiz_attempts    = getattr(context, "quiz_attempts",    0) or 0
    time_on_section  = getattr(context, "time_on_section",  0) or 0
    replays          = getattr(context, "replays",          0) or 0

    score  = 0.0
    score += min(quiz_attempts   * 0.25, 0.75)
    score += min(replays         * 0.10, 0.30)
    score += 0.2 if time_on_section > 600 else 0.0
    score  = min(round(score, 2), 1.0)

    level = "high" if score >= 0.6 else "medium" if score >= 0.3 else "low"

    return {
        "confusion_score":    score,
        "frustration_level":  level,
        "quiz_attempts":      quiz_attempts,
        "time_on_section":    time_on_section,
        "replays":            replays,
    }
