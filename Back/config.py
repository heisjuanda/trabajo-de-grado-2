from pathlib import Path

from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os

top_dir = Path(__file__).resolve().parents[0]
db_dir = top_dir / "db"
db_name = "tesis.db"
db_path = str(db_dir / db_name)

load_dotenv()
db_uri = os.getenv('DB_URI')


class Settings(BaseSettings):
    PROJECT_NAME: str = "Tesis backend"
    DESCRIPTION: str = "A FastAPI + SQLModel production-ready API"
    VERSION: str = "0.1"
    DATABASE_URI: str = db_uri


    class Config:
        case_sensitive = True


settings = Settings()


class TestSettings(Settings):
    class Config:
        case_sensitive = True


test_settings = TestSettings()
