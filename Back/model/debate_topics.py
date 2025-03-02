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

class DebateReportRequest(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    created_at: str
    email: str
    chat: str
    full_report: str

    class Config:
        json_schema_extra = {
            "example": {
                "id": 0,
                "created_at": "2025-02-27 01:13:37.491246+00",
                "email": "jdma253gmail.com",
                "chat": "chat",
                "full_report": "report",
            }
        }
