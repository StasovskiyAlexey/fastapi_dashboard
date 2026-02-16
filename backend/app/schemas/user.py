from typing import Optional
from fastapi import Form
from pydantic import BaseModel, ConfigDict, Field

class UserBase(BaseModel):
    login: str = Field(...)
    email: str = Field(...)
    password: str = Field(..., min_length=5)

class UserCreate(BaseModel):
    login: str = Field(...)
    email: str = Field(...)
    password: str = Field(..., min_length=5)
    
    # @classmethod
    # def as_form(
    #     cls,
    #     login: str = Form(...),
    #     email: str = Form(...),
    #     password: str = Form(...)
    # ):
    
    #     return cls(login=login, email=email, password=password)

class UserLogin(BaseModel):
    login: str = Field(...)
    password: str = Field(..., min_length=5)
    
class UserUpdate(BaseModel):
    login: str = Field(...)
    email: str = Field(...)
    # password: str = Field(...)

    model_config = ConfigDict(from_attributes=True)
    @classmethod
    def as_form(
        cls,
        login: str = Form(...),
        email: str = Form(...),
        # password: str = Form(...)
    ):
        return cls(login=login, email=email)

class UserPasswordRequest(BaseModel):
    password: str
    new_password: str

class UserResponse(BaseModel):
    id: int
    login: str = Field(...)
    email: str = Field(...)
    avatar_url: Optional[str] = Field(None)

    model_config = ConfigDict(from_attributes=True)

class UsersListResponse(BaseModel):
    users: list[UserResponse]

    model_config = ConfigDict(from_attributes=True)