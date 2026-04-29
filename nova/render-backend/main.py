from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import httpx
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_MODEL = os.getenv(
    "OPENROUTER_MODEL",
    "mistralai/mistral-7b-instruct:free"
)


class Message(BaseModel):
    role: str
    content: str


class AstraRequest(BaseModel):
    message: str
    mode: Optional[str] = "explain"
    phase: Optional[int] = 1
    history: Optional[List[Message]] = []
    username: Optional[str] = "Commander"


@app.get("/")
def root():
    return {"status": "NOVA ASTRA API", "message": "Systems online"}


@app.get("/health")
def health():
    return {"status": "ASTRA online", "message": "Systems nominal"}


@app.post("/api/astra/chat")
async def chat(req: AstraRequest):
    if not OPENROUTER_API_KEY:
        return {
            "message": "ASTRA needs an API key. Add OPENROUTER_API_KEY",
            "mode": req.mode,
            "emotion": "alert",
            "xp_reward": 0
        }

    system = f"""You are ASTRA — the AI companion aboard the NOVA learning platform.
NOVA teaches AI from scratch across 12 phases in a space theme.
Current phase: {req.phase}/12
Current mode: {req.mode}

Personality:
- Encouraging and smart
- Use space themed language
- Call student Commander occasionally
- Use symbols like bullet and circle instead of emojis
- Keep responses under 250 words
- Never mention OpenAI Anthropic or GPT

Teaching modes:
- hint: Short nudges only, no full answers
- explain: Step by step with examples
- visualize: Mental models and diagrams
- debug: Analyze code and explain errors
- socratic: Only ask guiding questions

If asked for quiz answers say: I can guide your trajectory Commander but the mission belongs to you"""

    messages = [{"role": "system", "content": system}]

    for msg in (req.history or [])[-8:]:
        messages.append({
            "role": msg.role,
            "content": msg.content
        })

    messages.append({"role": "user", "content": req.message})

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://nova-28eea.web.app",
                    "X-Title": "NOVA AI Platform"
                },
                json={
                    "model": OPENROUTER_MODEL,
                    "messages": messages,
                    "temperature": 0.7,
                    "max_tokens": 1024,
                }
            )
            response.raise_for_status()
            data = response.json()
            text = data["choices"][0]["message"]["content"]

            return {
                "message": text,
                "mode": req.mode,
                "emotion": "explaining",
                "xp_reward": 5
            }

    except httpx.HTTPStatusError as e:
        return {
            "message": f"Systems error {e.response.status_code}. Adjusting course",
            "mode": req.mode,
            "emotion": "error",
            "xp_reward": 0
        }
    except Exception:
        return {
            "message": "Unknown anomaly detected. Please try again Commander",
            "mode": req.mode,
            "emotion": "error",
            "xp_reward": 0
        }
