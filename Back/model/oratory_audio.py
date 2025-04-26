from sqlalchemy import LargeBinary
from sqlmodel import Field, SQLModel, Column
from typing import Optional
from datetime import datetime


class OratoryAudioBase(SQLModel):
    user_email: str
    feedback: str  
    transcript: str  
    audio_format: str
    audio_data: bytes = Field(sa_column=Column(LargeBinary))
    duration_ms: int
    calification: int
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "user_email": "usuario@example.com",
                "feedback": "Esto es un feedback de ejemplo",
                "transcript": "Esto es una transcripción de ejemplo",
                "audio_format": "audio/webm",
                "audio_data": "datos binarios...",
                "duration_ms": 60000,
                "calification": 5,
                "created_at": "2023-11-21T14:30:00Z"
            }
        }


class OratoryAudio(OratoryAudioBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    audio_data: bytes = Field(sa_column=Column(LargeBinary))


class OratoryAudioRead(OratoryAudioBase):
    id: int


class OratoryAudioCreate(OratoryAudioBase):
    audio_data: bytes  

class OratoryAudioListItem(SQLModel):
    id: int
    user_email: str
    feedback: str  
    transcript: str  
    audio_format: str
    duration_ms: int
    calification: int
    created_at: datetime  