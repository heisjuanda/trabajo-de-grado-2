from sqlmodel import Field, SQLModel, UniqueConstraint


class AnswerBase(SQLModel):
    user_email: str
    activity_id: str
    question_number: int
    answer_text: str

    class Config:
        json_schema_extra = {
            "example": {
                "user_email": "user@email.com",
                "activity_id": "1",
                "question_number": 1,
                "answer_text": "respuesta",
            }
        }


class Answer(AnswerBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    __table_args__ = (UniqueConstraint("user_email", "activity_id", "question_number"),)

class AnswerCreate(AnswerBase):
    class Config:
        json_schema_extra = {
           "example": {
                "user_email": "user@email.com",
                "activity_id": "1",
                "question_number": 1,
                "answer_text": "respuesta",
            }
        }


class AnswerUpdate(AnswerBase):
    answer_text: str

    class Config:
        json_schema_extra = {
            "example": {
                "user_email": "user_email",
                "activity_id": "1",
                "question_number": 1,
                "answer_text": "new_answer_text",
            }
        }


class AnswerRead(AnswerBase):
    user_email: str
    activity_id: str
    question_number: int
    answer_text: str

