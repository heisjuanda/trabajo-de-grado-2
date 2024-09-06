from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from database import get_session
from errors import Duplicate, Missing
from model.comment import CommentCreate, CommentRead, CommentUpdate
from service.comment import (create_comment, delete_comment, read_comment,
                             read_comments, update_comment, read_comment_by_course_id)

router = APIRouter()


@router.get(
    "", summary="consulta todos los comentarios", response_model=list[CommentRead]
)
def get_all_comments(db: Session = Depends(get_session)):
    return read_comments(db)


@router.get(
    "/{id}", summary="consulta un comentario por ID", response_model=CommentRead
)
def get_an_comment(id: int, db: Session = Depends(get_session)):
    try:
        comment = read_comment(id, db)
        return comment
    except Missing as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.msg)


@router.get("/course/{course_id}", summary="consulta todos los comentarios por curso", response_model=list[CommentRead])
def get_comments_by_course_id(course_id: int, db: Session = Depends(get_session)):
    try: 
        return read_comment_by_course_id(course_id, db)
    except Missing as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.msg)


@router.post(
    "",
    response_model=CommentRead,
    summary="crea un comentario",
    status_code=status.HTTP_201_CREATED,
)
def create_an_comment(comment: CommentCreate, db: Session = Depends(get_session)):
    try:
        return create_comment(comment=comment, db=db)
    except Duplicate as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=exc.msg)


@router.patch(
    "/{id}",
    summary="actualiza los datos del comentario por id",
    response_model=CommentRead,
)
def update_an_comment(
    id: int, comment: CommentUpdate, db: Session = Depends(get_session)
):
    try:
        return update_comment(id, comment, db)
    except Missing as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.msg)
    except Duplicate as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=exc.msg)


@router.delete("/{id}", summary="elimina a un comentario por ID")
def delete_an_comment(id: int, db: Session = Depends(get_session)):
    try:
        return delete_comment(id, db)
    except Missing as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.msg)
