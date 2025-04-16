from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from database import get_session
from errors import Missing

from service.oratory_topics import generate_oratory_topic

router = APIRouter()

@router.get("/{difficulty}", summary="Genera un tema de oratoria")
def get_oratory_topic(difficulty: int):
    try:
        topic = generate_oratory_topic(difficulty)
        return {"difficulty": difficulty, "topic": topic}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error generando el tema de oratoria.")