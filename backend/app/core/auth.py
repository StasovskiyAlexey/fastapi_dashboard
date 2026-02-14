from datetime import datetime, timedelta
from typing import Any, TypeVar
from fastapi import Request
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from jose import JWTError, jwt
from ..core.config import settings

T = TypeVar("T")
secret_key = settings.secret_key
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login", scheme_name='auth_scheme') # URL эндпоинта для логина

def hash_password(password: str):
  return pwd_context.hash(password)

def verify_password(password: str, hashed_password: str) -> bool:
  return pwd_context.verify(password, hashed_password)

def create_token(user_id: int) -> str:
  payload = {"id": user_id, "exp": datetime.utcnow() + timedelta(hours=24)}
  return jwt.encode(payload, secret_key, algorithm=ALGORITHM)

def decode_token(token: str) -> dict[str, Any]:
  try:
    return jwt.decode(token, secret_key, algorithms=[ALGORITHM])
  except JWTError:
    return {'message': 'Помилка при '}
  
def get_token(request: Request):
  token = request.cookies.get('access_token')
  return token