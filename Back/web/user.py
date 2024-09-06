from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from database import get_session
from errors import Duplicate, Missing
from model.user import UserCreate, UserRead, UserUpdate
from service.user import (create_user, delete_user, read_user, read_users,
                          update_user)

router = APIRouter()


@router.get("", summary="consulta todos los usuarios", response_model=list[UserRead])
def get_all_users(db: Session = Depends(get_session)):
    return read_users(db)


@router.get("/{id}", summary="consulta un usuario por ID", response_model=UserRead)
def get_an_user(id: int, db: Session = Depends(get_session)):
    try:
        user = read_user(id, db)
        return user
    except Missing as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.msg)


@router.post(
    "",
    response_model=UserRead,
    summary="crea un usuario",
    status_code=status.HTTP_201_CREATED,
)
def create_an_user(user: UserCreate, db: Session = Depends(get_session)):
    try:
        return create_user(user=user, db=db)
    except Duplicate as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=exc.msg)


@router.patch(
    "/{id}", summary="actualiza los datos del usuario por id", response_model=UserRead
)
def update_an_user(id: int, user: UserUpdate, db: Session = Depends(get_session)):
    try:
        return update_user(id, user, db)
    except Missing as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.msg)
    except Duplicate as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=exc.msg)


@router.delete("/{id}", summary="elimina a un usuario por ID")
def delete_an_user(id: int, db: Session = Depends(get_session)):
    try:
        return delete_user(id, db)
    except Missing as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.msg)
