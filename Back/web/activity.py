from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from database import get_session
from errors import Duplicate, Missing
from model.activity import ActivityCreate, ActivityRead, ActivityUpdate
from service.activity import (create_activity, delete_activity, read_activities,
                            update_activity, read_activity, read_activity_by_course_id) 

router = APIRouter()


@router.get("", summary="consulta todas las actividades", response_model=list[ActivityRead])
def get_all_activities(db: Session = Depends(get_session)):
    try:
        activity = read_activities(db)
        return activity
    except Missing as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.msg)


@router.get("/{id}", summary="consulta una actividad por ID", response_model=ActivityRead)
def get_an_activity(id: int, db: Session = Depends(get_session)):
    try:
        activity = read_activity(id, db)
        return activity
    except Missing as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.msg)

@router.get("/course/{id}", summary="consulta todas las actividades de un curso", response_model=list[ActivityRead])
def get_all_activities_by_course(id: str, db: Session = Depends(get_session)):
    try:
        activity = read_activity_by_course_id(id, db)
        return activity
    except Missing as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.msg)

@router.post(
    "",
    response_model=ActivityRead,
    summary="crea una actividad",
    status_code=status.HTTP_201_CREATED,
)
def create_an_activity(activity: ActivityCreate, db: Session = Depends(get_session)):
    try:
        return create_activity(activity=activity, db=db)
    except Duplicate as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=exc.msg)


@router.patch(
    "/{id}", summary="actualiza la actividad por id", response_model=ActivityRead
)
def update_an_activity(id: int, activity: ActivityUpdate, db: Session = Depends(get_session)):
    try:
        return update_activity(id, activity, db)
    except Missing as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.msg)
    except Duplicate as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=exc.msg)


@router.delete("/{id}", summary="elimina una actividad por ID")
def delete_an_activity(id: int, db: Session = Depends(get_session)):
    try:
        return delete_activity(id, db)
    except Missing as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.msg)
    