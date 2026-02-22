from fastapi import APIRouter, Depends, File, Response, UploadFile

from ..core.exceptions import AppError
from ..services.user import UserService
from ..dependencies.user import get_current_user, get_user_service
from ..models.user import User
from ..schemas.response import SuccessResponse
from ..schemas.user import UserCreate, UserLogin, UserPasswordRequest, UserResponse, UserUpdate, UsersListResponse
import os

router = APIRouter(prefix='/users', tags=['Users'])

@router.get('/me', response_model=SuccessResponse[UserResponse])
async def me(user: User = Depends(get_current_user)):
  print(user)
  return SuccessResponse(
    message='Користувач авторизован',
    data=user
  )

@router.get('/', response_model=SuccessResponse[UsersListResponse])
async def get_users(service: UserService = Depends(get_user_service)):
  users = await service.get_all_users()
  print(users)
  return SuccessResponse(
    data={'users': users}
  )

@router.get('/{user_id}', response_model=SuccessResponse[UserResponse])
async def get_user(user_id: int, service: UserService = Depends(get_user_service)):
  user = await service.get_user(user_id)
  return SuccessResponse(
    data=user
  )

@router.post('/register', response_model=SuccessResponse[UserResponse])
async def register_user(response: Response, user_data: UserCreate, service: UserService = Depends(get_user_service)):
  new_user, token = await service.create_user(user_data)
  
  print('token', token)
  
  response.set_cookie(
    key="access_token",
    value=token,
    httponly=True,
    secure=False,
    max_age=3600,
    samesite="lax"
  )

  return SuccessResponse(
    message='Користувач успішно зареєстрован',
    data=new_user
  )

@router.post('/login', response_model=SuccessResponse[UserResponse])
async def login_user(user_data: UserLogin, response: Response, service: UserService = Depends(get_user_service)):
  user, token = await service.login_user(user_data)

  response.set_cookie(
    key="access_token",
    value=token,
    httponly=True,
    secure=True,
    max_age=3600,
    samesite="lax"
  )

  return SuccessResponse(
    message='Успішний вхід в аккаунт',
    data=user
  )

@router.post('/logout', response_model=SuccessResponse)
async def logout(response: Response, current_user = Depends(get_current_user)):
  response.delete_cookie(
    key='access_token',
    path='/',
    httponly=True,
    samesite="lax",
    secure=False
  )
  
  return SuccessResponse(
    message='Успішний вихід з аккаунту'
  )

@router.patch('/update_user', response_model=SuccessResponse[UserResponse])
async def update_user(user_data = Depends(UserUpdate.as_form), service: UserService = Depends(get_user_service), current_user: User = Depends(get_current_user), avatar_url: UploadFile | None = File(None)):
  updated_user = await service.update_user(user_data, current_user, avatar_url)
  return SuccessResponse(
    message='Користувач успішно оновлен',
    data=updated_user
  ) 

@router.patch('/update_user_password', response_model=SuccessResponse[UserResponse])
async def update_user_password(data: UserPasswordRequest, service: UserService = Depends(get_user_service), user: User = Depends(get_current_user)):
  updated_user = await service.update_user_password(user, data.password, data.new_password)
  return SuccessResponse(
    message='Пароль успішно змінено',
    data=updated_user
  )
  
# user: User = Depends(get_current_user)
@router.delete('/delete_user', response_model=SuccessResponse[UserResponse])
async def delete_user(response: Response, user_id: int, service: UserService = Depends(get_user_service)):
  deleted_user = await service.delete_user(user_id)
  
  response.delete_cookie(
    key='access_token',
    path='/',
    httponly=True,
    samesite="lax",
    secure=False
  )
  
  return SuccessResponse(
    message='Аккаунт успішно видалено',
    data=deleted_user
  )
  
@router.patch('/update_user_avatar', response_model=SuccessResponse[UserResponse])
async def update_user_avatar(avatar_url: UploadFile = File(...), service: UserService = Depends(get_user_service), user = Depends(get_current_user)):
  new_user = await service.update_user_avatar(user.id, avatar_url)
  return SuccessResponse(
    message='Аватар успішно оновлено',
    data=new_user
  )
  
@router.post('/test_upload_file',)
async def upload_avatar(file: UploadFile = File(...)):
  content = await file.read()
  # Определяем папку (убедись, что она создана)
  folder = "images"
  print('file', file)
  
  try:
    # Проверка файла на количество мегабайт
    if len(content) > 5 * 1024 * 1024:
      raise AppError(400, 'Файл не повинен бути більше 5 мегабайтів')
    
    if not file.filename:
      raise AppError(status_code=400, message='Файл не завантажено')
    
    # Создаем путь к файлу
    file_path = os.path.join(folder, file.filename)
    print('path', file_path)
    
    if os.path.exists(file_path):
      raise AppError(status_code=400, message='Такой файл уже есть')
    
    # Создаем соеденение с with, он закроет и откроет соеденение сам
    with open(file_path, "xb") as f:
      print('file from open', f"{f}") # Логируем для себя
      f.write(content)
      
  except Exception as e:
    print('e', e)
    
    raise AppError(500, str(e))
  finally:
    await file.close()
  
  return {"status": "ok", "path": file_path}