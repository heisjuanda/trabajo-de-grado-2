from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from database import get_session
from errors import Missing
from model.debate_topics import DebateTopicRead, DebateRoundRequest, DebateDebateFeedbackRequest, DebateReportRequest
from service.debate_topics import read_topic, generate_argument, summary_generator, save_report, get_user_reports

router = APIRouter()


@router.get(
    "/{id}",
    summary="consulta un tema para debatir por ID",
    response_model=DebateTopicRead,
)
def get_topic_by_id(id: int, db: Session = Depends(get_session)):
    try:
        topic = read_topic(id, db)
        return topic
    except Missing as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.msg)


@router.post("/procesar-ronda", summary="Procesa una ronda del debate")
def procesar_ronda(data: DebateRoundRequest):
    contexto = data.contexto
    debate_completo = data.debate_completo or f"Idea moral: {contexto}\n\n"
    ronda = data.ronda
    respuesta_usuario = data.respuesta_usuario

    debate_completo += f"Usuario (Ronda {ronda}): {respuesta_usuario}\n"

    contra_argumento = generate_argument(contexto, respuesta_usuario, ronda)
    debate_completo += f"IA (Ronda {ronda}): {contra_argumento}\n"

    return {
        "debate_completo": debate_completo,
        "ia_respuesta": contra_argumento,
        "ronda": ronda,
    }


@router.post("/dar-feedback", summary="Provee feedback de un debate entero")
def procesar_debate(data: DebateDebateFeedbackRequest):
    debate_completo = data.contexto

    feedback_user = summary_generator(debate_completo)
    feedback = f"Feedback Para El Usuario: {feedback_user}\n"

    return {
        "feedback": feedback,
    }

@router.post(
    "/reports",
    summary="Crea un reporte de debate",
    response_model=DebateReportRequest,
)
def create_report(report: DebateReportRequest, db: Session = Depends(get_session)):
    try:
        return save_report(report, db)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al guardar el reporte"
        )

@router.get(
    "/reports/{email}",
    summary="Obtiene los reportes de debate de un usuario",
    response_model=list[DebateReportRequest],
)
def read_reports(email: str, db: Session = Depends(get_session)):
    reports = get_user_reports(email, db)
    if not reports:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No se encontraron reportes para este usuario"
        )
    return reports