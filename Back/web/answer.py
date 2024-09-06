from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from database import get_session
from errors import Duplicate, Missing
from model.answer import AnswerCreate, AnswerRead, AnswerUpdate
from service.answer import (create_answer, delete_answer, read_answers,
                            update_answer, read_answer_by_id, read_answers_by_activity_user_question, read_answers_by_activity_user)


router = APIRouter()


@router.get("", summary="Consulta todas las respuestas", response_model=list[AnswerRead])
def get_all_answers(db: Session = Depends(get_session)):
    try:
        answers = read_answers(db)
        return answers
    except Missing as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.msg)


@router.get("/{id}", summary="Consulta una respuesta por ID", response_model=AnswerRead)
def get_an_answer(id: int, db: Session = Depends(get_session)):
    try:
        answer = read_answer_by_id(id, db)
        return answer
    except Missing as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.msg)

@router.get("/{user_email}/{activity_id}/{question_number}", summary="Consulta una respuesta por actividad, usuario y número de pregunta", response_model=list[AnswerRead])
def get_answers_by_activity_user_question( user_email: str, activity_id: int, question_number: int, db: Session = Depends(get_session)):
    try:
        answers = read_answers_by_activity_user_question(activity_id, user_email, question_number, db)
        return answers
    except Missing as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.msg)
    
@router.get("/{activity_id}/{user_email}", summary="Consulta una respuesta por actividad y usuario", response_model=list[AnswerRead])
def get_answers_by_activity_user( activity_id: str, user_email: str, db: Session = Depends(get_session)):
    try:
        answers = read_answers_by_activity_user(activity_id, user_email, db)
        return answers
    except Missing as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.msg)

@router.post(
    "",
    response_model=AnswerRead,
    summary="Crea una respuesta",
    status_code=status.HTTP_201_CREATED,
)
def create_an_answer(answer: AnswerCreate, db: Session = Depends(get_session)):
    try:
        return create_answer(answer=answer, db=db)
    except Duplicate as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=exc.msg)
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc))


@router.patch(
    "/{id}", summary="Actualiza la respuesta por ID", response_model=AnswerRead
)
def update_an_answer(id: int, answer: AnswerUpdate, db: Session = Depends(get_session)):
    try:
        return update_answer(id, answer, db)
    except Missing as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.msg)
    except Duplicate as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=exc.msg)


@router.delete("/{id}", summary="Elimina una respuesta por ID")
def delete_an_answer(id: int, db: Session = Depends(get_session)):
    try:
        return delete_answer(id, db)
    except Missing as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.msg)
