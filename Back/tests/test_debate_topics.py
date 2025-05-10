import pytest
import random
from unittest.mock import patch, MagicMock
from sqlmodel import Session

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from service.debate_topics import (
    generate_random_between,
    get_random_topic,
    read_topic,
    generate_argument,
    summary_generator,
    save_report,
    get_user_reports
)
from model.debate_topics import DebateTopic, DebateReportRequest


def test_generate_random_between():
    result = generate_random_between(1, 10)
    assert 1 <= result <= 10
    
    result = generate_random_between(10, 5)
    assert result == 10
    
    result = generate_random_between(7, 7)
    assert result == 7


@patch('service.debate_topics.generate_random_between')
def test_get_random_topic(mock_random):
    mock_random.return_value = 42
    
    assert get_random_topic(0) == 42
    mock_random.assert_called_with(0, 16)
    
    assert get_random_topic(1) == 42
    mock_random.assert_called_with(0, 16)
    
    assert get_random_topic(99) == 42
    mock_random.assert_called_with(0, 16)


def test_read_topic():
    mock_db = MagicMock()
    
    mock_topic = DebateTopic(id=42, topic="¿Tema de prueba?", description="Descripción de prueba")
    mock_db.get.return_value = mock_topic
    
    with patch('service.debate_topics.get_random_topic', return_value=42):
        result = read_topic(5, mock_db)
        
        mock_db.get.assert_called_once_with(DebateTopic, 42)
        
        assert result == mock_topic


def test_read_topic_not_found():
    from errors import Missing
    
    mock_db = MagicMock()
    mock_db.get.return_value = None
    
    with patch('service.debate_topics.get_random_topic', return_value=42):
        with pytest.raises(Missing):
            read_topic(5, mock_db)


@patch('os.getenv')
def test_generate_argument(mock_getenv):
    mock_getenv.return_value = "fake_api_key"
    
    mock_openai = MagicMock()
    mock_openai.chat.completions.create.return_value.choices = [
        MagicMock(message=MagicMock(content="Contraargumento de prueba"))
    ]
    
    with patch.dict('sys.modules', {'openai': mock_openai}):
        result = generate_argument(
            "¿Deberían legalizarse las drogas?",
            "Creo que sí porque...",
            1,
            "Debate previo..."
        )
        
        assert result == "Contraargumento de prueba"
    
    mock_openai.chat.completions.create.side_effect = Exception("Error de API")
    
    mock_groq_client = MagicMock()
    mock_groq_client.chat.completions.create.return_value.choices = [
        MagicMock(message=MagicMock(content="Contraargumento de Groq"))
    ]
    mock_groq = MagicMock(return_value=mock_groq_client)
    
    with patch.dict('sys.modules', {'openai': mock_openai}):
        with patch('service.debate_topics.Groq', mock_groq):
            result = generate_argument(
                "¿Deberían legalizarse las drogas?",
                "Creo que sí porque...",
                1,
                "Debate previo..."
            )
            
            assert result == "Contraargumento de Groq"


@patch('os.getenv')
def test_summary_generator(mock_getenv):
    mock_getenv.return_value = "fake_api_key"
    
    mock_openai = MagicMock()
    mock_openai.chat.completions.create.return_value.choices = [
        MagicMock(message=MagicMock(content="Resumen de prueba"))
    ]
    
    with patch.dict('sys.modules', {'openai': mock_openai}):
        result = summary_generator("Texto del debate completo...")
        
        assert result == "Resumen de prueba"
    
    mock_openai.chat.completions.create.side_effect = Exception("Error de API")
    
    mock_groq_client = MagicMock()
    mock_groq_client.chat.completions.create.return_value.choices = [
        MagicMock(message=MagicMock(content="Resumen de Groq"))
    ]
    mock_groq = MagicMock(return_value=mock_groq_client)
    
    with patch.dict('sys.modules', {'openai': mock_openai}):
        with patch('service.debate_topics.Groq', mock_groq):
            result = summary_generator("Texto del debate completo...")
            
            assert result == "Resumen de Groq"


def test_save_report():
    mock_db = MagicMock()
    
    report = DebateReportRequest(
        email="usuario@ejemplo.com",
        debate_topic="Tema de prueba",
        debate_text="Texto del debate",
        summary="Resumen del debate",
        score=8
    )
    
    result = save_report(report, mock_db)
    
    mock_db.add.assert_called_once_with(report)
    mock_db.commit.assert_called_once()
    mock_db.refresh.assert_called_once_with(report)
    
    assert result == report


def test_get_user_reports():
    mock_db = MagicMock()
    
    mock_reports = [
        DebateReportRequest(email="usuario@ejemplo.com", debate_topic="Tema 1"),
        DebateReportRequest(email="usuario@ejemplo.com", debate_topic="Tema 2")
    ]
    
    mock_results = MagicMock()
    mock_results.all.return_value = mock_reports
    mock_db.exec.return_value = mock_results
    
    result = get_user_reports("usuario@ejemplo.com", mock_db)
    
    mock_db.exec.assert_called_once()
    
    assert result == mock_reports 