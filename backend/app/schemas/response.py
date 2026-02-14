from typing import Any, Generic, Optional, TypeVar
from pydantic import BaseModel

T = TypeVar("T")

class SuccessResponse(BaseModel, Generic[T]):
  status: int = 200
  message: Optional[str] = None
  data: Optional[T] = None

class ErrorResponse(BaseModel):
  status: int = 500
  message: Optional[str] = None
  details: Optional[Any] = None