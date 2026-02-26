import os
from fastapi import File, UploadFile

from ..core.utils import convert_file_to_url

from ..core.auth import create_token, hash_password, verify_password
from ..core.exceptions import AppError
from ..models.user import User
from ..schemas.user import UserCreate, UserLogin, UserUpdate
from ..repository.user_repository import UserRepository

class UserService:
  def __init__(self, repository: UserRepository):
    self.repository = repository
    
  async def get_all_users(self):
    users = await self.repository.get_all_users()
    
    return users
  
  async def get_user(self, user_id: int):
    user = await self.repository.get_user_by_id(user_id)
    return user
  
  async def create_user(self, user_data: UserCreate):
    existing_user = await self.repository.get_user_by_email(user_data.email)
    
    if existing_user:
      raise AppError(409, 'Користувача вже зареєстрован')

    hashed_password = hash_password(user_data.password)
    new_user = await self.repository.create_user(user_data, hashed_password)
    token = create_token(new_user.id)
    
    return new_user, token
  
  async def login_user(self, user_data: UserLogin):
    user = await self.repository.get_user_by_login(user_data.login)
    
    if not user:
      raise AppError(404, 'Користувача не знайдено')
    
    decoded_password = verify_password(user_data.password, user.password)
    
    if not decoded_password:
      raise AppError(400, 'Пароль введено невірно')
    
    token = create_token(user.id)
    return user, token
  
  async def update_user_avatar(self, user_id: int, avatar_url: UploadFile | None = File(None)):
    user = await self.repository.get_user_by_id(user_id)
    file_path = await convert_file_to_url(avatar_url, 'images')
    
    if not avatar_url:
      raise AppError(400, 'Аватар не загружен')
    
    if not user:
      raise AppError(400, 'Пользователь не найден')
    
    user.avatar_url = file_path
    return await self.repository.update_user(user)
  
  async def update_user(self, user_data: UserUpdate, user: User):
    updated_data = user_data.model_dump(exclude_unset=True)
    
    if not updated_data:
      raise AppError(400, 'Ніяких даних не було оновлено')
    
    for key, value in updated_data.items():
      if key == 'password':
        user.password = hash_password(value)
        continue
      
      setattr(user, key, value)

    return await self.repository.update_user(user)
    
  async def update_user_password(self, user: User, password: str, new_password: str):
    if password == new_password:
      raise AppError(409, 'Введено такий же пароль як і старий')
    
    hashed_password = hash_password(new_password)
    verified_password = verify_password(password, user.password)
    
    if not verified_password:
      raise AppError(500, 'Старий пароль не вірний')
    
    user.password = hashed_password
    
    await self.repository.update_user(user)
    
  async def delete_user(self, user_id: int):
    return await self.repository.delete_user(user_id)