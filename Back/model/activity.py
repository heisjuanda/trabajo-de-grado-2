from sqlmodel import Field, SQLModel


class ActivityBase(SQLModel):
    activity_id: str
    course_id: str
    content_type: str
    title: str
    objective: str
    metodology: str
    resources: str
    introduction: str
    analisis: str
    evaluation: str
    example: str
    question1: str
    question2: str
    question3: str
    question4: str
    question5: str
    path:str


    class Config:
        json_schema_extra = {
            "example": {
                "id": 123456,
                "activity_id": "activity id",
                "course_id": "course id",
                "content_type": "std",
                "title": "title",
                "objective": "objective",
                "metodology": "metodology",
                "resources": "resources",
                "introduction": "introduction",
                "analisis": "analisis",
                "evaluation": "evaluation",
                "example": "example",
                "question1": "question1",
                "question2": "question2",
                "question3": "question3",
                "question4": "question4",
                "question5": "question5",
                "path": "/activity/path",
            }
        }


class Activity(ActivityBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class ActivityCreate(ActivityBase):
    class Config:
        json_schema_extra = {
            "example": {
                "activity_id": "content id",
                "course_id": "course id",
                "content_type": "std",
                "title": "title",
                "objective": "objective",
                "metodology": "metodology",
                "resources": "resources",
                "introduction": "introduction",
                "analisis": "analisis",
                "evaluation": "evaluation",
                "example": "example",
                "question1": "question1",
                "question2": "question2",
                "question3": "question3",
                "question4": "question4",
                "question5": "question5",
                "path": "/activity/path",
            }
        }


class ActivityRead(ActivityBase):
    id: int
    activity_id: str
    course_id: str
    content_type: str
    title: str
    objective: str
    metodology: str
    resources: str
    introduction: str
    analisis: str
    evaluation: str
    example: str
    question1: str
    question2: str
    question3: str
    question4: str
    question5: str
    path:str


class ActivityUpdate(ActivityBase):
    activity_id: str
    course_id: str
    content_type: str
    title: str
    objective: str
    metodology: str
    resources: str
    introduction: str
    analisis: str
    evaluation: str
    example: str
    question1: str
    question2: str
    question3: str
    question4: str
    question5: str
    path:str

    class Config:
        json_schema_extra = {
            "example": {
                "activity_id": "content id",
                "course_id": "course id",
                "content_type": "std",
                "title": "title",
                "objective": "objective",
                "metodology": "metodology",
                "resources": "resources",
                "introduction": "introduction",
                "analisis": "analisis",
                "evaluation": "evaluation",
                "example": "example",
                "question1": "question1",
                "question2": "question2",
                "question3": "question3",
                "question4": "question4",
                "question5": "question5",
                "path": "/activity/path",
            }
        }
