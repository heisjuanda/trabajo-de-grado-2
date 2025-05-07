import os
from fastapi import Depends
from sqlmodel import Session, select
from dotenv import load_dotenv
import tempfile
import json
import re

from groq import Groq

from database import get_session
from errors import Missing
from service.oratory_audio import save_audio_blob

def build_oratory_prompt(difficulty: int) -> str:
    if difficulty == 0:
        return (
            "Genera un contenido de oratoria de nivel principiante, dirigido a personas que recién empiezan a hablar en público. "
            "El tema debe ser cotidiano y sencillo, fácil de comprender y relacionarse, y debe elegirse de forma aleatoria "
            "(por ejemplo: \"El valor de sonreír\", \"Por qué es bueno caminar\", \"El poder de decir gracias\"). u otros temas originales y variados que inviten a reflexionar, debatir o inspirar a la audiencia"
            "El discurso debe tener una estructura clara con: "
            "Introducción, Desarrollo y Conclusión. "
            "El texto completo debe durar menos de 1 minuto (aproximadamente 200 a 320 palabras). "
            "Además, incluye 3 frases clave que ayuden al orador a recordar los puntos principales. "
            "Devuelve solo la respuesta en formato JSON.stringify, con los siguientes campos: "
            "\"tema\": el nombre del tema, "
            "\"guion\": el texto completo del discurso, estructurado, "
            "\"frasesClave\": un array con 3 frases cortas. "
            "No agregues comentarios ni bloques de código, solo devuelve el contenido JSON serializado."    
        )
    elif difficulty == 1:
        return (
            "Genera un contenido de oratoria de nivel avanzado, dirigido a personas con experiencia en hablar en público. "
            "El objetivo es desarrollar habilidades de improvisación, persuasión y uso de recursos retóricos. "
            "El tema debe elegirse de forma aleatoria, pero debe permitir el uso de metáforas, datos sorprendentes, anécdotas o apelaciones emocionales "
            "(por ejemplo: \"El tiempo como moneda\", \"Lo que el miedo nos enseña\", \"Tecnología: ¿progreso o prisión?\" u otros temas originales y variados que inviten a reflexionar, debatir o inspirar a la audiencia). "
            "El discurso tendrá como objetivo persuadir o emocionar al público y debe estar diseñado para durar hasta 1 minuto y 20 segundos (alrededor de 160 a 180 palabras). "
            "No generes el discurso completo. En su lugar, proporciona lo siguiente en formato JSON.stringify: "
            "- \"tema\": el título o idea principal del discurso "
            "- \"ideaCentral\": una breve descripción del enfoque del discurso (qué se quiere transmitir o lograr) "
            "- \"frasesClave\": un array con 3 a 4 frases o recursos retóricos sugeridos que el orador puede usar o adaptar "
            "- \"ayudas\": sugerencias opcionales como palabras clave, emociones a enfatizar o pausas estratégicas. "
            "No agregues comentarios ni bloques de código, solo devuelve el contenido JSON serializado."
        )
    elif difficulty == 2:
        return (
            "Genera un contenido de oratoria de nivel experto, dirigido a personas con alto dominio de la palabra y capacidad de análisis bajo presión. "
            "El tema debe ser abstracto o polémico, diseñado para desafiar el pensamiento crítico y el manejo escénico (por ejemplo: \"¿La tecnología reemplazará la oratoria?\", \"La verdad como construcción social\"). "
            "El discurso debe estar diseñado para una duración máxima de 2 minutos (alrededor de 220 a 250 palabras), pero no generes el discurso completo. "
            "En su lugar, proporciona lo siguiente en formato JSON.stringify: "
            "- \"tema\": el título o eje central del discurso "
            "- \"ideaCentral\": una descripción breve de lo que el discurso buscará plantear, cuestionar o defender "
            "- \"preguntaIntermedia\": una pregunta crítica relacionada con el tema que será planteada a mitad del discurso para que el orador la responda en vivo "
            "- \"frasesClave\": un array con 3 a 4 frases, ideas poderosas o recursos retóricos que el orador puede usar como guía o inspiración "
            "- \"ayudas\": sugerencias opcionales como posibles interrupciones, giros argumentativos, palabras clave, o emociones a manejar. "
            "No agregues comentarios ni bloques de código, solo devuelve el contenido JSON serializado."
        )
    else:
        raise ValueError("La dificultad debe ser 0 (principiante), 1 (avanzado) o 2 (experto).")

def generate_oratory_topic(difficulty: int):
    load_dotenv()
    OPEN_API_CHAT_GPT = os.getenv("OPEN_API_CHAT_GPT")
    if not OPEN_API_CHAT_GPT:
        raise ValueError("Falta la clave de API OPEN_API_CHAT_GPT")
    
    API_KEY = os.getenv("GROG_API")
    if not API_KEY:
        raise ValueError("Falta la clave de API GROG_API")
    
    prompt = build_oratory_prompt(difficulty)
    system_message = "Eres un experto en oratoria capaz de generar contenido para discursos."
    
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
        print(f"Error al usar ChatGPT para generar tema de oratoria: {str(e)}")
        try:
            client = Groq(api_key=API_KEY)
            
            chat_completion = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": prompt},
                ],
                model="llama-3.3-70b-versatile",
            )
            return chat_completion.choices[0].message.content
            
        except Exception as e2:
            print(f"Error también al usar Groq para generar tema de oratoria: {str(e2)}")
            raise ValueError("No se pudo generar un tema de oratoria. Por favor, intenta de nuevo más tarde.")

def get_summary_prompt(transcript: str, topic: dict, time: int, full_text: str, is_question: bool):
    try:
        difficulty = int(topic.get('difficulty', 0))
    except ValueError:
        difficulty = 0

    if difficulty == 0:
        return (
            "Resumen y análisis de oratoria nivel principiante\n\n"
            "(Todo error es responsabilidad del orador, no de la tecnología\n\n)"
            "Las transcripciones son siempre la fuente de la verdad de lo que dijo el orador, no el guion."
            f"Este es un análisis de oratoria basado en los siguientes insumos:\n\n"

            f"1. Transcripción del audio (vía Whisper):\n{full_text}\n\n"
            f"2. Transcripción generada por el navegador:\n{transcript}\n\n"
            f"3. Guion preparado por la IA dado al usuario:\n{topic.get('guion', 'Sin guion disponible')}\n\n"
            f"5. Frases clave que el orador debía incluir:\n{', '.join(topic.get('frasesClave', []))}\n\n"
            f"6. Tiempo de duración del discurso en milisegundos:\n{time}\n\n"

            "Por favor realiza lo siguiente:\n\n"
            "1. Extrae los puntos clave del discurso en forma de lista.\n"
            "2. Compara la transcripciones (whisper y webApi) real con el guion original: ¿Se mantuvo fiel al guion? ¿Qué partes se omitieron, alteraron o añadieron?\n"
            "3. Verifica si el orador mencionó las frases clave indicadas. Si no lo hizo, indícalo.\n"
            "4. Identifica muletillas, repeticiones innecesarias, pausas incómodas o errores de fluidez verbal.\n"
            "5. Evalúa si el discurso mantuvo un enfoque claro, coherencia, estructura y conexión con la audiencia.\n"
            "6. Da un feedback final que incluya fortalezas y aspectos a mejorar en la ejecución del discurso.\n"
            "7. El tiempo de duración de las palabras del usuario (webApi y whisper) es apropiado para que la audiencia lo entienda?"
            """8. Calificación del discurso:
            Por favor, proporciona la calificación en una escala de 1 a 10 de forma clara.
            Formatea tu respuesta en Markdown usando este formato:

            **Calificación:** 8/10 🎯
            (Reemplaza el número "8" por la calificación real).
            No añadas texto extra después de la calificación."""
        )
    elif difficulty == 1:
        return (
            "Resumen y análisis de oratoria nivel intermedio\n\n"
            "Este es un análisis de oratoria basado en los siguientes insumos:\n\n"
            "(Todo error es responsabilidad del orador, no de la tecnología\n\n)"
            "Las transcripciones son siempre la fuente de la verdad de lo que dijo el orador, no el tema central."


            f"1. Transcripción del audio (vía Whisper):\n{full_text}\n\n"
            f"2. Transcripción generada por el navegador:\n{transcript}\n\n"
            f"3. Tema e idea central preparados por el usuario:\n"
            f"Tema dado por la IA al Orador: {topic.get('tema', 'Sin tema disponible')}\n"
            f"Idea central dada por la IA al Orador: {topic.get('ideaCentral', 'Sin idea central')}\n\n"
            f"4. Frases clave sugeridas para el discurso por la IA que el orador debía usar:\n{', '.join(topic.get('frasesClave', []))}\n\n"
            f"5. Ayudas sugeridas (emociones, pausas, palabras clave) por la IA que el orador debía usar:\n{topic.get('ayudas', [])}\n\n"

            "Por favor realiza lo siguiente:\n\n"
            "1. Resume el contenido del discurso (transcripción whisper y webApi) en un solo párrafo e indica si el tema tiene que ver con las transcripciones.\n"
            "2. Identifica y explica los recursos retóricos utilizados por el orador (metáforas, anécdotas, apelaciones emocionales, etc.).\n"
            "3. Evalúa el grado de persuasión del discurso: ¿logró emocionar, convencer o impactar al oyente?\n"
            "4. Compara el contenido real con la idea central: ¿Se mantuvo el enfoque? ¿Qué partes se desviaron, añadieron o faltaron?\n"
            "5. Verifica si se utilizaron las frases clave sugeridas. Si se adaptaron, explica cómo; si se omitieron, indícalo.\n"
            "6. Analiza el uso de pausas, ritmo, énfasis emocional y lenguaje corporal (si aplica).\n"
            "7. Detecta muletillas, interrupciones, o dificultades de fluidez.\n"
            "8. Da un feedback final que incluya fortalezas y aspectos a mejorar en la ejecución del discurso.\n"
            """9. Calificación del discurso:
            Por favor, proporciona la calificación en una escala de 1 a 10 de forma clara.
            Formatea tu respuesta en Markdown usando este formato:

            **Calificación:** 8/10 🎯
            (Reemplaza el número "8" por la calificación real).
            No añadas texto extra después de la calificación."""
        )
    elif difficulty == 2:
        return (
            "Resumen y análisis de oratoria nivel experto\n\n"
            "Este es un análisis de oratoria basado en los siguientes insumos:\n\n"
            "(Todo error es responsabilidad del orador, no de la tecnología\n\n)"
            "Las transcripciones son siempre la fuente de la verdad de lo que dijo el orador, no el tema central."

            f"1. Transcripción del audio (vía Whisper):\n{full_text}\n\n"
            f"2. Transcripción generada por el navegador:\n{transcript}\n\n"
            f"3. Tema e idea central preparados por el usuario:\n"
            f"Tema dado por la IA al Orador: {topic.get('tema', 'Sin tema disponible')}\n"
            f"Idea central dada por la IA al Orador: {topic.get('ideaCentral', 'Sin idea central')}\n\n"
            f"4. Pregunta intermedia que debía ser respondida en vivo {is_question}:\n{topic.get('preguntaIntermedia', 'No se proporcionó')}\n\n"
            f"5. Frases clave o ideas poderosas sugeridas por la IA al Orador que el usuario debía usar:\n{', '.join(topic.get('frasesClave', []))}\n\n"
            f"6. Ayudas sugeridas (giros argumentativos, palabras clave, emociones) por la IA al Orador que el usuario debía usar:\n{topic.get('ayudas', [])}\n\n"

            "Por favor realiza lo siguiente:\n\n"
            "1. Resume el contenido del discurso (transcripción whisper y webApi) en un solo párrafo e indica si el tema tiene que ver con las transcripciones.\n"
            "2. Evalúa la claridad, profundidad y solidez argumentativa del discurso: ¿Hubo una tesis clara? ¿Se defendió bien?\n"
            f"3. Analiza cómo se abordó la pregunta intermedia hecha por webApi: {topic.get('preguntaIntermedia', 'No se proporcionó')}:\n"
            "   - ¿Se respondió con claridad, profundidad y creatividad?\n"
            "   - ¿La respuesta aportó valor o generó nuevas reflexiones?\n"
            "   - ¿Hubo improvisación, seguridad o dudas al responderla?\n"
            "4. Analiza cómo se abordó la pregunta intermedia: ¿Fue respondida de forma pertinente, creativa o contundente?\n"
            "5. Identifica recursos retóricos complejos utilizados (analogías, contraargumentos, ironías, dilemas, etc.).\n"
            "6. Evalúa si el discurso logró mantener un equilibrio entre lógica, emoción y presencia escénica.\n"
            "7. Verifica si se usaron o adaptaron las frases clave sugeridas, y cómo aportaron al mensaje general.\n"
            "8. Detecta interrupciones, improvisaciones o desviaciones del enfoque original: ¿enriquecieron o debilitaron el discurso?\n"
            "9. Da un feedback final que incluya una evaluación integral del desempeño: estructura, fluidez, persuasión y profundidad.\n"
            """10. Calificación del discurso:
            Por favor, proporciona la calificación en una escala de 1 a 10 de forma clara.
            Formatea tu respuesta en Markdown usando este formato:

            **Calificación:** 8/10 🎯
            (Reemplaza el número "8" por la calificación real).
            No añadas texto extra después de la calificación."""
        )

def get_sentiment_prompt(transcript: str, topic: dict, time: int, full_text: str):
    try:
        difficulty = int(topic.get('difficulty', 0))
    except ValueError:
        difficulty = 0

    if difficulty == 0:
        return (
            "Detección de sentimiento de oratoria nivel principiante\n\n"
            "Este es un análisis de oratoria basado en los siguientes insumos:\n\n"
            "(Todo error es responsabilidad del orador, no de la tecnología\n\n)"
            "Las transcripciones son siempre la fuente de la verdad de lo que dijo el orador"

            f"Analiza el sentimiento del siguiente discurso desde una perspectiva comunicacional y emocional.\n\n"
            f"1. Transcripción del audio (Whisper):\n{full_text}\n\n"
            f"2. Transcripción del navegador (webApi):\n{transcript}\n\n"
            f"3. Tiempo de duración del discurso en milisegundos:\n{time}\n\n"

            "Evalúa los siguientes aspectos:\n"
            "- ¿Qué tipo de emoción o estado emocional predomina en el discurso? (Ej.: entusiasmo, tristeza, duda, confianza, etc.)\n"
            "- Clasifica el sentimiento general como positivo, negativo o neutral y explica por qué.\n"
            "- ¿El tono emocional fue consistente durante el discurso?\n"
            "- ¿Cómo podría afectar este sentimiento a la conexión con la audiencia?\n"
            "- Si hubo variaciones en el sentimiento (como cambios bruscos de tono), descríbelas.\n"
            "- ¿El tiempo de duración de las palabras del usuario (webApi y whisper) describe alguna emoción en particular?"
        )
    elif difficulty == 1:
        return (
            "Detección de sentimiento de oratoria nivel intermedio\n\n"
            "Este es un análisis de oratoria basado en los siguientes insumos:\n\n"
            "(Todo error es responsabilidad del orador, no de la tecnología\n\n)"
            "Las transcripciones son siempre la fuente de la verdad de lo que dijo el orador"

            f"1. Transcripción del audio (vía Whisper):\n{full_text}\n\n"
            f"2. Transcripción generada por el navegador:\n{transcript}\n\n"
            f"3. Tiempo de duración del discurso:\n{time} segundos\n\n"

            "Evalúa los siguientes aspectos emocionales del discurso:\n"
            "- ¿Cuál fue la emoción predominante a lo largo del discurso? (Ej.: seguridad, duda, entusiasmo, preocupación, etc.)\n"
            "- ¿Cómo se manifestó esa emoción en el ritmo, el lenguaje y el enfoque del discurso?\n"
            "- ¿El tono emocional fue consistente con la idea central del discurso?\n"
            "- ¿Se percibieron momentos de quiebre emocional, énfasis o cambio de tono?\n"
            "- ¿La emoción ayudó a conectar con la audiencia o desvió la atención del mensaje principal?\n"
        )
    elif difficulty == 2:
        return (
            "Detección de sentimiento de oratoria nivel experto\n\n"
            "Este es un análisis de oratoria basado en los siguientes insumos:\n\n"
            "(Todo error es responsabilidad del orador, no de la tecnología\n\n)"
            "Las transcripciones son siempre la fuente de la verdad de lo que dijo el orador"

            f"1. Transcripción del audio (Whisper):\n{full_text}\n\n"
            f"2. Transcripción del navegador (webApi):\n{transcript}\n\n"

            "Analiza los siguientes aspectos emocionales:\n"
            "- ¿Qué tipo de emoción dominó el discurso en general? (Ej.: autoridad, provocación, calma, ironía, pasión, etc.)\n"
            "- ¿Fue el tono emocional adecuado para un discurso de nivel experto con enfoque crítico o polémico?\n"
            "- ¿Se detectaron cambios de emoción en la respuesta a la pregunta intermedia?\n"
            "- ¿Hubo momentos donde la emoción reforzó o debilitó la argumentación?\n"
            "- ¿Cómo influyó el tono emocional en la percepción del orador como alguien persuasivo, reflexivo o contundente?\n"
        )

def get_keywords_prompt(transcript: str, topic: dict, full_text: str):
    try:
        difficulty = int(topic.get('difficulty', 0))
    except ValueError:
        difficulty = 0

    if difficulty == 0:
        return (
            f"Análisis de palabras clave y entidades (nivel principiante):\n\n"
            f"1. Transcripción del audio (Whisper):\n{full_text}\n\n"
            f"2. Transcripción del navegador (webApi):\n{transcript}\n\n"
            "(Todo error es responsabilidad del orador, no de la tecnología\n\n)"
            "Las transcripciones son siempre la fuente de la verdad de lo que dijo el orador"

            "Analiza lo siguiente:\n"
            "- Identifica las palabras clave o conceptos más importantes en el discurso.\n"
            "- Extrae las entidades nombradas: personas, lugares, instituciones o conceptos relevantes mencionados.\n"
            "- ¿Hay alguna palabra clave o entidad relevante que el orador omitió o que no se alineó con el guion?\n"
        )
    elif difficulty == 1:
        return (
            f"Análisis de palabras clave y entidades (nivel intermedio):\n\n"
            "(Todo error es responsabilidad del orador, no de la tecnología\n\n)"
            "Las transcripciones son siempre la fuente de la verdad de lo que dijo el orador"

            f"1. Transcripción del audio (Whisper):\n{full_text}\n\n"
            f"2. Transcripción del navegador (webApi):\n{transcript}\n\n"

            "Analiza lo siguiente:\n"
            "- Extrae las palabras clave y conceptos centrales usados en el discurso.\n"
            "- Identifica entidades nombradas (personas, instituciones, eventos, conceptos técnicos o culturales).\n"
            "- Evalúa si las entidades o términos usados refuerzan la idea central o si hubo menciones irrelevantes.\n"
        )
    elif difficulty == 2:
        return (
            f"Análisis de palabras clave y entidades (nivel experto):\n\n"
            "(Todo error es responsabilidad del orador, no de la tecnología\n\n)"
            "Las transcripciones son siempre la fuente de la verdad de lo que dijo el orador"

            f"1. Transcripción del audio (Whisper):\n{full_text}\n\n"
            f"2. Transcripción del navegador (webApi):\n{transcript}\n\n"

            "Realiza el siguiente análisis avanzado de contenido:\n"
            "- Extrae las palabras clave más relevantes utilizadas en el discurso y clasifícalas según su función: argumentativa, emocional o retórica.\n"
            "- Identifica entidades mencionadas, tanto explícitas como implícitas (teóricos, corrientes filosóficas, instituciones, ideologías, etc.).\n"
            "- ¿Se utilizaron términos técnicos, abstractos o especializados?\n"
        )
    
def analyze_oratory_input(transcript: str, topic: dict, audio_bytes: bytes, audio_filename: str, time: int, is_question: bool, user_email: str, db: Session):
    load_dotenv()
    API_KEY = os.getenv("GROG_API")
    if not API_KEY:
        raise ValueError("Falta la clave de API GROG_API")
    
    GROQ_API_KEY = os.getenv("GROG_API_WHISPER")
    if not GROQ_API_KEY:
        raise ValueError("Falta la clave de API GROG_API_WHISPER")
    
    client = Groq(api_key=API_KEY)
    whisper_client = Groq(api_key=GROQ_API_KEY)

    with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
        tmp.write(audio_bytes)
        tmp.flush()
        tmp_filename = tmp.name

    try:
        with open(tmp_filename, "rb") as file:
            transcription = whisper_client.audio.transcriptions.create(
                file=(audio_filename, file.read()),
                model="whisper-large-v3",
                response_format="verbose_json",
                language="es",
            )
        full_text = transcription.text
    except Exception as e:
        print(f"Error al transcribir con Whisper: {str(e)}")
        full_text = f"[No se pudo obtener la transcripción con Whisper. Utiliza la transcripción del navegador]: {transcript}"

    summary_system = (
        "Eres un experto en análisis de discursos. "
        "Evalúa como si el orador fuera un humano hablando ante una audiencia real. "
        "Asume que cualquier error o desvío del guion es responsabilidad del orador, no de la tecnología. "
        "webApi y whisper son herramientas que sirven para saber lo que dijo el orador. "
        "Tu objetivo es ayudarle a mejorar su claridad, impacto y dominio del tema."
    )
    
    sentiment_system = (
        "Eres un experto en análisis de emociones y sentimientos en discursos orales. "
        "Tu tarea es identificar el tipo de sentimiento predominante, su impacto en la audiencia, y si el tono emocional coincide con la intención original del orador según su guion. "
        "Debes ofrecer una evaluación clara y con justificación crítica."
    )
    
    keywords_system = (
        "Eres un experto en análisis lingüístico y en la identificación de palabras clave y entidades en discursos. "
        "Tu tarea es extraer las palabras clave y entidades de la transcripción del discurso, compararlas con las frases clave que el orador debía usar y con el guion original, "
        "y proporcionar una evaluación crítica sobre su relevancia y efectividad en el discurso."
    )

    summary_prompt = get_summary_prompt(transcript, topic, time, full_text, is_question)
    sentiment_prompt = get_sentiment_prompt(transcript, topic, time, full_text)
    keywords_prompt = get_keywords_prompt(transcript, topic, full_text)

    try:
        summary_response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": summary_system},
                {"role": "user", "content": summary_prompt}
            ],
            model="llama-3.3-70b-versatile"
        )
        summary = summary_response.choices[0].message.content
    except Exception as e:
        print(f"Error al generar resumen con Groq: {str(e)}")
        summary = "No se pudo generar el análisis del discurso. Por favor, intenta de nuevo más tarde."

    try:
        sentiment_response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": sentiment_system},
                {"role": "user", "content": sentiment_prompt}
            ],
        )
        sentiment = sentiment_response.choices[0].message.content
    except Exception as e:
        print(f"Error al analizar sentimiento con Groq: {str(e)}")
        sentiment = "No se pudo generar el análisis de sentimiento. Por favor, intenta de nuevo más tarde."

    try:
        keywords_response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": keywords_system},
                {"role": "user", "content": keywords_prompt}
            ],
        )
        keywords = keywords_response.choices[0].message.content
    except Exception as e:
        print(f"Error al analizar palabras clave con Groq: {str(e)}")
        keywords = "No se pudo generar el análisis de palabras clave. Por favor, intenta de nuevo más tarde."

    calificacion = 0
    match = re.search(r'\*\*Calificación:\*\*\s*(\d+)/10', summary)
    if match:
        try:
            calificacion = int(match.group(1))
            calificacion = max(1, min(calificacion, 10))
        except ValueError:
            pass

    feedback = {
        "transcripcion_whisper": full_text,
        "transcripcion_webApi": transcript,
        "resumen": summary,
        "sentimiento": sentiment,
        "temas_clave": keywords,
        "calificacion": calificacion
    }

    feedback_json = json.dumps(feedback)
    
    try:
        save_audio_blob(
            user_email=user_email,
            feedback=feedback_json,
            calification=calificacion,
            transcript=full_text,
            audio_bytes=audio_bytes,
            audio_format="audio/webm",
            duration_ms=time,
            session=db
        )
    except Exception as e:
        print(f"Error al guardar el audio: {str(e)}")

    return feedback
