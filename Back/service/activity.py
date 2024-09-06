from typing import Sequence

from fastapi import Depends
from sqlmodel import Session, select

from database import get_session
from errors import Duplicate, Missing
from model.activity import Activity, ActivityCreate, ActivityUpdate


def read_activities(db: Session = Depends(get_session)) -> Sequence[Activity]:
    activities = db.exec(select(Activity)).all()
    return activities

def read_activity_by_course_id(course_id: str, db: Session = Depends(get_session)) -> Sequence[Activity]:
    activities = db.exec(select(Activity).where(Activity.course_id == course_id)).all()
    return activities



def read_activity(id: int, db: Session = Depends(get_session)) -> Activity:
    activity = db.get(Activity, id)

    if not activity:
        raise Missing("esta actividad no esta registrado")

    return activity


def create_activity(activity: ActivityCreate, db: Session = Depends(get_session)) -> Activity:
    activity_to_db = Activity.model_validate(activity)
    statement = select(Activity).where(Activity.activity_id == activity.activity_id)
    activity_in_db = db.exec(statement).first()

    if activity_in_db:
        raise Duplicate("Esta actividad  ya esta registrada")

    db.add(activity_to_db)
    db.commit()
    db.refresh(activity_to_db)
    return activity_to_db


def update_activity(id: int, activity: ActivityUpdate, db: Session = Depends(get_session)):
    activity_to_update = db.get(Activity, id)

    if not activity_to_update:
        raise Missing("Esta actividad no esta registrada")

    statement = select(Activity).where(Activity.activity_id == activity.activity_id)
    activity_with_new_data = db.exec(statement).first()

    if activity_with_new_data and activity_to_update.activity_id != activity.activity_id:
        raise Duplicate("Contenido duplicado")

    activity_data = activity.model_dump(exclude_unset=True)
    for key, value in activity_data.items():
        setattr(activity_to_update, key, value)

    db.add(activity_to_update)
    db.commit()
    db.refresh(activity_to_update)
    return activity_to_update


def delete_activity(id: int, db: Session = Depends(get_session)):
    activity = db.get(Activity, id)

    if not activity:
        raise Missing("Actividad no registrada")

    db.delete(activity)
    db.commit()

    return {"ok": True}
