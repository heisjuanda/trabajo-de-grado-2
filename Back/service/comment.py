from typing import Sequence

from fastapi import Depends
from sqlmodel import Session, select

from database import get_session
from errors import Duplicate, Missing
from model.comment import Comment, CommentCreate, CommentUpdate


def read_comments(db: Session = Depends(get_session)) -> Sequence[Comment]:
    comments = db.exec(select(Comment)).all()
    return comments


def read_comment(id: int, db: Session = Depends(get_session)) -> Comment:
    comment = db.get(Comment, id)

    if not comment:
        raise Missing("este comentario no esta registrado")

    return comment

def read_comment_by_course_id(course_id: int, db: Session = Depends(get_session)) -> Sequence[Comment]:
    comments = db.exec(select(Comment).where(Comment.course_id == course_id)).all()
    return comments

def create_comment(
    comment: CommentCreate, db: Session = Depends(get_session)
) -> Comment:
    comment_to_db = Comment.model_validate(comment)
    db.add(comment_to_db)
    db.commit()
    db.refresh(comment_to_db)
    return comment_to_db


def update_comment(id: int, comment: CommentUpdate, db: Session = Depends(get_session)):
    comment_to_update = db.get(Comment, id)

    if not comment_to_update:
        raise Missing("este comentario no esta registrado")

    comment_data = comment.model_dump(exclude_unset=True)
    for key, value in comment_data.items():
        setattr(comment_to_update, key, value)

    db.add(comment_to_update)
    db.commit()
    db.refresh(comment_to_update)
    return comment_to_update


def delete_comment(id: int, db: Session = Depends(get_session)):
    comment = db.get(Comment, id)

    if not comment:
        raise Missing("este comentario no esta registrado")

    db.delete(comment)
    db.commit()

    return {"ok": True}

