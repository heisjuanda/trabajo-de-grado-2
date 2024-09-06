from sqlmodel import Field, SQLModel


class CourseBase(SQLModel):
    content_id: str
    title: str
    category_id: str
    description: str

    class Config:
        json_schema_extra = {
            "example": {
                "id": 123456,
                "content_id": "content id",
                "title": "fake title",
                "category_id": "category id",
                "description": "description",
            }
        }


class Course(CourseBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class CourseCreate(CourseBase):
    class Config:
        json_schema_extra = {
            "example": {
                "content_id": "content id",
                "title": "fake title",
                "category_id": "category id",
                "description": "description",
            }
        }


class CourseRead(CourseBase):
    id: int
    content_id: str
    title: str
    category_id: str
    description: str


class CourseUpdate(CourseBase):
    content_id: str | None
    title: str | None
    category_id: str | None
    description: str | None

    class Config:
        json_schema_extra = {
            "example": {
                "content_id": "content id",
                "title": "fake title",
                "category_id": "category id",
                "description": "description",
            }
        }
