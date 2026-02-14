from fastapi import Depends, HTTPException, Request

from ..core.exceptions import AppError
from ..core.auth import decode_token, get_token
from ..core.db import get_db
from ..models.user import User
from sqlalchemy.ext.asyncio import AsyncSession

from ..repository.user_repository import UserRepository
from ..services.user import UserService
from ..core.auth import oauth2_scheme

async def get_current_user(request: Request, db: AsyncSession = Depends(get_db)):
  token = get_token(request)
  print(token)
  if not token:
    raise AppError(401, 'Користувач не авторизован')
  
  payload = decode_token(token)
  
  user_id = payload['id']
  user = await db.get(User, user_id)

  if not user:
    raise AppError(401, "Користувача не знайдено")

  return user

# Зависимость для использовать БД в сервисе
def get_user_service(db: AsyncSession = Depends(get_db)):
  return UserService(UserRepository(db))

# async def get_current_user(token = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
#   print(oauth2_scheme)
#   try:
#     payload = decode_token(token)
#     user_id = payload['id']
#     print(user_id, payload)
#     if not user_id:
#       raise HTTPException(401, detail="Could not validate credentials", headers={"WWW-Authenticate": "Bearer"})
#   except JWTError:
#     raise HTTPException(401, detail="Could not validate credentials", headers={"WWW-Authenticate": "Bearer"})
  
#   query = select(User).where(User.id == user_id)
#   result = await db.execute(query)
#   user = result.scalar_one_or_none()
  
#   if not user:
#     raise HTTPException(4004, 'Користувач не знайден')
  
#   return user