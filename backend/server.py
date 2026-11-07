"""Les Ombres du Pont-Levis — API FastAPI."""

from contextlib import asynccontextmanager

from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from lib.db import ensure_indexes


@asynccontextmanager
async def lifespan(_: FastAPI):
    await ensure_indexes()
    yield


app = FastAPI(title="Les Ombres du Pont-Levis", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_router = APIRouter(prefix="/api")

from routers.saves import router as saves_router  # noqa: E402

api_router.include_router(saves_router)

# Include the router in the main app
app.include_router(api_router)
