from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..core.db import Base

class User(Base):
  __tablename__ = "users"

  id: Mapped[int] = mapped_column(primary_key=True)
  login: Mapped[str] = mapped_column(String(100), index=True)
  email: Mapped[str] = mapped_column(unique=True, index=True)
  password: Mapped[str] = mapped_column(nullable=False)
  avatar_url: Mapped[str | None] = mapped_column(String(256), nullable=True)
    
# что делает Mapped? "Говорит, что это поле в БД будет строкой"

# mapped_column — это функция, которая настраивает фактические параметры колонки в базе данных (SQL-параметры).
# Здесь ты указываешь:
# Нужен ли индекс (index=True).
# Может ли поле быть пустым (nullable=False).
# Значение по умолчанию (default="...").
# Первичный ключ (primary_key=True).