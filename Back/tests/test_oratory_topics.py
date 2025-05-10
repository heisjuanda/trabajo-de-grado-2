import pytest
import json
import os
import tempfile
from unittest.mock import patch, MagicMock, mock_open
from sqlmodel import Session

import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from service.oratory_topics import (
    build_oratory_prompt,
    generate_oratory_topic,
    get_summary_prompt,
    get_sentiment_prompt,
    get_keywords_prompt,
    analyze_oratory_input
)

# Tests para build_oratory_prompt
def test_build_oratory_prompt():
    # Probamos diferentes niveles de dificultad
    principiante_prompt = build_oratory_prompt(0)
    assert "nivel principiante" in principiante_prompt
    assert "tema debe ser cotidiano y sencillo" in principiante_prompt
    
    avanzado_prompt = build_oratory_prompt(1)
    assert "nivel avanzado" in avanzado_prompt
    assert "habilidades de improvisación" in avanzado_prompt
    
    experto_prompt = build_oratory_prompt(2)
    assert "nivel experto" in experto_prompt
    assert "tema debe ser abstracto o polémico" in experto_prompt
    
    # Probamos un nivel de dificultad inválido
    with pytest.raises(ValueError, match="La dificultad debe ser 0 \\(principiante\\), 1 \\(avanzado\\) o 2 \\(experto\\)\\."):
        build_oratory_prompt(3)

# Tests para generate_oratory_topic
@patch('os.getenv')
def test_generate_oratory_topic_error_missing_api_keys(mock_getenv):
    # Simulamos que no hay claves de API
    mock_getenv.return_value = None
    
    with pytest.raises(ValueError, match="Falta la clave de API OPEN_API_CHAT_GPT"):
        generate_oratory_topic(0)

@patch('os.getenv')
def test_generate_oratory_topic_success_openai(mock_getenv):
    # Configuramos valores de entorno
    mock_getenv.side_effect = lambda key: "fake_api_key" if key in ["OPEN_API_CHAT_GPT", "GROG_API"] else None
    
    # Mock para OpenAI
    mock_openai = MagicMock()
    mock_openai.chat.completions.create.return_value.choices = [
        MagicMock(message=MagicMock(content='{"tema": "El valor de la amistad", "guion": "Texto de prueba", "frasesClave": ["Frase 1", "Frase 2", "Frase 3"]}'))
    ]
    
    # Hacemos patch al módulo openai
    with patch.dict('sys.modules', {'openai': mock_openai}):
        result = generate_oratory_topic(0)
        
        # Verificamos que OpenAI fue llamado con los parámetros correctos
        assert result == '{"tema": "El valor de la amistad", "guion": "Texto de prueba", "frasesClave": ["Frase 1", "Frase 2", "Frase 3"]}'
        mock_openai.chat.completions.create.assert_called_once()

@patch('os.getenv')
def test_generate_oratory_topic_fallback_to_groq(mock_getenv):
    # Configuramos valores de entorno
    mock_getenv.side_effect = lambda key: "fake_api_key" if key in ["OPEN_API_CHAT_GPT", "GROG_API"] else None
    
    # Mock para OpenAI (que fallará)
    mock_openai = MagicMock()
    mock_openai.chat.completions.create.side_effect = Exception("Error de API")
    
    # Mock para Groq
    mock_groq_client = MagicMock()
    mock_groq_client.chat.completions.create.return_value.choices = [
        MagicMock(message=MagicMock(content='{"tema": "La importancia del tiempo", "guion": "Texto de prueba con Groq", "frasesClave": ["Frase A", "Frase B", "Frase C"]}'))
    ]
    mock_groq = MagicMock(return_value=mock_groq_client)
    
    # Hacemos patch a los módulos
    with patch.dict('sys.modules', {'openai': mock_openai}):
        with patch('service.oratory_topics.Groq', mock_groq):
            result = generate_oratory_topic(0)
            
            # Verificamos que se usó Groq como fallback
            assert result == '{"tema": "La importancia del tiempo", "guion": "Texto de prueba con Groq", "frasesClave": ["Frase A", "Frase B", "Frase C"]}'
            mock_groq.assert_called_once_with(api_key="fake_api_key")
            mock_groq_client.chat.completions.create.assert_called_once()

# Tests para get_summary_prompt
def test_get_summary_prompt():
    # Creamos datos de prueba
    transcript = "Esta es una transcripción de prueba."
    topic = {
        "difficulty": 0,
        "guion": "Este es el guion original.",
        "frasesClave": ["Frase 1", "Frase 2", "Frase 3"]
    }
    time = 60000  # 1 minuto en ms
    full_text = "Esta es la transcripción completa del audio."
    is_question = False
    
    # Probamos para nivel principiante
    prompt_principiante = get_summary_prompt(transcript, topic, time, full_text, is_question)
    assert "Resumen y análisis de oratoria nivel principiante" in prompt_principiante
    assert "Esta es una transcripción de prueba" in prompt_principiante
    assert "Este es el guion original" in prompt_principiante
    assert "Frase 1, Frase 2, Frase 3" in prompt_principiante
    
    # Probamos para nivel avanzado
    topic["difficulty"] = 1
    topic["tema"] = "Tema avanzado"
    topic["ideaCentral"] = "Idea central avanzada"
    topic["ayudas"] = "Pausas y énfasis"
    
    prompt_avanzado = get_summary_prompt(transcript, topic, time, full_text, is_question)
    assert "Resumen y análisis de oratoria nivel intermedio" in prompt_avanzado
    assert "Tema avanzado" in prompt_avanzado
    assert "Idea central avanzada" in prompt_avanzado
    
    # Probamos para nivel experto
    topic["difficulty"] = 2
    topic["preguntaIntermedia"] = "¿Por qué es importante este tema?"
    
    prompt_experto = get_summary_prompt(transcript, topic, time, full_text, True)
    assert "Resumen y análisis de oratoria nivel experto" in prompt_experto
    assert "¿Por qué es importante este tema?" in prompt_experto
    assert "Evalúa la claridad, profundidad y solidez argumentativa" in prompt_experto

# Tests para get_sentiment_prompt
def test_get_sentiment_prompt():
    # Creamos datos de prueba
    transcript = "Esta es una transcripción de prueba."
    topic = {"difficulty": 0}
    time = 60000
    full_text = "Esta es la transcripción completa."
    
    # Probamos para nivel principiante
    prompt_principiante = get_sentiment_prompt(transcript, topic, time, full_text)
    assert "Detección de sentimiento de oratoria nivel principiante" in prompt_principiante
    assert "Esta es una transcripción de prueba" in prompt_principiante
    assert "¿Qué tipo de emoción o estado emocional predomina" in prompt_principiante
    
    # Probamos para nivel avanzado
    topic["difficulty"] = 1
    prompt_avanzado = get_sentiment_prompt(transcript, topic, time, full_text)
    assert "Detección de sentimiento de oratoria nivel intermedio" in prompt_avanzado
    assert "¿Cuál fue la emoción predominante a lo largo del discurso?" in prompt_avanzado
    
    # Probamos para nivel experto
    topic["difficulty"] = 2
    prompt_experto = get_sentiment_prompt(transcript, topic, time, full_text)
    assert "Detección de sentimiento de oratoria nivel experto" in prompt_experto
    assert "¿Qué tipo de emoción dominó el discurso en general?" in prompt_experto

# Tests para get_keywords_prompt
def test_get_keywords_prompt():
    # Creamos datos de prueba
    transcript = "Esta es una transcripción de prueba."
    topic = {"difficulty": 0}
    full_text = "Esta es la transcripción completa."
    
    # Probamos para nivel principiante
    prompt_principiante = get_keywords_prompt(transcript, topic, full_text)
    assert "Análisis de palabras clave y entidades (nivel principiante)" in prompt_principiante
    assert "Identifica las palabras clave o conceptos más importantes" in prompt_principiante
    
    # Probamos para nivel avanzado
    topic["difficulty"] = 1
    prompt_avanzado = get_keywords_prompt(transcript, topic, full_text)
    assert "Análisis de palabras clave y entidades (nivel intermedio)" in prompt_avanzado
    assert "Extrae las palabras clave y conceptos centrales" in prompt_avanzado
    
    # Probamos para nivel experto
    topic["difficulty"] = 2
    prompt_experto = get_keywords_prompt(transcript, topic, full_text)
    assert "Análisis de palabras clave y entidades (nivel experto)" in prompt_experto
    assert "Realiza el siguiente análisis avanzado de contenido" in prompt_experto

# Tests para analyze_oratory_input
@patch('os.getenv')
@patch('service.oratory_topics.Groq')
@patch('tempfile.NamedTemporaryFile')
@patch('service.oratory_topics.save_audio_blob')
@patch('service.oratory_topics.re.search')  # Agregamos patch para re.search
@patch('service.oratory_topics.load_dotenv')  # Hacemos mock de load_dotenv
def test_analyze_oratory_input(mock_load_dotenv, mock_re_search, mock_save_audio, mock_tempfile, mock_groq, mock_getenv):
    # Mock para re.search para que devuelva un objeto que imite el comportamiento de re.Match
    mock_match = MagicMock()
    mock_match.group.return_value = "8"  # Devuelve "8" cuando se llama a match.group(1)
    mock_re_search.return_value = mock_match
    
    # Configuramos valores de entorno
    mock_getenv.side_effect = lambda key: "fake_api_key" if key in ["GROG_API", "GROG_API_WHISPER"] else None
    
    # Mock para tempfile
    mock_file = MagicMock()
    mock_file.name = "/tmp/temp_audio.webm"
    mock_tempfile.return_value.__enter__.return_value = mock_file
    
    # Mock para Groq - Whisper y ChatGPT
    mock_groq_client = MagicMock()
    
    # Mock para file.read en open del tempfile
    mock_file_content = b"audio_data"
    
    # Patch para la función open que se usa en el contexto "with open(tmp_filename, 'rb') as file:"
    with patch('builtins.open', mock_open(read_data=mock_file_content)):
        # Configurar respuesta de transcripción
        mock_whisper_response = MagicMock()
        mock_whisper_response.text = "Transcripción del audio con Whisper."
        mock_groq_client.audio.transcriptions.create.return_value = mock_whisper_response
        
        # Configurar respuestas de chat para resumen, sentimiento y palabras clave
        # Usamos cadenas de texto en lugar de MagicMock para content
        mock_choices = []
        for content in [
            "Análisis del discurso. **Calificación:** 8/10 🎯",
            "Análisis de sentimiento del discurso.",
            "Análisis de palabras clave del discurso."
        ]:
            mock_choice = MagicMock()
            mock_choice.message.content = content
            mock_choices.append(MagicMock(choices=[mock_choice]))
        
        # Configurar las llamadas secuenciales a completions.create
        mock_groq_client.chat.completions.create.side_effect = mock_choices
        
        # Configurar el retorno de Groq
        mock_groq.return_value = mock_groq_client
        
        # Datos de prueba
        transcript = "Esta es una transcripción de prueba desde el navegador."
        topic = {
            "difficulty": 0,
            "guion": "Este es el guion original.",
            "frasesClave": ["Frase 1", "Frase 2", "Frase 3"]
        }
        audio_bytes = b"audio_data"
        audio_filename = "audio.webm"
        time = 60000
        is_question = False
        user_email = "test@example.com"
        mock_db = MagicMock()
        
        # Llamamos a la función
        result = analyze_oratory_input(
            transcript, topic, audio_bytes, audio_filename, 
            time, is_question, user_email, mock_db
        )
        
        # Verificaciones
        assert isinstance(result, dict)
        assert "transcripcion_whisper" in result
        assert "transcripcion_webApi" in result
        assert "resumen" in result
        assert "sentimiento" in result
        assert "temas_clave" in result
        assert "calificacion" in result
        assert result["calificacion"] == 8
        
        # Verificar que se guardó el audio con los parámetros correctos
        expected_transcript = "Transcripción del audio con Whisper."
        
        # Verificamos que save_audio_blob fue llamado exactamente una vez
        assert mock_save_audio.call_count == 1
        
        # Obtenemos los argumentos con los que fue llamado
        call_args = mock_save_audio.call_args
        # Verificamos que el transcription sea el correcto
        assert call_args[1]['transcript'] == expected_transcript
        
        # Verificamos otros parámetros
        assert call_args[1]['user_email'] == user_email
        assert call_args[1]['calification'] == 8
        assert call_args[1]['audio_bytes'] == audio_bytes
        assert call_args[1]['audio_format'] == "audio/webm"
        assert call_args[1]['duration_ms'] == time

@patch('os.getenv')
@patch('service.oratory_topics.Groq')
@patch('tempfile.NamedTemporaryFile')
@patch('service.oratory_topics.save_audio_blob')
@patch('service.oratory_topics.re.search')  # Agregamos patch para re.search
@patch('service.oratory_topics.load_dotenv')  # Hacemos mock de load_dotenv
def test_analyze_oratory_input_whisper_error(mock_load_dotenv, mock_re_search, mock_save_audio, mock_tempfile, mock_groq, mock_getenv):
    # Mock para re.search para que devuelva un objeto que imite el comportamiento de re.Match
    mock_match = MagicMock()
    mock_match.group.return_value = "7"  # Devuelve "7" cuando se llama a match.group(1)
    mock_re_search.return_value = mock_match
    
    # Configuramos valores de entorno
    mock_getenv.side_effect = lambda key: "fake_api_key" if key in ["GROG_API", "GROG_API_WHISPER"] else None
    
    # Mock para tempfile
    mock_file = MagicMock()
    mock_file.name = "/tmp/temp_audio.webm"
    mock_tempfile.return_value.__enter__.return_value = mock_file
    
    # Mock para Groq - Whisper y ChatGPT
    mock_groq_client = MagicMock()
    
    # Configurar error en transcripción
    mock_groq_client.audio.transcriptions.create.side_effect = Exception("Error en la transcripción")
    
    # Configurar respuestas de chat para resumen, sentimiento y palabras clave
    # Usamos cadenas de texto en lugar de MagicMock para content
    mock_choices = []
    for content in [
        "Análisis del discurso. **Calificación:** 7/10 🎯",
        "Análisis de sentimiento del discurso.",
        "Análisis de palabras clave del discurso."
    ]:
        mock_choice = MagicMock()
        mock_choice.message.content = content
        mock_choices.append(MagicMock(choices=[mock_choice]))
    
    # Configurar las llamadas secuenciales a completions.create
    mock_groq_client.chat.completions.create.side_effect = mock_choices
    
    # Configurar el retorno de Groq
    mock_groq.return_value = mock_groq_client
    
    # Datos de prueba
    transcript = "Esta es una transcripción de prueba desde el navegador."
    topic = {
        "difficulty": 0,
        "guion": "Este es el guion original.",
        "frasesClave": ["Frase 1", "Frase 2", "Frase 3"]
    }
    audio_bytes = b"audio_data"
    audio_filename = "audio.webm"
    time = 60000
    is_question = False
    user_email = "test@example.com"
    mock_db = MagicMock()
    
    # Llamamos a la función
    result = analyze_oratory_input(
        transcript, topic, audio_bytes, audio_filename, 
        time, is_question, user_email, mock_db
    )
    
    # Verificaciones
    assert isinstance(result, dict)
    assert "[No se pudo obtener la transcripción con Whisper" in result["transcripcion_whisper"]
    assert result["calificacion"] == 7
    
    # Verificamos que save_audio_blob fue llamado exactamente una vez
    assert mock_save_audio.call_count == 1
    
    # Obtenemos los argumentos con los que fue llamado
    call_args = mock_save_audio.call_args
    # Verificamos que el transcription sea el correcto (debe contener el mensaje de error)
    assert "[No se pudo obtener la transcripción con Whisper" in call_args[1]['transcript'] 