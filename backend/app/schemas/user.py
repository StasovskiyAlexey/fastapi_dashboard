from pydantic import BaseModel, ConfigDict, Field

class UserBase(BaseModel):
    login: str = Field(..., description="user name")
    email: str = Field(..., description="user email")
    password: str = Field(..., description="user password", min_length=5)

class UserCreate(UserBase):
    pass

class UserLogin(BaseModel):
    login: str = Field(..., description="user name")
    password: str = Field(..., description="user password", min_length=5)
    
class UserUpdate(BaseModel):
    login: str = Field(..., description="user login")
    email: str = Field(..., description="user email")

    model_config = ConfigDict(from_attributes=True)

class UserPasswordRequest(BaseModel):
    password: str
    new_password: str

class UserResponse(BaseModel):
    id: int
    login: str = Field(..., description="user login")
    email: str = Field(..., description="user email")

    model_config = ConfigDict(from_attributes=True)

class UsersListResponse(BaseModel):
    users: list[UserResponse]

    model_config = ConfigDict(from_attributes=True)