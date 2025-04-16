
import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()
API_KEY = os.getenv("GROG_API_WHISPER")
print(API_KEY)
client = Groq(api_key=API_KEY)
filename = os.path.dirname(__file__) + "/record.webm"

with open(filename, "rb") as file:
    transcription = client.audio.transcriptions.create(
      file=(filename, file.read()),
      model="whisper-large-v3",
      response_format="verbose_json",
      language="es",
    )
    print(transcription.text)
    chat_completion = client.chat.completions.create(
        messages=[
                {"role": "system", "content": "Resumen la transcripción en dos formatos:\n1. Un párrafo conciso\n2. Puntos clave en forma de lista."},
                {"role": "user", "content": f"Aquí está la transcripción del audio: {transcription.text}"}
            ],
        temperature=0,
        model="llama-3.3-70b-versatile",
    )
    print(chat_completion.choices[0].message.content)
    sentiment_response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "Eres un analizador de sentimiento. Analiza el sentimiento de la transcripción como positivo, negativo o neutral y explica tu razonamiento."},
                {"role": "user", "content": f"Aquí está la transcripción del audio: {transcription.text}"}
            ],
            temperature=0,
        )
    print(sentiment_response.choices[0].message.content)
    keywords_response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "Extrae los temas clave, palabras clave y entidades nombradas (como personas, lugares o organizaciones) de la transcripción."},
                {"role": "user", "content": f"Aquí está la transcripción del audio: {transcription.text}"}
            ],
            temperature=0,
        )
    print(keywords_response.choices[0].message.content)