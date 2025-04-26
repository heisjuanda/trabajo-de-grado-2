from fastapi import APIRouter, Depends, File, Form, UploadFile, HTTPException
from sqlmodel import Session
from typing import List, Optional
import json

from database import get_session
from service.oratory_audio import (
    save_audio_blob, 
    get_audio_blob, 
    get_audio_list, 
)
from model.oratory_audio import OratoryAudioRead, OratoryAudioListItem

router = APIRouter()

@router.get("/list")
def list_audios(
    user_email: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    session: Session = Depends(get_session)
):
    """
    Obtiene una lista de registros de audio (sin incluir los datos binarios)
    """
    return get_audio_list(
        user_email=user_email,
        skip=skip,
        limit=limit,
        session=session
    )

@router.get("/blob/{audio_id}")
def get_audio_blob_endpoint(
    audio_id: int,
    session: Session = Depends(get_session)
):
    """
    Obtiene un archivo de audio guardado como BLOB
    """
    audio = get_audio_blob(audio_id, session)
    
    from fastapi.responses import Response
    return Response(
        content=audio.audio_data,
        media_type=audio.audio_format
    )