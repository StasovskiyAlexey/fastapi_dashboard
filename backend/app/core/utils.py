import uuid
import os
from fastapi import UploadFile
from ..core.exceptions import AppError

async def convert_file_to_url(file: UploadFile | None, folder: str) -> str:
  # Проверяем пришел ли файл
  if file is None:
    raise AppError(400, 'Файл не отримано')
  
  if not os.path.exists(folder):
    os.makedirs(folder, exist_ok=True)
  
  # Проверяем корректный тип content_type у файла, 
  if file.content_type is not None:
    if not file.content_type.startswith('image/'):
      raise AppError(400, 'Файл должен быть изображением')
  else:
    raise AppError(400, 'Не удалось определить тип файла')
    
  # Извлекаем расширение оригинального файла (например, '.png')
  ext = os.path.splitext(file.filename)[1] # type: ignore
  
  # Генерируем уникальное имя через UUID
  unique_filename = f"{uuid.uuid4().hex}{ext}"
  
  # Создаем путь файла
  file_path = os.path.join(folder, unique_filename)

  # Создаем соединение с помощью open(открытие файла), где прописываем путь файла, мод, и записываем данные на диск
  with open(file_path, "wb") as buffer:
    content = await file.read()
    buffer.write(content)

  return file_path

# Для добавления + обновления сущности в бд
async def create_entity(self, entity, error_message: str):
  try:
    self.db.add(entity)
    await self.db.commit()
    await self.db.refresh(entity)
    return entity
  except Exception:
    await self.db.rollback()
    raise AppError(500, error_message)
  
# Для добавления сущности в бд
async def update_existing_entity(self, entity, error_message: str):
  try:
    await self.db.commit()
    await self.db.refresh(entity)
    return entity
  except:
    await self.db.rollback()
    raise AppError(500, error_message)