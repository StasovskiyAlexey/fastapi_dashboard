from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
  database_url: str
  secret_key: str
  debug: bool = True
  cors_origins: list = [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:8000",
      "http://127.0.0.1:5173"
  ]
  model_config = SettingsConfigDict(env_file=".env", extra="allow")  # <--- разрешаем extra поля

settings = Settings() # type: ignore