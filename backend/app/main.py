import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from .routes import user
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings

app = FastAPI(
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

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOAD_DIR = os.path.join(BASE_DIR, "images")
print(BASE_DIR, UPLOAD_DIR)
app.mount("/images", StaticFiles(directory="/app/images"), name="images")

@app.get('/')
async def health():
    return {'status': 'ok', 'message': 'Сервер работает'}

app.include_router(user.router)