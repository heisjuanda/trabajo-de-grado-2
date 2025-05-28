import os
import random
from fastapi import Depends
from sqlmodel import Session, select
from dotenv import load_dotenv

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
        2: generate_random_between(76, 100),
        3: generate_random_between(101, 100),
        4: generate_random_between(126, 150),
        5: generate_random_between(151, 175),
        6: generate_random_between(176, 200),
        7: generate_random_between(201, 225),
        8: generate_random_between(226, 250),
        9: generate_random_between(251, 275),
        10: generate_random_between(276, 300),
        11: generate_random_between(301, 325),
        12: generate_random_between(326, 350),
        13: generate_random_between(351, 375),
        14: generate_random_between(376, 400),
        15: generate_random_between(401, 425),
        16: generate_random_between(425, 475),
    }

    return all_topics.get(id, generate_random_between(0, 16))


def read_topic(id: int, db: Session = Depends(get_session)) -> DebateTopic:
    topic_question = get_random_topic(id)
    topic = db.get(DebateTopic, topic_question)
    if not topic:
        raise Missing("Este topic no existe")

    return topic


def generate_argument(contexto, respuesta_usuario, ronda, debate_completo):
    load_dotenv()
    OPEN_API_CHAT_GPT = os.getenv("OPEN_API_CHAT_GPT")

    if ronda <= 3:
        estrategia = "Explora diferentes perspectivas del tema haciendo preguntas reflexivas y presentando puntos de vista alternativos."
    elif ronda <= 6:
        estrategia = "Profundiza en los argumentos del usuario pidiendo evidencia, ejemplos o considerando consecuencias."
    elif ronda <= 8:
        estrategia = "Busca puntos en común y ayuda al usuario a refinar su posición, pero sigue cuestionando aspectos débiles."
    else:
        estrategia = "Guía hacia una conclusión reflexiva, reconociendo la evolución del pensamiento del usuario."

    prompt = (
        f"CONTEXTO DEL DEBATE: {contexto}\n"
        f"HISTORIAL COMPLETO (Ronda {ronda}/10): {debate_completo}\n"
        f"RESPUESTA ACTUAL DEL USUARIO: {respuesta_usuario}\n\n"
        f"Eres un mentor de pensamiento crítico empático y constructivo. Tu objetivo es ayudar al usuario a desarrollar mejores habilidades de razonamiento.\n\n"
        f"ESTRATEGIA PARA ESTA RONDA: {estrategia}\n\n"
        f"INSTRUCCIONES:\n"
        f"- Usa un lenguaje cercano y comprensible, como si hablaras con un amigo\n"
        f"- Reconoce los puntos válidos del usuario antes de presentar nuevas perspectivas\n"
        f"- Haz preguntas que inviten a la reflexión en lugar de solo contradecir\n"
        f"- Usa ejemplos cotidianos que cualquier persona pueda entender\n"
        f"- Mantén tu respuesta entre 30-45 palabras máximo\n"
        f"- Adapta tu tono: más exploratorio al inicio, más colaborativo al final\n"
        f"- Si el usuario muestra crecimiento en su razonamiento, reconócelo\n\n"
        f"- Puedes usar emojis para hacer la conversación más amena\n"
        f"Genera una respuesta que fomente la reflexión profunda y el crecimiento intelectual."
    )
    
    system_message = "Eres un mentor de pensamiento crítico empático que guía al usuario hacia un razonamiento más profundo y reflexivo. Tu objetivo es desarrollar sus habilidades analíticas, no ganar un debate."
    
    try:
        import openai
        openai.api_key = OPEN_API_CHAT_GPT
        
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": prompt},
            ],
        )
        return response.choices[0].message.content
        
    except Exception as e:
        print(f"Error al usar ChatGPT: {str(e)}")
        try:
            API_KEY = os.getenv("GROG_API_LLAMA")
            client = Groq(api_key=API_KEY)
            
            chat_completion = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": prompt},
                ],
                model="llama-3.3-70b-versatile",
            )
            return chat_completion.choices[0].message.content
            
        except Exception as e:
            print(f"Error también al usar Groq: {str(e)}")
            return "No se pudo generar un contraargumento en este momento. Por favor, intenta de nuevo."


def summary_generator(debate_texto):
    load_dotenv()
    OPEN_API_CHAT_GPT = os.getenv("OPEN_API_CHAT_GPT")
    
    summary_prompt = f"""
    Provee un feedback crítico y constructivo para el usuario que participó en el siguiente debate.
    evalua solo las respuestas del usuario, y como reacciona el usuario antes los argumentos de la IA.
    Identifica y destaca:
    - **Aspectos Positivos:** Reconoce lo que hizo bien.
    - **Áreas de Mejora:** Señala de forma clara los puntos que requieren fortalecerse.
    - **Sugerencias:** Ofrece recomendaciones prácticas para mejorar en futuras intervenciones.
    Además, asigna una calificación final a la participación del usuario en el debate en una escala del 0 al 10, siendo 10 la máxima excelencia, en el siguiente formato:
    **Calificación Final:** [valor]

    La respuesta debe estar en formato Markdown, cumpliendo estas pautas:
    1. Cada sección debe iniciar con un título en negrita (por ejemplo, **Aspectos Positivos:**).
    2. Cada ítem dentro de una sección se debe listar en una línea nueva, precedido por un guion (-) o numeración.
    3. La línea de la calificación final debe estar al final de la respuesta.

    Debate:
    {debate_texto}
    """
    
    system_message = "Eres un asistente que provee feedback al usuario en debates de forma concisa y precisa."
    
    try:
        import openai
        openai.api_key = OPEN_API_CHAT_GPT
        
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": summary_prompt},
            ],
        )
        return response.choices[0].message.content
        
    except Exception as e:
        print(f"Error al usar ChatGPT para el resumen: {str(e)}")
        try:
            API_KEY = os.getenv("GROG_API_LLAMA")
            client = Groq(api_key=API_KEY)
            
            chat_completion = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": summary_prompt},
                ],
            )
            return chat_completion.choices[0].message.content
            
        except Exception as e:
            print(f"Error también al usar Groq para el resumen: {str(e)}")
            return """
            **Aspectos Positivos:**
            - No se pudo generar un análisis detallado en este momento.

            **Áreas de Mejora:**
            - Intenta de nuevo más tarde.

            **Sugerencias:**
            - Verifica tu conexión a internet.

            **Calificación Final:** 0
            """

def save_report(report: DebateReportRequest, db: Session = Depends(get_session)) -> DebateReportRequest:
    db.add(report)
    db.commit()
    db.refresh(report)
    return report

def get_user_reports(email: str, db: Session = Depends(get_session)) -> list[DebateReportRequest]:
    statement = select(DebateReportRequest).where(email == DebateReportRequest.email)
    results = db.exec(statement)
    return results.all()