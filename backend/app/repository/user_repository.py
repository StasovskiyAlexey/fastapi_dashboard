from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import delete, select

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
    new_user = User(login=user_data.login, email=user_data.email, password=hashed_password)
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
      raise HTTPException(500, 'Помилка при видаленні користувача')
    
  # async def update_user_password(self, user):
  #   try:
  #     await self.db.commit()
  #     return user
  #   except Exception:
  #     await self.db.rollback()
  #     raise HTTPException(500, 'Не вдалося оновити пароль')

  # async def get_all_users(self):
  #   res = await self.db.execute(select(User))
  #   return res.scalars().all()

  # async def get_user_by_id(self, user_id: int):
  #   user = await self.db.get(User, user_id)
    
  #   if not user:
  #     raise HTTPException(404, 'Юзера з таким ID не знайдено')
  
  #   return user

  # async def get_user_by_email(self, user_email: str):
  #   user = select(User).where(User.email == user_email)
  #   result = await self.db.execute(user)
  #   return result.scalar_one_or_none()

  # async def create_user(self, user_data: UserCreate):
  #   existing_user = await self.get_user_by_email(user_data.email)
  #   hashed_password = hash_password(user_data.password)

  #   if existing_user:
  #     raise HTTPException(400, 'Користувач з таким email вже існує')

  #   try:
  #     new_user = User(
  #       login=user_data.login,
  #       email=user_data.email,
  #       password=hashed_password
  #     )

  #     self.db.add(new_user)
  #     await self.db.commit()
  #     await self.db.refresh(new_user)
      
  #     token = create_token(new_user.id)
  #     return new_user, token
  #   except Exception as e:
  #     print(f"Помилка реєстрації: {e}")
  #     raise HTTPException(500, e)

  # async def login_user(self, user_data: UserLogin):
  #   user = await self.get_user_by_email(user_data.email)
  #   print('test', user)
  #   if not user:
  #     raise HTTPException(401, 'Invalid credentials')

  #   decoded_password = verify_password(user_data.password, user.password)

  #   if not decoded_password:
  #     raise HTTPException(401, 'Введений пароль невірний')

  #   token = create_token(user.id)
  #   return user, token

  # async def update_user(self, user_data: UserUpdate, user: User):
  #   # model_dump — это метод, который превращает объект класса (модель) в обычный Python-словарь (dict)
  #   updated_data = user_data.model_dump(exclude_defaults=True)
  #   print(updated_data)
  #   if not updated_data:
  #     raise HTTPException(400, detail='Жодні дані не були оновлені')
    
  #   print('updated data', updated_data)

  #   if 'email' in updated_data:
  #     updated_data["email"] = updated_data['email']
      
  #   if 'login' in updated_data:
  #     updated_data["login"] = updated_data['login']

  #   for key, value in updated_data.items():
  #     # user.login = data.login тоже самое что setattr
  #     setattr(user, key, value)

  #   try:
  #     await self.db.commit()
  #     await self.db.refresh(user)
  #     return user
  #   except Exception as e:
  #     await self.db.rollback()
  #     raise HTTPException(500, 'Помилка при оновлені даних')
    
  # async def update_user_password(self, user: User, user_password: str, new_password: str):
  #   verified_password = verify_password(user_password, user.password)
  #   if not verified_password:
  #     raise HTTPException(400, 'Старий пароль введено невірно')
    
  #   user.password = hash_password(new_password)

  #   if user_password == new_password:
  #     raise HTTPException(500, 'Поточний пароль такий самий, як і введений новий')
  #   print (user_password, new_password, user)
  #   try:
  #     await self.db.commit()
  #     return user
  #   except Exception:
  #     await self.db.rollback()
  #     raise HTTPException(500, 'Не вдалося оновити пароль')
    
  # async def delete_user(self, user_id: int):
  #   if not user_id or user_id == 0:
  #     raise HTTPException(404, f"Користувач за {user_id} не знайдено")
    
  #   try:
  #     query = delete(User).where(User.id == user_id)
  #     result = await self.db.execute(query)
  #     user = result.scalar_one_or_none()
  #     return user
  #   except Exception:
  #     await self.db.rollback()
  #     raise HTTPException(500, 'Помилка при видаленні користувача')