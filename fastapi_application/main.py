from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from api.resume import router as resume_router
from api.history import router as history_router
from auth.user_manager import auth_manager
from database.database import db
from config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        from alembic.config import Config
        from alembic import command

        alembic_cfg = Config("alembic.ini")
        command.upgrade(alembic_cfg, "head")

    except Exception as e:
        print(f"Alembic migration failed: {e}")
        db.init_engine()
        await db.create_tables()

    yield

    try:
        await db.drop_tables()
    except Exception as e:
        print(f"Error during cleanup: {e}")

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:3000",
    settings.FRONTEND_URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(resume_router)

app.include_router(history_router)

app.include_router(
    auth_manager.get_register_router(),
    prefix="/auth",
    tags=["auth"],
)

app.include_router(
    auth_manager.get_auth_router(),
    prefix="/auth/jwt",
    tags=["auth"],
)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000)
