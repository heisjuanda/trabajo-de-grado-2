# Casos de Prueba Detallados - Aplicación de Habilidades Blandas

## Descripción General
Este documento contiene la especificación completa de casos de prueba para la aplicación de habilidades blandas, incluyendo pruebas End-to-End (E2E), unitarias de frontend y backend, y criterios de aceptación para cada funcionalidad.

## Estructura de Testing

### Niveles de Prueba
1. **Pruebas Unitarias Frontend** - Jest + React Testing Library
2. **Pruebas Unitarias Backend** - pytest + FastAPI TestClient
3. **Pruebas End-to-End** - Cypress
4. **Pruebas de Integración** - API + Base de Datos
5. **Pruebas de Accesibilidad** - axe-core + Lighthouse

## 1. Casos de Prueba End-to-End (E2E)

### CP-E2E-001: Flujo Completo de Usuario
**Objetivo**: Verificar el flujo completo desde login hasta completar una actividad

**Precondiciones**:
- Usuario registrado en el sistema
- Base de datos con cursos de prueba
- Servicios de IA configurados

**Pasos de Ejecución**:
1. Navegar a la URL de la aplicación
2. Hacer login con credenciales válidas
3. Verificar que aparece el dashboard
4. Seleccionar curso de Oratoria (ID: 253)
5. Acceder a actividad de práctica
6. Completar flujo de grabación
7. Verificar feedback generado
8. Navegar a reportes
9. Verificar que se guardó la sesión

**Criterios de Aceptación**:
- ✅ Dashboard carga con cursos disponibles
- ✅ Navegación entre secciones funciona
- ✅ Grabación de audio se procesa correctamente
- ✅ Feedback de IA se genera en < 30 segundos
- ✅ Reporte se guarda en base de datos
- ✅ Historial muestra la nueva sesión

**Datos de Prueba**:
```javascript
const testUser = {
  email: "test@example.com",
  password: "TestPassword123"
}

const expectedCourses = [
  { id: 253, title: "Oratoria" },
  { id: 270, title: "Pensamiento Crítico" }
]
```

**Resultado Esperado**: Usuario completa exitosamente una sesión de práctica

---

### CP-E2E-002: Flujo de Pensamiento Crítico
**Objetivo**: Verificar el módulo de debate con IA completo

**Precondiciones**:
- Usuario autenticado
- Temas de debate disponibles en BD
- APIs de OpenAI/Groq funcionando

**Pasos de Ejecución**:
1. Acceder al curso de Pensamiento Crítico
2. Seleccionar actividad "Debate IA"
3. Elegir tema de debate
4. Escribir argumento inicial (mín. 10 caracteres)
5. Esperar respuesta de IA
6. Continuar debate por 5 rondas
7. Finalizar debate
8. Verificar feedback estructurado
9. Guardar reporte

**Criterios de Aceptación**:
- ✅ Tema se carga aleatoriamente
- ✅ Validación de entrada funciona (mín. 10 chars)
- ✅ Contador de rondas se actualiza
- ✅ Estrategia de IA cambia por ronda
- ✅ Feedback final incluye calificación 0-10
- ✅ Reporte se guarda con historial completo

**Datos de Prueba**:
```javascript
const debateArguments = [
  "La inteligencia artificial mejora la educación porque personaliza el aprendizaje",
  "Los datos muestran que los estudiantes aprenden mejor con IA adaptativa",
  "Sin embargo, la interacción humana sigue siendo fundamental",
  "La combinación de IA y profesores es la solución óptima",
  "En conclusión, la IA es una herramienta, no un reemplazo"
]
```

**Resultado Esperado**: Debate completo con feedback detallado guardado

---

### CP-E2E-003: Flujo de Oratoria con Grabación
**Objetivo**: Verificar el módulo de análisis de voz completo

**Precondiciones**:
- Permisos de micrófono otorgados
- Speech Recognition API disponible
- Usuario autenticado

**Pasos de Ejecución**:
1. Acceder al curso de Oratoria
2. Seleccionar dificultad (1-5)
3. Leer tema generado por IA
4. Iniciar grabación
5. Hablar por 30-60 segundos
6. Detener grabación
7. Verificar transcripción
8. Esperar análisis de IA
9. Revisar feedback detallado
10. Guardar audio en historial

**Criterios de Aceptación**:
- ✅ Tema se genera según dificultad seleccionada
- ✅ Permisos de micrófono se solicitan correctamente
- ✅ Grabación funciona sin errores
- ✅ Transcripción en tiempo real es visible
- ✅ Análisis de IA evalúa fluidez, coherencia, estructura
- ✅ Calificación numérica se asigna
- ✅ Audio se guarda como BLOB en BD

**Datos de Prueba**:
```javascript
const oratoryLevels = [1, 2, 3, 4, 5]
const expectedAnalysis = {
  fluency: "score_0_to_10",
  coherence: "score_0_to_10", 
  structure: "score_0_to_10",
  language: "score_0_to_10"
}
```

**Resultado Esperado**: Grabación analizada con feedback específico

---

### CP-E2E-004: Navegación y Responsividad
**Objetivo**: Verificar navegación entre secciones y diseño responsivo

**Precondiciones**:
- Aplicación desplegada
- Diferentes tamaños de pantalla disponibles

**Pasos de Ejecución**:
1. Probar en desktop (1920x1080)
2. Probar en tablet (768x1024)
3. Probar en móvil (375x667)
4. Navegar entre todas las secciones
5. Verificar menús y botones
6. Probar scroll y interacciones

**Criterios de Aceptación**:
- ✅ Layout se adapta a diferentes pantallas
- ✅ Menú hamburguesa funciona en móvil
- ✅ Botones son accesibles en touch
- ✅ Texto es legible en todas las resoluciones
- ✅ Imágenes se escalan correctamente
- ✅ No hay overflow horizontal

**Resultado Esperado**: Interfaz funcional en todos los dispositivos

---

## 2. Casos de Prueba Unitarios Frontend

### CP-FE-001: Componente Dashboard
**Archivo**: `src/components/Dashboard.test.js`

**Objetivo**: Verificar renderizado y funcionalidad del dashboard

**Casos de Prueba**:

#### CP-FE-001-A: Renderizado Inicial
```javascript
test('should render dashboard with course cards', () => {
  render(<Dashboard />)
  
  expect(screen.getByText('Cursos Disponibles')).toBeInTheDocument()
  expect(screen.getByText('Oratoria')).toBeInTheDocument()
  expect(screen.getByText('Pensamiento Crítico')).toBeInTheDocument()
})
```

#### CP-FE-001-B: Filtrado de Cursos
```javascript
test('should filter courses by search term', () => {
  render(<Dashboard />)
  
  const searchInput = screen.getByPlaceholderText('Buscar cursos...')
  fireEvent.change(searchInput, { target: { value: 'Oratoria' } })
  
  expect(screen.getByText('Oratoria')).toBeInTheDocument()
  expect(screen.queryByText('Pensamiento Crítico')).not.toBeInTheDocument()
})
```

#### CP-FE-001-C: Navegación a Curso
```javascript
test('should navigate to course on button click', () => {
  const mockNavigate = jest.fn()
  useNavigate.mockReturnValue(mockNavigate)
  
  render(<Dashboard />)
  
  const viewButton = screen.getByText('Ver más')
  fireEvent.click(viewButton)
  
  expect(mockNavigate).toHaveBeenCalledWith('/course/253')
})
```

**Criterios de Aceptación**:
- ✅ Componente renderiza sin errores
- ✅ Cursos se muestran correctamente
- ✅ Filtrado funciona en tiempo real
- ✅ Navegación se ejecuta correctamente

---

### CP-FE-002: Componente Chat (Pensamiento Crítico)
**Archivo**: `src/components/Chat.test.js`

**Objetivo**: Verificar funcionalidad del chat de debate

#### CP-FE-002-A: Envío de Mensaje
```javascript
test('should send message when form is submitted', async () => {
  const mockSendMessage = jest.fn()
  render(<Chat onSendMessage={mockSendMessage} />)
  
  const textarea = screen.getByPlaceholderText('Escribe tu argumento...')
  const sendButton = screen.getByText('Enviar')
  
  fireEvent.change(textarea, { target: { value: 'Mi argumento de prueba' } })
  fireEvent.click(sendButton)
  
  expect(mockSendMessage).toHaveBeenCalledWith('Mi argumento de prueba')
})
```

#### CP-FE-002-B: Validación de Entrada
```javascript
test('should show error for short messages', () => {
  render(<Chat />)
  
  const textarea = screen.getByPlaceholderText('Escribe tu argumento...')
  const sendButton = screen.getByText('Enviar')
  
  fireEvent.change(textarea, { target: { value: 'Corto' } })
  fireEvent.click(sendButton)
  
  expect(screen.getByText('Mínimo 10 caracteres')).toBeInTheDocument()
})
```

#### CP-FE-002-C: Historial de Mensajes
```javascript
test('should display message history', () => {
  const messages = [
    { role: 'user', content: 'Mi argumento' },
    { role: 'assistant', content: 'Respuesta de IA' }
  ]
  
  render(<Chat messages={messages} />)
  
  expect(screen.getByText('Mi argumento')).toBeInTheDocument()
  expect(screen.getByText('Respuesta de IA')).toBeInTheDocument()
})
```

**Criterios de Aceptación**:
- ✅ Mensajes se envían correctamente
- ✅ Validación previene mensajes cortos
- ✅ Historial se muestra ordenadamente
- ✅ Estados de carga son visibles

---

### CP-FE-003: Componente AudioRecorder (Oratoria)
**Archivo**: `src/components/AudioRecorder.test.js`

**Objetivo**: Verificar funcionalidad de grabación de audio

#### CP-FE-003-A: Inicio de Grabación
```javascript
test('should start recording when button is clicked', () => {
  const mockStartRecording = jest.fn()
  render(<AudioRecorder onStartRecording={mockStartRecording} />)
  
  const recordButton = screen.getByText('Iniciar Grabación')
  fireEvent.click(recordButton)
  
  expect(mockStartRecording).toHaveBeenCalled()
  expect(screen.getByText('Grabando...')).toBeInTheDocument()
})
```

#### CP-FE-003-B: Detener Grabación
```javascript
test('should stop recording and process audio', async () => {
  const mockStopRecording = jest.fn()
  render(<AudioRecorder onStopRecording={mockStopRecording} isRecording={true} />)
  
  const stopButton = screen.getByText('Detener')
  fireEvent.click(stopButton)
  
  expect(mockStopRecording).toHaveBeenCalled()
})
```

#### CP-FE-003-C: Manejo de Errores
```javascript
test('should handle microphone permission errors', () => {
  const mockError = new Error('Microphone access denied')
  render(<AudioRecorder error={mockError} />)
  
  expect(screen.getByText('Error: Permisos de micrófono requeridos')).toBeInTheDocument()
})
```

**Criterios de Aceptación**:
- ✅ Grabación inicia/detiene correctamente
- ✅ Estados visuales se actualizan
- ✅ Errores se manejan apropiadamente
- ✅ Audio se procesa sin fallos

---

## 3. Casos de Prueba Unitarios Backend

### CP-BE-001: Servicio de Debate
**Archivo**: `tests/test_debate_service.py`

**Objetivo**: Verificar lógica de negocio del módulo de pensamiento crítico

#### CP-BE-001-A: Generación de Argumento
```python
def test_generate_argument_success():
    # Arrange
    context = "La IA en educación"
    user_response = "La IA mejora el aprendizaje personalizado"
    round_number = 1
    
    # Act
    result = generate_argument(context, user_response, round_number)
    
    # Assert
    assert result is not None
    assert len(result) > 30
    assert len(result) <= 45  # Límite de palabras
    assert "IA" in result or "inteligencia artificial" in result.lower()
```

#### CP-BE-001-B: Estrategia por Ronda
```python
def test_ai_strategy_by_round():
    # Test rondas 1-3: Exploración
    result_round_1 = generate_argument("Tema", "Argumento", 1)
    assert "perspectiva" in result_round_1.lower() or "considera" in result_round_1.lower()
    
    # Test rondas 4-6: Profundización
    result_round_5 = generate_argument("Tema", "Argumento", 5)
    assert "evidencia" in result_round_5.lower() or "datos" in result_round_5.lower()
    
    # Test rondas 9-10: Conclusión
    result_round_10 = generate_argument("Tema", "Argumento", 10)
    assert "conclusión" in result_round_10.lower() or "reflexión" in result_round_10.lower()
```

#### CP-BE-001-C: Generación de Feedback
```python
def test_summary_generator():
    # Arrange
    debate_history = [
        {"role": "user", "content": "Argumento inicial"},
        {"role": "assistant", "content": "Contraargumento"},
        {"role": "user", "content": "Refutación"}
    ]
    
    # Act
    feedback = summary_generator(debate_history)
    
    # Assert
    assert "aspectos_positivos" in feedback
    assert "areas_mejora" in feedback
    assert "calificacion" in feedback
    assert 0 <= feedback["calificacion"] <= 10
```

**Criterios de Aceptación**:
- ✅ Argumentos se generan según estrategia de ronda
- ✅ Longitud de respuesta está controlada
- ✅ Feedback incluye estructura requerida
- ✅ Calificación está en rango válido

---

### CP-BE-002: Servicio de Oratoria
**Archivo**: `tests/test_oratory_service.py`

**Objetivo**: Verificar análisis de discursos y generación de temas

#### CP-BE-002-A: Generación de Tema por Dificultad
```python
def test_generate_oratory_topic_by_difficulty():
    # Test nivel principiante
    topic_easy = generate_oratory_topic(difficulty=1)
    assert topic_easy is not None
    assert len(topic_easy) > 20
    
    # Test nivel avanzado
    topic_hard = generate_oratory_topic(difficulty=5)
    assert topic_hard is not None
    assert len(topic_hard) > 20
    
    # Los temas avanzados deberían ser más complejos
    assert topic_hard != topic_easy
```

#### CP-BE-002-B: Análisis de Entrada de Oratoria
```python
def test_analyze_oratory_input():
    # Arrange
    speech_text = """
    Buenos días a todos. Hoy quiero hablarles sobre la importancia de la comunicación efectiva.
    La comunicación es fundamental en nuestras vidas porque nos permite conectar con otros.
    En primer lugar, mejora nuestras relaciones personales.
    En segundo lugar, nos ayuda en el ámbito profesional.
    En conclusión, debemos desarrollar estas habilidades constantemente.
    """
    
    # Act
    analysis = analyze_oratory_input(speech_text)
    
    # Assert
    assert "fluidez" in analysis
    assert "coherencia" in analysis
    assert "estructura" in analysis
    assert "calificacion" in analysis
    assert 0 <= analysis["calificacion"] <= 10
    assert len(analysis["feedback"]) > 50
```

#### CP-BE-002-C: Validación de Entrada
```python
def test_analyze_empty_input():
    # Act & Assert
    with pytest.raises(ValueError, match="Texto no puede estar vacío"):
        analyze_oratory_input("")
        
def test_analyze_short_input():
    # Act
    result = analyze_oratory_input("Texto muy corto")
    
    # Assert
    assert result["calificacion"] < 5  # Calificación baja por texto corto
    assert "muy breve" in result["feedback"].lower()
```

**Criterios de Aceptación**:
- ✅ Temas se generan según dificultad
- ✅ Análisis incluye todas las métricas
- ✅ Validaciones funcionan correctamente
- ✅ Feedback es constructivo y específico

---

### CP-BE-003: Endpoints de API
**Archivo**: `tests/test_api_endpoints.py`

**Objetivo**: Verificar funcionamiento de endpoints REST

#### CP-BE-003-A: Endpoint de Procesamiento de Ronda
```python
def test_process_round_endpoint(client):
    # Arrange
    payload = {
        "topic_id": 1,
        "user_response": "Mi argumento de prueba para el debate",
        "round_number": 1,
        "chat_history": []
    }
    
    # Act
    response = client.post("/debate-topics/process-round", json=payload)
    
    # Assert
    assert response.status_code == 200
    data = response.json()
    assert "ai_response" in data
    assert len(data["ai_response"]) > 10
    assert data["round_number"] == 1
```

#### CP-BE-003-B: Endpoint de Análisis de Oratoria
```python
def test_analyze_oratory_endpoint(client):
    # Arrange
    payload = {
        "text": "Discurso de prueba para análisis de oratoria",
        "user_email": "test@example.com"
    }
    
    # Act
    response = client.post("/oratory-topics/analyze", json=payload)
    
    # Assert
    assert response.status_code == 200
    data = response.json()
    assert "analysis" in data
    assert "calificacion" in data["analysis"]
    assert "feedback" in data["analysis"]
```

#### CP-BE-003-C: Manejo de Errores
```python
def test_invalid_topic_id(client):
    # Arrange
    payload = {
        "topic_id": 999,  # ID inexistente
        "user_response": "Argumento",
        "round_number": 1,
        "chat_history": []
    }
    
    # Act
    response = client.post("/debate-topics/process-round", json=payload)
    
    # Assert
    assert response.status_code == 404
    assert "Topic not found" in response.json()["detail"]
```

**Criterios de Aceptación**:
- ✅ Endpoints responden con códigos HTTP correctos
- ✅ Payloads se validan apropiadamente
- ✅ Respuestas incluyen datos esperados
- ✅ Errores se manejan consistentemente

---

## 4. Casos de Prueba de Integración

### CP-INT-001: Integración Frontend-Backend
**Objetivo**: Verificar comunicación entre capas

#### CP-INT-001-A: Flujo Completo de Debate
```javascript
describe('Debate Integration', () => {
  test('should complete full debate flow', async () => {
    // 1. Frontend solicita tema
    const topicResponse = await api.get('/debate-topics/1')
    expect(topicResponse.status).toBe(200)
    
    // 2. Usuario envía argumento
    const roundResponse = await api.post('/debate-topics/process-round', {
      topic_id: 1,
      user_response: 'Mi argumento inicial',
      round_number: 1,
      chat_history: []
    })
    expect(roundResponse.status).toBe(200)
    expect(roundResponse.data.ai_response).toBeDefined()
    
    // 3. Generar feedback final
    const feedbackResponse = await api.post('/debate-topics/give-feedback', {
      debate_text: 'Historial completo del debate'
    })
    expect(feedbackResponse.status).toBe(200)
    expect(feedbackResponse.data.feedback).toBeDefined()
  })
})
```

#### CP-INT-001-B: Integración con Base de Datos
```python
def test_database_integration():
    # Crear usuario de prueba
    user = create_test_user("test@example.com")
    
    # Guardar reporte de debate
    report_data = {
        "email": user.email,
        "topic": "IA en educación",
        "chat": "Historial del chat",
        "feedback": "Feedback generado"
    }
    
    saved_report = save_report(report_data)
    assert saved_report.id is not None
    
    # Verificar que se puede recuperar
    retrieved_reports = get_user_reports(user.email)
    assert len(retrieved_reports) == 1
    assert retrieved_reports[0].topic == "IA en educación"
```

**Criterios de Aceptación**:
- ✅ APIs responden correctamente
- ✅ Datos se persisten en BD
- ✅ Estados se sincronizan entre capas
- ✅ Errores se propagan apropiadamente

---

## 5. Casos de Prueba de Accesibilidad

### CP-ACC-001: Cumplimiento WCAG 2.1
**Objetivo**: Verificar estándares de accesibilidad

#### CP-ACC-001-A: Navegación por Teclado
```javascript
test('should be navigable with keyboard only', () => {
  render(<Dashboard />)
  
  // Tab a través de elementos interactivos
  const firstButton = screen.getAllByRole('button')[0]
  firstButton.focus()
  
  // Verificar que el foco es visible
  expect(firstButton).toHaveFocus()
  
  // Simular Tab para navegar
  fireEvent.keyDown(firstButton, { key: 'Tab' })
  
  const nextElement = screen.getAllByRole('button')[1]
  expect(nextElement).toHaveFocus()
})
```

#### CP-ACC-001-B: Etiquetas ARIA
```javascript
test('should have proper ARIA labels', () => {
  render(<AudioRecorder />)
  
  const recordButton = screen.getByRole('button', { name: /iniciar grabación/i })
  expect(recordButton).toHaveAttribute('aria-label')
  
  const statusRegion = screen.getByRole('status')
  expect(statusRegion).toBeInTheDocument()
})
```

#### CP-ACC-001-C: Contraste de Colores
```javascript
test('should meet color contrast requirements', async () => {
  render(<App />)
  
  const results = await axe(container)
  expect(results).toHaveNoViolations()
  
  // Verificar contraste específico
  const primaryButtons = screen.getAllByRole('button')
  primaryButtons.forEach(button => {
    const styles = getComputedStyle(button)
    // Verificar que el contraste cumple AA (4.5:1)
    expect(getContrastRatio(styles.color, styles.backgroundColor)).toBeGreaterThan(4.5)
  })
})
```

**Criterios de Aceptación**:
- ✅ Navegación completa por teclado
- ✅ Etiquetas ARIA apropiadas
- ✅ Contraste mínimo 4.5:1 (AA)
- ✅ Compatible con lectores de pantalla

---

## 6. Métricas de Calidad y Cobertura

### Cobertura de Código
```bash
# Frontend (Jest)
npm run test:coverage
# Target: >80% cobertura

# Backend (pytest)
pytest --cov=src --cov-report=html
# Target: >85% cobertura
```

### Métricas de Performance
```javascript
// Lighthouse CI
const lighthouseConfig = {
  performance: '>= 90',
  accessibility: '>= 95',
  'best-practices': '>= 90',
  seo: '>= 80'
}
```

### Criterios de Aceptación Global
- ✅ **Cobertura Frontend**: >80%
- ✅ **Cobertura Backend**: >85%
- ✅ **Performance Score**: >90
- ✅ **Accessibility Score**: >95
- ✅ **Tiempo de Respuesta API**: <2s
- ✅ **Tiempo de Carga Inicial**: <3s
- ✅ **Tasa de Éxito E2E**: >95%

## 7. Automatización y CI/CD

### Pipeline de Testing
```yaml
# .github/workflows/test.yml
name: Test Suite
on: [push, pull_request]

jobs:
  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Frontend Tests
        run: |
          npm install
          npm run test:coverage
          npm run test:e2e
          
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Backend Tests
        run: |
          pip install -r requirements.txt
          pytest --cov=src
          
  accessibility-tests:
    runs-on: ubuntu-latest
    steps:
      - name: Run Lighthouse CI
        run: lhci autorun
```

### Reportes Automáticos
- **Coverage Reports**: Codecov integration
- **Test Results**: GitHub Actions summary
- **Performance**: Lighthouse CI reports
- **Accessibility**: axe-core automated scans

## 8. Mantenimiento de Casos de Prueba

### Actualización de Tests
1. **Nuevas Funcionalidades**: Crear tests antes del desarrollo (TDD)
2. **Bug Fixes**: Agregar test de regresión
3. **Refactoring**: Mantener tests actualizados
4. **Performance**: Monitorear tiempos de ejecución

### Documentación de Fallos
```markdown
## Reporte de Bug
- **ID**: BUG-001
- **Descripción**: Chat no valida mensajes cortos
- **Test Afectado**: CP-FE-002-B
- **Solución**: Agregar validación en frontend
- **Test de Regresión**: Creado
```

Este documento proporciona una base sólida para el **Anexo G** de tu tesis, cubriendo todos los aspectos de testing de tu aplicación de habilidades blandas. 