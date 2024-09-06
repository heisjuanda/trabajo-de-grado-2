from typing import Sequence

from fastapi import Depends
from sqlmodel import Session, select

from database import get_session
from errors import Duplicate, Missing
from model.course import Course, CourseCreate, CourseUpdate


def read_courses(db: Session = Depends(get_session)) -> Sequence[Course]:
    courses = db.exec(select(Course)).all()
    return courses


def read_course(id: int, db: Session = Depends(get_session)) -> Course:
    course = db.get(Course, id)

    if not course:
        raise Missing("este curso no esta registrado")

    return course


def create_course(course: CourseCreate, db: Session = Depends(get_session)) -> Course:
    course_to_db = Course.model_validate(course)
    statement = select(Course).where(Course.title == course.title)
    course_in_db = db.exec(statement).first()

    if course_in_db:
        raise Duplicate("este curso ya esta registrado")

    db.add(course_to_db)
    db.commit()
    db.refresh(course_to_db)
    return course_to_db


def update_course(id: int, course: CourseUpdate, db: Session = Depends(get_session)):
    course_to_update = db.get(Course, id)

    if not course_to_update:
        raise Missing("este curso no esta registrado")

    statement = select(Course).where(Course.title == course.title)
    course_with_new_name = db.exec(statement).first()

    if course_with_new_name and course_to_update.title != course.title:
        raise Duplicate("ese nombre de curso ya esta en uso")

    course_data = course.model_dump(exclude_unset=True)
    for key, value in course_data.items():
        setattr(course_to_update, key, value)

    db.add(course_to_update)
    db.commit()
    db.refresh(course_to_update)
    return course_to_update


def delete_course(id: int, db: Session = Depends(get_session)):
    course = db.get(Course, id)

    if not course:
        raise Missing("este curso no esta registrado")

    db.delete(course)
    db.commit()

    return {"ok": True}
