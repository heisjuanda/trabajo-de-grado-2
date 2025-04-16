import os
from fastapi import Depends
from sqlmodel import Session, select
from dotenv import load_dotenv

from groq import Groq

from database import get_session
from errors import Missing

def build_oratory_prompt(difficulty: int) -> str:
    if difficulty == 0:
        return (
            "Nivel: Principiante\n"
            "Descripción:\n"
            "Dirigido a quienes dan sus primeros pasos en oratoria. Se enfoca en estructura básica, claridad y control del nerviosismo.\n"
            "Tema sugerido: algo cotidiano y sencillo (ej.: 'La importancia de respirar antes de hablar').\n"
            "Objetivo: Generar un tema claro, corto y fácil de desarrollar en 1 minuto.\n"
            "Ayudas: guión predefinido y frases clave.\n"
            "Genera un tema de oratoria nivel principiante."
        )
    elif difficulty == 1:
        return (
            "Nivel: Avanzado\n"
            "Descripción:\n"
            "Para usuarios con experiencia, trabajando improvisación, persuasión y recursos retóricos.\n"
            "Tema sugerido: uno que permita usar metáforas, datos sorprendentes o anécdotas.\n"
            "Objetivo: Persuadir o emocionar en 1 minuto.\n"
            "Ayudas: palabras clave sugeridas, pausas estratégicas.\n"
            "Genera un tema de oratoria nivel avanzado."
        )
    elif difficulty == 2:
        return (
            "Nivel: Experto\n"
            "Descripción:\n"
            "Desafía a oradores experimentados con temas abstractos o polémicos, y obstáculos imprevistos.\n"
            "Tema sugerido: complejo o controversial (ej.: '¿La tecnología reemplazará la oratoria?').\n"
            "Objetivo: Pensamiento crítico y control bajo presión.\n"
            "Ayudas: interrupciones simuladas, cambios de argumento.\n"
            "Genera un tema de oratoria nivel experto."
        )
    else:
        raise ValueError("La dificultad debe ser 0 (principiante), 1 (avanzado) o 2 (experto).")


def generate_oratory_topic(difficulty: int):
    load_dotenv()
    API_KEY = os.getenv("GROG_API_LLAMA")
    if not API_KEY:
        raise Missing("Falta la clave de API GROG_API_LLAMA")
    
    client = Groq(api_key=API_KEY)
    prompt = build_oratory_prompt(difficulty)

    chat_completion = client.chat.completions.create(
        messages=[
            {"role": "system", "content": "Eres un argumentador crítico y persuasivo."},
            {"role": "user", "content": prompt},
        ],
        model="llama-3.3-70b-versatile",
    )
    return chat_completion.choices[0].message.content