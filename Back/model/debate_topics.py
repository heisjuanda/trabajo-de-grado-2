from sqlmodel import Field, SQLModel


class DebateTopicBase(SQLModel):
    question: str

    class Config:
        json_schema_extra = {
            "example": {
                "id": 0,
                "question": "question",
            }
        }


class DebateTopic(DebateTopicBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class DebateTopicRead(DebateTopicBase):
    id: int
    question: str


class DebateRoundRequest(SQLModel):
    contexto: str
    debate_completo: str
    ronda: int
    respuesta_usuario: str


class DebateDebateFeedbackRequest(SQLModel):
    contexto: str
