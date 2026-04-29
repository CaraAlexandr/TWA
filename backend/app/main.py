from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.routes import notes


settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="REST API for the Smart Notes laboratory project.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok", "environment": settings.environment}


app.include_router(notes.router, prefix="/api")
