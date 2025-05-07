from fastapi import Depends, HTTPException
from sqlmodel import Session, select
from typing import List, Optional

from database import get_session
from model.oratory_audio import OratoryAudio, OratoryAudioCreate, OratoryAudioRead, OratoryAudioListItem

def save_audio_blob(
    user_email: str,
    feedback: str,
    calification: int,
    transcript: str,
    audio_bytes: bytes,
    audio_format: str,
    duration_ms: int,
    session: Session
) -> OratoryAudioRead:
    """
    Guarda el archivo de audio como BLOB en la base de datos
    """
    audio_create = OratoryAudioCreate(
        user_email=user_email,
        feedback=feedback,
        calification=calification,
        transcript=transcript,
        audio_data=audio_bytes,
        audio_format=audio_format,
        duration_ms=duration_ms
    )
    
    audio_db = OratoryAudio.from_orm(audio_create)
    
    session.add(audio_db)
    session.commit()
    session.refresh(audio_db)
    
    return OratoryAudioRead.from_orm(audio_db)

def get_audio_blob(
    audio_id: int,
    session: Session = Depends(get_session)
) -> Optional[OratoryAudio]:
    """
    Recupera un registro de audio completo incluyendo los datos binarios
    """
    audio = session.get(OratoryAudio, audio_id)
    if not audio:
        raise HTTPException(status_code=404, detail="Audio no encontrado")
    return audio

def get_audio_list(
    user_email: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    session: Session = Depends(get_session)
) -> List[OratoryAudioListItem]:
    """
    Obtiene una lista de registros de audio sin incluir los datos binarios
    """
    query = select(OratoryAudio)
    
    if user_email:
        query = query.where(OratoryAudio.user_email == user_email)
    
    query = query.offset(skip).limit(limit)
    results = session.exec(query).all()
    
    return [
        OratoryAudioListItem(
            id=audio.id,
            user_email=audio.user_email,
            feedback=audio.feedback,
            transcript=audio.transcript,
            audio_format=audio.audio_format,
            duration_ms=audio.duration_ms,
            calification=audio.calification,
            created_at=audio.created_at
        ) 
        for audio in results
    ]