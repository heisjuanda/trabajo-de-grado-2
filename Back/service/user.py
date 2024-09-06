from typing import Sequence

from fastapi import Depends
from sqlmodel import Session, select

from database import get_session
from errors import Duplicate, Missing
from model.user import User, UserCreate, UserUpdate


def read_users(db: Session = Depends(get_session)) -> Sequence[User]:
    users = db.exec(select(User)).all()
    return users


def read_user(id: int, db: Session = Depends(get_session)) -> User:
    user = db.get(User, id)

    if not user:
        raise Missing("este usuario no esta registrado")

    return user


def create_user(user: UserCreate, db: Session = Depends(get_session)) -> User:
    user_to_db = User.model_validate(user)
    statement = select(User).where(User.name == user.name)
    user_in_db = db.exec(statement).first()

    if user_in_db:
        raise Duplicate("este usuario ya esta registrado")

    db.add(user_to_db)
    db.commit()
    db.refresh(user_to_db)
    return user_to_db


def update_user(id: int, user: UserUpdate, db: Session = Depends(get_session)):
    user_to_update = db.get(User, id)

    if not user_to_update:
        raise Missing("este usuario no esta registrado")

    statement = select(User).where(User.name == user.name)
    user_with_new_name = db.exec(statement).first()

    if user_with_new_name and user_to_update.name != user.name:
        raise Duplicate("ese nombre de usuario ya esta en uso")

    user_data = user.model_dump(exclude_unset=True)
    for key, value in user_data.items():
        setattr(user_to_update, key, value)

    db.add(user_to_update)
    db.commit()
    db.refresh(user_to_update)
    return user_to_update


def delete_user(id: int, db: Session = Depends(get_session)):
    user = db.get(User, id)

    if not user:
        raise Missing("este usuario no esta registrado")

    db.delete(user)
    db.commit()

    return {"ok": True}
