from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from ..core.exceptions import AppError

from ..schemas.user import UserCreate
from ..models.user import User

class UserRepository:
  def __init__(self, db: AsyncSession):
    self.db = db
    
  async def get_all_users(self):
    res = await self.db.execute(select(User))
    users = res.scalars().all()
    print(users)
    return users
  
  async def get_user_by_id(self, user_id: int):
    user = await self.db.get(User, user_id)
    
    if not user:
      raise AppError(status_code=404, message="Користувача не знайдено")
          
    return user
  
  async def get_user_by_email(self, user_email: str):
    user = select(User).where(User.email == user_email)
    result = await self.db.execute(user)
    return result.scalar_one_or_none()
  
  async def get_user_by_login(self, user_login: str):
    user = select(User).where(User.login == user_login)
    result = await self.db.execute(user)
    
    if not result:
      raise AppError(status_code=404, message="Користувача за логіном не знайдено")
    
    return result.scalar_one_or_none()
  
  async def create_user(self, user_data: UserCreate, hashed_password: str):
    new_user = User(login=user_data.login, email=user_data.email, password=hashed_password, avatar_url=None)
    try:
      self.db.add(new_user)
      await self.db.commit()
      await self.db.refresh(new_user)
      return new_user
    except Exception:
      await self.db.rollback()
      raise AppError(500, "Помилка при створенні")
  
  async def update_user(self, user: User):
    try:
      await self.db.commit()
      await self.db.refresh(user)
      return user
    except Exception:
      await self.db.rollback()
      raise AppError(500, 'Помилка при оновлені користувача')
    
  async def delete_user(self, user_id: int):
    user = await self.get_user_by_id(user_id)
    print('user', user)
    try:
      await self.db.delete(user)
      await self.db.commit()
      return user
    except Exception:
      await self.db.rollback()
      raise AppError(500, 'Помилка при видаленні користувача')
