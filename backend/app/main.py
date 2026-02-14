from fastapi import FastAPI
from .routes import user
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings

app = FastAPI(
    root_path="/api",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins = settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get('/')
async def health():
    return {'status': 'ok', 'message': 'Сервер работает'}

app.include_router(user.router)