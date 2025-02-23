from fastapi import APIRouter

from web import comment, course, user, activity, answer, debate_ia

api = APIRouter()

api.include_router(
    user.router,
    prefix="/users",
    tags=["Usuarios"],
)

api.include_router(
    course.router,
    prefix="/courses",
    tags=["Cursos"],
)

api.include_router(
    comment.router,
    prefix="/comment",
    tags=["Comentarios"],
)


api.include_router(
    activity.router,
    prefix="/activity",
    tags=["Actividades"],
)

api.include_router(
    answer.router,
    prefix="/answer",
    tags=["Respuestas"],
)

api.include_router(
    debate_ia.router,
    prefix="/debate-topics",
    tags=["Temas"],
)
