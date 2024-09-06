from typing import Sequence

from fastapi import Depends
from sqlmodel import Session, select

from database import get_session
from errors import Duplicate, Missing
from model.answer import Answer, AnswerCreate, AnswerUpdate, AnswerRead



MISSING_ANSWER_ERROR = "Esta respuesta no está registrada"

def read_answers(db: Session = Depends(get_session)) -> Sequence[Answer]:
    answers = db.exec(select(Answer)).all()
    return answers

def read_answer_by_id(answer_id: int, db: Session = Depends(get_session)) -> Answer:
    answer = db.get(Answer, answer_id)
    if not answer:
        raise Missing(MISSING_ANSWER_ERROR)
    return answer

def read_answers_by_activity_user_question(activity_id: int, user_email: str, question_number: int, db: Session = Depends(get_session)) -> Sequence[Answer]:
    answers = db.exec(select(Answer).where(Answer.activity_id == activity_id).where(Answer.user_email == user_email).where(Answer.question_number == question_number)).all()
    return answers

def read_answers_by_activity_user(activity_id: str, user_email: str, db: Session = Depends(get_session)) -> Sequence[Answer]:
    answers = db.exec(select(Answer).where(Answer.activity_id == activity_id).where(Answer.user_email == user_email)).all()
    return answers


def create_answer(answer: AnswerCreate, db: Session = Depends(get_session)) -> Answer:
    answer_to_db = Answer(**answer.dict())
    db.add(answer_to_db)
    db.commit()
    db.refresh(answer_to_db)
    return answer_to_db

def update_answer(answer_id: int, answer: AnswerUpdate, db: Session = Depends(get_session)) -> Answer:
    answer_to_update = db.get(Answer, answer_id)
    if not answer_to_update:
        raise Missing("Esta respuesta no está registrada")
    answer_data = answer.dict(exclude_unset=True)
    for key, value in answer_data.items():
        setattr(answer_to_update, key, value)
    db.add(answer_to_update)
    db.commit()
    db.refresh(answer_to_update)
    return answer_to_update

def delete_answer(answer_id: int, db: Session = Depends(get_session)) -> dict:
    answer = db.get(Answer, answer_id)
    if not answer:
        raise Missing("Esta respuesta no está registrada")
    db.delete(answer)
    db.commit()
    return {"message": "La respuesta se eliminó correctamente"}
