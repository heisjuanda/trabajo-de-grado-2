from sqlmodel import Field, SQLModel


class CommentBase(SQLModel):
    content: str
    created_at: str
    user_id: str
    course_id: str

    class Config:
        json_schema_extra = {
            "example": {
                "id": 123456,
                "content": "content id",
                "created_at": "esto sera una fecha xD",
                "user_id": "user id",
                "course_id": "course id",
            }
        }


class Comment(CommentBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class CommentCreate(CommentBase):
    class Config:
        json_schema_extra = {
            "example": {
                "content": "content id",
                "created_at": "esto sera una fecha xD",
                "user_id": "user id",
                "course_id": "course id",
            }
        }


class CommentRead(CommentBase):
    content: str
    created_at: str
    user_id: str
    course_id: str


class CommentUpdate(CommentBase):
    content: str
    created_at: str
    user_id: str
    course_id: str

    class Config:
        json_schema_extra = {
            "example": {
                "content": "content id",
                "created_at": "esto sera una fecha xD",
                "user_id": "user id",
                "course_id": "course id",
            }
        }
