from sqlmodel import Field, SQLModel


class UserBase(SQLModel):
    name: str
    email: str
    password: str

    class Config:
        json_schema_extra = {
            "example": {
                "id": 123456,
                "name": "Super Man",
                "email": "fake@email.com",
                "password": "password",
            }
        }


class User(UserBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class UserCreate(UserBase):
    class Config:
        json_schema_extra = {
            "example": {
                "name": "Super Man",
                "email": "fake@email.com",
                "password": "password",
            }
        }


class UserRead(UserBase):
    id: int
    name: str
    email: str
    password: str


class UserUpdate(UserBase):
    name: str | None
    email: str | None
    password: str | None

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Super Man",
                "email": "fake@email.com",
                "password": "password",
            }
        }
