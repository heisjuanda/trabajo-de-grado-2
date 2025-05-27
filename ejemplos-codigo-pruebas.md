# Ejemplos de Código de Pruebas - Aplicación de Habilidades Blandas

## Descripción General
Este documento contiene ejemplos específicos de código de pruebas que puedes implementar en tu aplicación, basados en los casos de prueba detallados del Anexo G.

## 1. Pruebas End-to-End con Cypress

### Archivo: `cypress/e2e/flujo-completo-usuario.cy.js`
```javascript
describe('Flujo Completo de Usuario', () => {
  beforeEach(() => {
    // Configurar datos de prueba
    cy.task('db:seed')
    cy.visit('/')
  })

  it('CP-E2E-001: Debe completar flujo desde login hasta reporte', () => {
    // Login
    cy.get('[data-testid="login-email"]').type('test@example.com')
    cy.get('[data-testid="login-password"]').type('TestPassword123')
    cy.get('[data-testid="login-submit"]').click()

    // Verificar dashboard
    cy.get('[data-testid="dashboard"]').should('be.visible')
    cy.get('[data-testid="course-card-253"]').should('contain', 'Oratoria')
    cy.get('[data-testid="course-card-270"]').should('contain', 'Pensamiento Crítico')

    // Seleccionar curso de Oratoria
    cy.get('[data-testid="course-card-253"]').click()
    cy.url().should('include', '/course/253')

    // Acceder a actividad de práctica
    cy.get('[data-testid="activity-oratory"]').click()
    
    // Seleccionar dificultad
    cy.get('[data-testid="difficulty-3"]').click()
    
    // Esperar tema generado
    cy.get('[data-testid="generated-topic"]').should('be.visible')
    
    // Simular grabación (mock)
    cy.window().then((win) => {
      win.navigator.mediaDevices = {
        getUserMedia: cy.stub().resolves({
          getTracks: () => [{ stop: cy.stub() }]
        })
      }
    })
    
    // Iniciar grabación
    cy.get('[data-testid="start-recording"]').click()
    cy.get('[data-testid="recording-status"]').should('contain', 'Grabando...')
    
    // Simular transcripción
    cy.wait(2000)
    cy.get('[data-testid="stop-recording"]').click()
    
    // Verificar análisis
    cy.get('[data-testid="analysis-loading"]').should('be.visible')
    cy.get('[data-testid="analysis-result"]', { timeout: 30000 }).should('be.visible')
    cy.get('[data-testid="score"]').should('exist')
    
    // Guardar reporte
    cy.get('[data-testid="save-report"]').click()
    cy.get('[data-testid="success-message"]').should('contain', 'Reporte guardado')
    
    // Verificar en historial
    cy.get('[data-testid="view-reports"]').click()
    cy.get('[data-testid="report-list"]').should('contain', 'Oratoria')
  })
})
```

### Archivo: `cypress/e2e/pensamiento-critico.cy.js`
```javascript
describe('Módulo de Pensamiento Crítico', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'TestPassword123')
    cy.visit('/course/270')
  })

  it('CP-E2E-002: Debe completar debate con IA', () => {
    // Acceder al módulo de debate
    cy.get('[data-testid="debate-activity"]').click()
    
    // Seleccionar tema
    cy.get('[data-testid="topic-selector"]').click()
    cy.get('[data-testid="topic-1"]').click()
    
    // Verificar contexto del tema
    cy.get('[data-testid="topic-context"]').should('be.visible')
    
    // Iniciar debate
    cy.get('[data-testid="start-debate"]').click()
    
    // Ronda 1
    cy.get('[data-testid="round-counter"]').should('contain', '1/10')
    cy.get('[data-testid="user-input"]').type('La inteligencia artificial mejora la educación porque personaliza el aprendizaje según las necesidades individuales de cada estudiante.')
    cy.get('[data-testid="send-argument"]').click()
    
    // Esperar respuesta de IA
    cy.get('[data-testid="ai-loading"]').should('be.visible')
    cy.get('[data-testid="ai-response"]', { timeout: 15000 }).should('be.visible')
    
    // Continuar por varias rondas
    for (let round = 2; round <= 5; round++) {
      cy.get('[data-testid="round-counter"]').should('contain', `${round}/10`)
      cy.get('[data-testid="user-input"]').type(`Argumento para la ronda ${round}. Continuando el debate con nuevos puntos de vista.`)
      cy.get('[data-testid="send-argument"]').click()
      cy.get('[data-testid="ai-response"]', { timeout: 15000 }).should('be.visible')
    }
    
    // Finalizar debate
    cy.get('[data-testid="end-debate"]').click()
    
    // Verificar feedback
    cy.get('[data-testid="feedback-loading"]').should('be.visible')
    cy.get('[data-testid="feedback-result"]', { timeout: 30000 }).should('be.visible')
    cy.get('[data-testid="final-score"]').should('exist')
    cy.get('[data-testid="positive-aspects"]').should('be.visible')
    cy.get('[data-testid="improvement-areas"]').should('be.visible')
    
    // Guardar reporte
    cy.get('[data-testid="save-debate-report"]').click()
    cy.get('[data-testid="report-saved"]').should('be.visible')
  })
})
```

## 2. Pruebas Unitarias Frontend con Jest

### Archivo: `src/components/__tests__/Dashboard.test.js`
```javascript
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import Dashboard from '../Dashboard'
import theme from '../../theme'

// Mock de react-router-dom
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}))

// Mock de servicios
jest.mock('../../services/courseService', () => ({
  getCourses: jest.fn(() => Promise.resolve([
    { id: 253, title: 'Oratoria', description: 'Desarrollo de habilidades de comunicación', instructor: 'Juan David Moreno Alfonso' },
    { id: 270, title: 'Pensamiento Crítico', description: 'Desarrollo de análisis y argumentación', instructor: 'Juan David Moreno Alfonso' }
  ]))
}))

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    </BrowserRouter>
  )
}

describe('Dashboard Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  test('CP-FE-001-A: Debe renderizar dashboard con tarjetas de curso', async () => {
    renderWithProviders(<Dashboard />)
    
    // Verificar título
    expect(screen.getByText('Cursos Disponibles')).toBeInTheDocument()
    
    // Esperar que los cursos se carguen
    await waitFor(() => {
      expect(screen.getByText('Oratoria')).toBeInTheDocument()
      expect(screen.getByText('Pensamiento Crítico')).toBeInTheDocument()
    })
    
    // Verificar información del instructor
    expect(screen.getAllByText('Juan David Moreno Alfonso')).toHaveLength(2)
  })

  test('CP-FE-001-B: Debe filtrar cursos por término de búsqueda', async () => {
    renderWithProviders(<Dashboard />)
    
    // Esperar que los cursos se carguen
    await waitFor(() => {
      expect(screen.getByText('Oratoria')).toBeInTheDocument()
    })
    
    // Buscar por "Oratoria"
    const searchInput = screen.getByPlaceholderText('Buscar cursos...')
    fireEvent.change(searchInput, { target: { value: 'Oratoria' } })
    
    // Verificar filtrado
    expect(screen.getByText('Oratoria')).toBeInTheDocument()
    expect(screen.queryByText('Pensamiento Crítico')).not.toBeInTheDocument()
    
    // Limpiar búsqueda
    fireEvent.change(searchInput, { target: { value: '' } })
    
    // Verificar que ambos cursos aparecen
    await waitFor(() => {
      expect(screen.getByText('Oratoria')).toBeInTheDocument()
      expect(screen.getByText('Pensamiento Crítico')).toBeInTheDocument()
    })
  })

  test('CP-FE-001-C: Debe navegar a curso al hacer clic en "Ver más"', async () => {
    renderWithProviders(<Dashboard />)
    
    // Esperar que los cursos se carguen
    await waitFor(() => {
      expect(screen.getByText('Oratoria')).toBeInTheDocument()
    })
    
    // Hacer clic en el primer botón "Ver más"
    const viewButtons = screen.getAllByText('Ver más')
    fireEvent.click(viewButtons[0])
    
    // Verificar navegación
    expect(mockNavigate).toHaveBeenCalledWith('/course/253')
  })
})
```

### Archivo: `src/components/__tests__/Chat.test.js`
```javascript
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import Chat from '../Chat'
import theme from '../../theme'

const renderWithTheme = (component) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('Chat Component', () => {
  const mockSendMessage = jest.fn()
  const mockMessages = [
    { role: 'user', content: 'Mi primer argumento sobre IA en educación' },
    { role: 'assistant', content: 'Interesante perspectiva. Sin embargo, considera que...' }
  ]

  beforeEach(() => {
    mockSendMessage.mockClear()
  })

  test('CP-FE-002-A: Debe enviar mensaje cuando se envía el formulario', () => {
    renderWithTheme(<Chat onSendMessage={mockSendMessage} />)
    
    const textarea = screen.getByPlaceholderText('Escribe tu argumento...')
    const sendButton = screen.getByText('Enviar')
    
    // Escribir mensaje
    fireEvent.change(textarea, { target: { value: 'Mi argumento de prueba para el debate' } })
    
    // Enviar mensaje
    fireEvent.click(sendButton)
    
    // Verificar que se llamó la función
    expect(mockSendMessage).toHaveBeenCalledWith('Mi argumento de prueba para el debate')
    
    // Verificar que el textarea se limpió
    expect(textarea.value).toBe('')
  })

  test('CP-FE-002-B: Debe mostrar error para mensajes cortos', () => {
    renderWithTheme(<Chat onSendMessage={mockSendMessage} />)
    
    const textarea = screen.getByPlaceholderText('Escribe tu argumento...')
    const sendButton = screen.getByText('Enviar')
    
    // Escribir mensaje corto
    fireEvent.change(textarea, { target: { value: 'Corto' } })
    fireEvent.click(sendButton)
    
    // Verificar error
    expect(screen.getByText('Mínimo 10 caracteres')).toBeInTheDocument()
    
    // Verificar que no se envió el mensaje
    expect(mockSendMessage).not.toHaveBeenCalled()
  })

  test('CP-FE-002-C: Debe mostrar historial de mensajes', () => {
    renderWithTheme(<Chat messages={mockMessages} onSendMessage={mockSendMessage} />)
    
    // Verificar que los mensajes se muestran
    expect(screen.getByText('Mi primer argumento sobre IA en educación')).toBeInTheDocument()
    expect(screen.getByText('Interesante perspectiva. Sin embargo, considera que...')).toBeInTheDocument()
    
    // Verificar roles
    expect(screen.getByTestId('message-user-0')).toBeInTheDocument()
    expect(screen.getByTestId('message-assistant-1')).toBeInTheDocument()
  })

  test('CP-FE-002-D: Debe mostrar indicador de carga cuando IA está respondiendo', () => {
    renderWithTheme(<Chat isLoading={true} onSendMessage={mockSendMessage} />)
    
    // Verificar indicador de carga
    expect(screen.getByTestId('ai-loading')).toBeInTheDocument()
    expect(screen.getByText('IA está escribiendo...')).toBeInTheDocument()
    
    // Verificar que el botón está deshabilitado
    const sendButton = screen.getByText('Enviar')
    expect(sendButton).toBeDisabled()
  })
})
```

## 3. Pruebas Unitarias Backend con pytest

### Archivo: `tests/test_debate_service.py`
```python
import pytest
from unittest.mock import patch, MagicMock
from src.service.debate_topics import generate_argument, summary_generator, save_report
from src.model.debate_topics import DebateReportRequest

class TestDebateService:
    
    def test_generate_argument_success(self):
        """CP-BE-001-A: Debe generar argumento exitosamente"""
        # Arrange
        context = "La inteligencia artificial en educación"
        user_response = "La IA mejora el aprendizaje personalizado"
        round_number = 1
        
        # Mock de OpenAI
        with patch('src.service.debate_topics.openai_client') as mock_openai:
            mock_response = MagicMock()
            mock_response.choices[0].message.content = "Excelente punto. Sin embargo, considera que la personalización excesiva puede limitar la exposición a ideas diversas."
            mock_openai.chat.completions.create.return_value = mock_response
            
            # Act
            result = generate_argument(context, user_response, round_number)
            
            # Assert
            assert result is not None
            assert len(result.split()) >= 5  # Mínimo 5 palabras
            assert len(result.split()) <= 45  # Máximo 45 palabras
            assert "considera" in result.lower() or "sin embargo" in result.lower()

    def test_ai_strategy_by_round(self):
        """CP-BE-001-B: Debe aplicar estrategia según la ronda"""
        with patch('src.service.debate_topics.openai_client') as mock_openai:
            # Mock respuestas diferentes por ronda
            mock_response = MagicMock()
            
            # Test ronda 1-3: Exploración
            mock_response.choices[0].message.content = "Considera esta perspectiva alternativa sobre el tema."
            mock_openai.chat.completions.create.return_value = mock_response
            
            result_round_1 = generate_argument("Tema", "Argumento", 1)
            assert "perspectiva" in result_round_1.lower() or "considera" in result_round_1.lower()
            
            # Test ronda 4-6: Profundización
            mock_response.choices[0].message.content = "Los datos y evidencias muestran que tu argumento necesita más soporte."
            result_round_5 = generate_argument("Tema", "Argumento", 5)
            assert "evidencia" in result_round_5.lower() or "datos" in result_round_5.lower()
            
            # Test ronda 9-10: Conclusión
            mock_response.choices[0].message.content = "En conclusión, ambas perspectivas tienen mérito y requieren reflexión."
            result_round_10 = generate_argument("Tema", "Argumento", 10)
            assert "conclusión" in result_round_10.lower() or "reflexión" in result_round_10.lower()

    def test_summary_generator(self):
        """CP-BE-001-C: Debe generar feedback estructurado"""
        # Arrange
        debate_history = [
            {"role": "user", "content": "La IA mejora la educación personalizando el aprendizaje"},
            {"role": "assistant", "content": "Punto válido, pero considera los riesgos de privacidad"},
            {"role": "user", "content": "Los beneficios superan los riesgos si se implementa correctamente"}
        ]
        
        with patch('src.service.debate_topics.openai_client') as mock_openai:
            mock_response = MagicMock()
            mock_response.choices[0].message.content = '''
            {
                "aspectos_positivos": ["Argumentos bien estructurados", "Uso de evidencia"],
                "areas_mejora": ["Considerar más contraargumentos", "Profundizar en ejemplos"],
                "sugerencias": ["Investigar más fuentes", "Practicar refutación"],
                "calificacion": 7
            }
            '''
            mock_openai.chat.completions.create.return_value = mock_response
            
            # Act
            feedback = summary_generator(debate_history)
            
            # Assert
            assert "aspectos_positivos" in feedback
            assert "areas_mejora" in feedback
            assert "calificacion" in feedback
            assert 0 <= feedback["calificacion"] <= 10
            assert isinstance(feedback["aspectos_positivos"], list)
            assert isinstance(feedback["areas_mejora"], list)

    def test_save_report_success(self):
        """CP-BE-001-D: Debe guardar reporte exitosamente"""
        # Arrange
        report_data = DebateReportRequest(
            email="test@example.com",
            topic="IA en educación",
            chat="Historial completo del debate",
            feedback="Feedback estructurado generado"
        )
        
        with patch('src.service.debate_topics.get_session') as mock_session:
            mock_db = MagicMock()
            mock_session.return_value.__enter__.return_value = mock_db
            
            # Act
            result = save_report(report_data)
            
            # Assert
            assert result["message"] == "Reporte guardado exitosamente"
            mock_db.add.assert_called_once()
            mock_db.commit.assert_called_once()

    def test_generate_argument_fallback_to_groq(self):
        """CP-BE-001-E: Debe usar Groq como fallback cuando OpenAI falla"""
        with patch('src.service.debate_topics.openai_client') as mock_openai, \
             patch('src.service.debate_topics.groq_client') as mock_groq:
            
            # OpenAI falla
            mock_openai.chat.completions.create.side_effect = Exception("OpenAI API Error")
            
            # Groq responde
            mock_response = MagicMock()
            mock_response.choices[0].message.content = "Respuesta de Groq como fallback"
            mock_groq.chat.completions.create.return_value = mock_response
            
            # Act
            result = generate_argument("Tema", "Argumento", 1)
            
            # Assert
            assert result == "Respuesta de Groq como fallback"
            mock_groq.chat.completions.create.assert_called_once()
```

### Archivo: `tests/test_oratory_service.py`
```python
import pytest
from unittest.mock import patch, MagicMock
from src.service.oratory_topics import generate_oratory_topic, analyze_oratory_input

class TestOratoryService:
    
    def test_generate_oratory_topic_by_difficulty(self):
        """CP-BE-002-A: Debe generar tema según dificultad"""
        with patch('src.service.oratory_topics.openai_client') as mock_openai:
            # Mock para nivel principiante
            mock_response = MagicMock()
            mock_response.choices[0].message.content = "Habla sobre tu comida favorita y por qué te gusta"
            mock_openai.chat.completions.create.return_value = mock_response
            
            topic_easy = generate_oratory_topic(difficulty=1)
            assert topic_easy is not None
            assert len(topic_easy) > 10
            assert "comida" in topic_easy.lower()
            
            # Mock para nivel avanzado
            mock_response.choices[0].message.content = "Analiza el impacto de la globalización en las economías emergentes del siglo XXI"
            topic_hard = generate_oratory_topic(difficulty=5)
            assert topic_hard is not None
            assert len(topic_hard) > 10
            assert "globalización" in topic_hard.lower()
            
            # Los temas deben ser diferentes
            assert topic_easy != topic_hard

    def test_analyze_oratory_input_complete(self):
        """CP-BE-002-B: Debe analizar entrada de oratoria completamente"""
        # Arrange
        speech_text = """
        Buenos días a todos. Hoy quiero hablarles sobre la importancia de la comunicación efectiva.
        La comunicación es fundamental en nuestras vidas porque nos permite conectar con otros.
        En primer lugar, mejora nuestras relaciones personales.
        En segundo lugar, nos ayuda en el ámbito profesional.
        En conclusión, debemos desarrollar estas habilidades constantemente.
        """
        
        with patch('src.service.oratory_topics.openai_client') as mock_openai:
            mock_response = MagicMock()
            mock_response.choices[0].message.content = '''
            {
                "fluidez": 8,
                "coherencia": 9,
                "estructura": 8,
                "uso_lenguaje": 7,
                "calificacion": 8,
                "feedback": "Excelente estructura con introducción, desarrollo y conclusión clara. La fluidez es buena y el tema se desarrolla coherentemente. Sugerencia: variar más el vocabulario."
            }
            '''
            mock_openai.chat.completions.create.return_value = mock_response
            
            # Act
            analysis = analyze_oratory_input(speech_text)
            
            # Assert
            assert "fluidez" in analysis
            assert "coherencia" in analysis
            assert "estructura" in analysis
            assert "calificacion" in analysis
            assert 0 <= analysis["calificacion"] <= 10
            assert len(analysis["feedback"]) > 20
            assert analysis["fluidez"] >= 0 and analysis["fluidez"] <= 10

    def test_analyze_empty_input_validation(self):
        """CP-BE-002-C: Debe validar entrada vacía"""
        with pytest.raises(ValueError, match="El texto no puede estar vacío"):
            analyze_oratory_input("")
            
    def test_analyze_short_input_low_score(self):
        """CP-BE-002-D: Debe dar calificación baja para texto corto"""
        with patch('src.service.oratory_topics.openai_client') as mock_openai:
            mock_response = MagicMock()
            mock_response.choices[0].message.content = '''
            {
                "fluidez": 3,
                "coherencia": 2,
                "estructura": 2,
                "uso_lenguaje": 3,
                "calificacion": 3,
                "feedback": "El discurso es muy breve. Se recomienda desarrollar más las ideas y estructurar mejor el contenido."
            }
            '''
            mock_openai.chat.completions.create.return_value = mock_response
            
            result = analyze_oratory_input("Texto muy corto")
            
            assert result["calificacion"] < 5
            assert "breve" in result["feedback"].lower()
```

## 4. Pruebas de Integración

### Archivo: `tests/test_integration.py`
```python
import pytest
from fastapi.testclient import TestClient
from src.main import app
from src.database import get_session
from sqlmodel import Session, create_engine, SQLModel
from sqlmodel.pool import StaticPool

# Base de datos en memoria para pruebas
@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session

@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()

class TestIntegration:
    
    def test_complete_debate_flow(self, client: TestClient):
        """CP-INT-001-A: Debe completar flujo completo de debate"""
        # 1. Obtener tema de debate
        response = client.get("/debate-topics/1")
        assert response.status_code == 200
        topic_data = response.json()
        assert "question" in topic_data
        
        # 2. Procesar primera ronda
        round_payload = {
            "topic_id": 1,
            "user_response": "La inteligencia artificial mejora la educación porque personaliza el aprendizaje",
            "round_number": 1,
            "chat_history": []
        }
        
        response = client.post("/debate-topics/process-round", json=round_payload)
        assert response.status_code == 200
        round_data = response.json()
        assert "ai_response" in round_data
        assert round_data["round_number"] == 1
        
        # 3. Generar feedback final
        feedback_payload = {
            "debate_text": "Usuario: La IA mejora la educación\nIA: Punto interesante, pero considera..."
        }
        
        response = client.post("/debate-topics/give-feedback", json=feedback_payload)
        assert response.status_code == 200
        feedback_data = response.json()
        assert "feedback" in feedback_data
        
        # 4. Guardar reporte
        report_payload = {
            "email": "test@example.com",
            "topic": "IA en educación",
            "chat": "Historial completo del debate",
            "feedback": "Feedback generado por IA"
        }
        
        response = client.post("/debate-topics/save-report", json=report_payload)
        assert response.status_code == 200
        
        # 5. Verificar reporte guardado
        response = client.get("/debate-topics/reports/test@example.com")
        assert response.status_code == 200
        reports = response.json()
        assert len(reports) == 1
        assert reports[0]["topic"] == "IA en educación"

    def test_oratory_analysis_flow(self, client: TestClient):
        """CP-INT-001-B: Debe completar flujo de análisis de oratoria"""
        # 1. Generar tema
        response = client.get("/oratory-topics/3")  # Dificultad 3
        assert response.status_code == 200
        topic_data = response.json()
        assert "topic" in topic_data
        
        # 2. Analizar discurso
        analysis_payload = {
            "text": "Buenos días. Hoy hablaré sobre la importancia de la comunicación efectiva en el ámbito profesional.",
            "user_email": "test@example.com"
        }
        
        response = client.post("/oratory-topics/analyze", json=analysis_payload)
        assert response.status_code == 200
        analysis_data = response.json()
        assert "analysis" in analysis_data
        assert "calificacion" in analysis_data["analysis"]
        assert 0 <= analysis_data["analysis"]["calificacion"] <= 10
```

## 5. Configuración de CI/CD

### Archivo: `.github/workflows/test.yml`
```yaml
name: Test Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  frontend-tests:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: 'Front/soft-skills-front/package-lock.json'
    
    - name: Install dependencies
      working-directory: Front/soft-skills-front
      run: npm ci
    
    - name: Run unit tests
      working-directory: Front/soft-skills-front
      run: npm run test:coverage
    
    - name: Run E2E tests
      working-directory: Front/soft-skills-front
      run: npm run test:e2e:headless
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: Front/soft-skills-front/coverage/lcov.info
        flags: frontend

  backend-tests:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'
    
    - name: Install dependencies
      working-directory: Back
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
    
    - name: Run tests with coverage
      working-directory: Back
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost/test_db
      run: |
        pytest --cov=src --cov-report=xml --cov-report=html
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: Back/coverage.xml
        flags: backend

  accessibility-tests:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install Lighthouse CI
      run: npm install -g @lhci/cli
    
    - name: Run Lighthouse CI
      working-directory: Front/soft-skills-front
      run: lhci autorun
```

Este conjunto de ejemplos de código te proporciona una base sólida para implementar todas las pruebas mencionadas en tu documentación de casos de prueba del **Anexo G**. 