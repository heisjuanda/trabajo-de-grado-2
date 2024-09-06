from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from database import get_session
from errors import Duplicate, Missing
from model.course import CourseCreate, CourseRead, CourseUpdate
from service.course import (create_course, delete_course, read_course,
                            read_courses, update_course)

router = APIRouter()


@router.get("", summary="consulta todos los cursos", response_model=list[CourseRead])
def get_all_courses(db: Session = Depends(get_session)):
    return read_courses(db)


@router.get("/{id}", summary="consulta un curso por ID", response_model=CourseRead)
def get_an_course(id: int, db: Session = Depends(get_session)):
    try:
        course = read_course(id, db)
        return course
    except Missing as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.msg)


@router.post(
    "",
    response_model=CourseRead,
    summary="crea un curso",
    status_code=status.HTTP_201_CREATED,
)
def create_an_course(course: CourseCreate, db: Session = Depends(get_session)):
    try:
        return create_course(course=course, db=db)
    except Duplicate as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=exc.msg)


@router.patch(
    "/{id}", summary="actualiza los datos del curso por id", response_model=CourseRead
)
def update_an_course(id: int, course: CourseUpdate, db: Session = Depends(get_session)):
    try:
        return update_course(id, course, db)
    except Missing as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.msg)
    except Duplicate as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=exc.msg)


@router.delete("/{id}", summary="elimina a un curso por ID")
def delete_an_course(id: int, db: Session = Depends(get_session)):
    try:
        return delete_course(id, db)
    except Missing as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.msg)
