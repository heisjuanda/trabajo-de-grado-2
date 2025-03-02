import os
import random
from fastapi import Depends
from sqlmodel import Session, select

from groq import Groq

from database import get_session
from errors import Missing
from model.debate_topics import DebateTopic, DebateReportRequest


def generate_random_between(lower_bound, upper_bound):
    if lower_bound > upper_bound:
        return lower_bound

    return random.randint(lower_bound, upper_bound)


def get_random_topic(id: int):
    all_topics = {
        0: generate_random_between(1, 25),
        1: generate_random_between(26, 50),
        2: generate_random_between(51, 75),
        3: generate_random_between(76, 100),
        4: generate_random_between(101, 125),
        5: generate_random_between(126, 150),
        6: generate_random_between(151, 175),
        7: generate_random_between(176, 200),
        8: generate_random_between(201, 225),
        9: generate_random_between(226, 250),
        10: generate_random_between(251, 275),
        11: generate_random_between(276, 300),
        12: generate_random_between(301, 325),
        13: generate_random_between(326, 350),
        14: generate_random_between(351, 375),
        15: generate_random_between(376, 400),
        16: generate_random_between(401, 425),
    }

    return all_topics.get(id, generate_random_between(1, 50))


def read_topic(id: int, db: Session = Depends(get_session)) -> DebateTopic:
    topic_question = get_random_topic(id)
    topic = db.get(DebateTopic, topic_question)
    if not topic:
        raise Missing("Este topic no existe")

    return topic


def generate_argument(contexto, respuesta_usuario, ronda):
    API_KEY = os.getenv("GROG_API")
    client = Groq(api_key=API_KEY)
    prompt = (
        f"Contexto: {contexto}\n"
        f"El usuario dice: {respuesta_usuario}\n\n"
        f"Eres un argumentador crítico que siempre busca contradecir respetuosamente el punto de vista del usuario. "
        f"Genera un contra-argumento breve (menos de 100 palabras) para la ronda {ronda}."
    )

    chat_completion = client.chat.completions.create(
        messages=[
            {"role": "system", "content": "Eres un argumentador crítico y persuasivo."},
            {"role": "user", "content": prompt},
        ],
        model="llama-3.3-70b-versatile",
    )
    return chat_completion.choices[0].message.content


def summary_generator(debate_texto):
    API_KEY = os.getenv("GROG_API")
    client = Groq(api_key=API_KEY)
    summary_prompt = f"Da feedback retroalimentario para el usuario que participo en este debate, da consejos de mejora y reconoce lo que hizo bien:\n\n{debate_texto}"
    chat_completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": "Eres un asistente que provee feedback al usuario en debates de forma concisa y precisa.",
            },
            {"role": "user", "content": summary_prompt},
        ],
    )
    return chat_completion.choices[0].message.content

def save_report(report: DebateReportRequest, db: Session = Depends(get_session)) -> DebateReportRequest:
    db.add(report)
    db.commit()
    db.refresh(report)
    return report

def get_user_reports(email: str, db: Session = Depends(get_session)) -> list[DebateReportRequest]:
    statement = select(DebateReportRequest).where(email == DebateReportRequest.email)
    results = db.exec(statement)
    return results.all()