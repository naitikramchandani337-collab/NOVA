from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import Base, engine
from app.routes import auth, progress, phases, gamification
from app.routes import profile as profile_router
from app.routes import settings as user_settings_router
from app.routes import friends as friends_router
from app.routes import rocket as rocket_router
from app.routes import code as code_router
from app.routes import capstone as capstone_router
from app.routers import astra

# Initialize FastAPI app
app = FastAPI(
    title="NOVA AI Learning Platform",
    description="Build a rocket-powered AI system and launch it into deep space",
    version="0.1.0",
)

@app.on_event("startup")
async def startup_event():
    # Create tables
    Base.metadata.create_all(bind=engine)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router,                    prefix="/api/auth",         tags=["auth"])
app.include_router(progress.router,                prefix="/api/user",          tags=["user"])
app.include_router(phases.router,                  prefix="/api/phases",        tags=["phases"])
app.include_router(gamification.router,            prefix="/api/gamification",  tags=["gamification"])
app.include_router(astra.router,                   prefix="/api/astra",         tags=["ASTRA"])
app.include_router(profile_router.router,          prefix="/api/profile",       tags=["profile"])
app.include_router(user_settings_router.router,    prefix="/api/settings",      tags=["settings"])
app.include_router(friends_router.router,          prefix="/api/friends",       tags=["friends"])
app.include_router(rocket_router.router,           prefix="/api/rocket",        tags=["rocket"])
app.include_router(code_router.router,             prefix="/api/code",          tags=["code"])
app.include_router(capstone_router.router,         prefix="/api/phases/12",     tags=["capstone"])


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Welcome to NOVA AI Learning Platform",
        "version": "0.1.0",
        "docs": "/docs",
    }


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.debug,
    )
