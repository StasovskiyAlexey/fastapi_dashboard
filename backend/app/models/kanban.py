from typing import List, Optional
from sqlalchemy import ForeignKey, String, Text, DateTime, func

from ..core.db import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

class Board(Base):
  __tablename__ = 'boards'
  
  id: Mapped[int] = mapped_column(primary_key=True, index=True)
  title: Mapped[str] = mapped_column(String(100))
  columns: Mapped[List["Column"]] = relationship("Column", back_populates='board', cascade='all, delete-orphan', lazy='selectin')
  owner_id: Mapped[int] = mapped_column(ForeignKey('users.id', ondelete="CASCADE"))
  
  created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
  
class Column(Base):
  __tablename__ = 'columns'
  
  id: Mapped[int] = mapped_column(primary_key=True, index=True)
  title: Mapped[str] = mapped_column(nullable=False)
  board_id: Mapped[int] = mapped_column(ForeignKey('boards.id', ondelete="CASCADE"))
  board: Mapped['Board'] = relationship('Board', back_populates='columns')
  order: Mapped[int] = mapped_column(default=1)
  cards: Mapped[List["Card"]] = relationship(back_populates="column", cascade='all, delete-orphan')
  
  created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
  
class Card(Base):
  __tablename__ = 'cards'
  
  id: Mapped[int] = mapped_column(primary_key=True)
  title: Mapped[str] = mapped_column(String(200))
  description: Mapped[Optional[str]] = mapped_column(Text)
  column_id: Mapped[int] = mapped_column(ForeignKey('columns.id', ondelete='CASCADE'))
  order: Mapped[int] = mapped_column(default=1)
  creator_id: Mapped[int] = mapped_column(ForeignKey('users.id'))
  column: Mapped["Column"] = relationship(back_populates="cards")
  
  created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)