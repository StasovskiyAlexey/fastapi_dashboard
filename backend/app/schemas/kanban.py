from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime

class CardBase(BaseModel):
  title: str = Field(...)
  description: str = Field(...)
  order: int = Field(..., ge=1)
  creator_id: int = Field(...)
  column_id: int = Field(...)
  
  model_config = ConfigDict(from_attributes=True)
  
class CardCreate(BaseModel):
  title: str = Field(...)
  description: str = Field(...)
  order: int = Field(..., ge=1)

class CardUpdate(CardCreate):
  title: str = Field(...)
  description: str = Field(...)
  order: int = Field(..., ge=1)

class CardResponse(BaseModel):
  id: int = Field(...)
  title: str = Field(...)
  description: str = Field(...)
  order: int = Field(...)
  creator_id: int = Field(...)
  column_id: int = Field(...)
  
  created_at: datetime
  
  model_config = ConfigDict(from_attributes=True)
  
class CardListResponse(BaseModel):
  cards: list[CardResponse]

class ColumnBase(BaseModel):
  title: str = Field(...)
  board_id: int = Field(...)
  order: int = Field(...)
  cards: list
  
  model_config = ConfigDict(from_attributes=True)
  
class ColumnCreate(BaseModel):
  title: str = Field(...)
  board_id: int = Field(...)
  order: int = Field(..., ge=1)
  
  model_config = ConfigDict(from_attributes=True)
  
class ColumnUpdate(BaseModel):
  title: str = Field(...)
  order: int = Field(...)
  
  model_config = ConfigDict(from_attributes=True)
  
class ColumnResponse(BaseModel):
  id: int = Field(...)
  title: str = Field(...)
  board_id: int = Field(...)
  order: int = Field(...)
  cards: list[CardResponse]
  
  created_at: datetime
  
  model_config = ConfigDict(from_attributes=True)

class ColumnListResponse(BaseModel):
  columns: list[ColumnResponse]
  
class BoardBase(BaseModel):
  title: str = Field(...)
  
  model_config = ConfigDict(from_attributes=True)

class BoardCreate(BoardBase):
  pass

class BoardUpdate(BoardBase):
  pass

class BoardResponse(BoardBase):
  id: int = Field(...)
  title: str = Field(...)
  owner_id: int = Field(...) 
  columns: list[ColumnResponse]
  
  created_at: datetime
  
  model_config = ConfigDict(from_attributes=True)

# class BoardListResponse(BaseModel):
#   data: list[BoardResponse]

#   model_config = ConfigDict(from_attributes=True)