import json
from fastapi import APIRouter, Depends, File, Form, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from sqlmodel import Session

from database import get_session
from errors import Missing

from service.oratory_topics import generate_oratory_topic, analyze_oratory_input

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
 

@router.post("/oratory-analysis", summary="Recibe audio, transcripción y dificultad para análisis")
async def analyze_oratory(
    transcript: str = Form(...),
    topic: str = Form(...),
    audio: UploadFile = File(...),
    time: int = Form(...),
    is_question: bool = Form(...),
    user_email: str = Form(...),
    session: Session = Depends(get_session)
):
    try:
        audio_content = await audio.read()

        parsed_topic = json.loads(topic)

        analysis_result = analyze_oratory_input(
            transcript=transcript,
            topic=parsed_topic,
            audio_bytes=audio_content,
            audio_filename=audio.filename,
            time=time,
            is_question=is_question,
            user_email=user_email,
            db=session
        )

        return {"status": "ok", "analysis": analysis_result}

    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Formato de 'topic' inválido. Debe ser un JSON válido.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error procesando el análisis: {str(e)}")