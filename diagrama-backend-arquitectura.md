# Diagrama de Arquitectura Backend - Aplicación de Habilidades Blandas

## Descripción General
El backend está desarrollado con FastAPI siguiendo una arquitectura en capas que separa responsabilidades y facilita el mantenimiento. Utiliza el patrón Repository con SQLModel para la persistencia de datos.

## Estructura de Capas

### 1. Capa de Aplicación (main.py)
```
main.py (Aplicación Principal)
├── FastAPI App Instance
├── CORS Middleware
├── Lifespan Events
├── Router Registration
└── Uvicorn Server
```

### 2. Capa de Configuración (config.py)
```
Configuration Layer
├── Settings (BaseSettings)
│   ├── PROJECT_NAME: "Tesis backend"
│   ├── VERSION: "0.1"
│   ├── DESCRIPTION: "FastAPI + SQLModel API"
│   └── DATABASE_URI: PostgreSQL
├── Environment Variables
│   ├── DB_URI
│   ├── OPEN_API_CHAT_GPT
│   ├── GROG_API_LLAMA
│   └── BACK_PORT
└── Test Settings
```

### 3. Capa de Enrutamiento (web/)
```
Web Layer (Routers)
├── api.py (Router Principal)
├── user.py (/users)
│   ├── GET / (Todos los usuarios)
│   ├── GET /{id} (Usuario por ID)
│   ├── POST / (Crear usuario)
│   ├── PUT /{id} (Actualizar usuario)
│   └── DELETE /{id} (Eliminar usuario)
├── course.py (/courses)
│   ├── GET / (Todos los cursos)
│   ├── GET /{id} (Curso por ID)
│   ├── POST / (Crear curso)
│   ├── PUT /{id} (Actualizar curso)
│   └── DELETE /{id} (Eliminar curso)
├── activity.py (/activity)
│   ├── GET / (Todas las actividades)
│   ├── GET /{id} (Actividad por ID)
│   ├── GET /course/{id} (Por curso)
│   ├── POST / (Crear actividad)
│   ├── PUT /{id} (Actualizar actividad)
│   └── DELETE /{id} (Eliminar actividad)
├── comment.py (/comment)
│   ├── GET / (Todos los comentarios)
│   ├── GET /{id} (Comentario por ID)
│   ├── GET /course/{id} (Por curso)
│   ├── POST / (Crear comentario)
│   ├── PUT /{id} (Actualizar comentario)
│   └── DELETE /{id} (Eliminar comentario)
├── answer.py (/answer)
│   ├── GET / (Todas las respuestas)
│   ├── GET /{id} (Respuesta por ID)
│   ├── GET /activity/{activity_id}/user/{user_email}
│   ├── POST / (Crear respuesta)
│   ├── PUT /{id} (Actualizar respuesta)
│   └── DELETE /{id} (Eliminar respuesta)
├── debate_ia.py (/debate-topics)
│   ├── GET /{id} (Tema de debate)
│   ├── POST /process-round (Procesar ronda)
│   ├── POST /give-feedback (Generar feedback)
│   ├── POST /save-report (Guardar reporte)
│   └── GET /reports/{email} (Reportes por usuario)
├── oratory_ia.py (/oratory-topics)
│   ├── GET /{difficulty} (Tema por dificultad)
│   └── POST /analyze (Analizar entrada)
└── oratory_audio.py (/oratory-audio)
    ├── GET /list (Lista de audios)
    ├── GET /blob/{id} (Audio por ID)
    └── POST /save (Guardar audio)
```

### 4. Capa de Servicios (service/)
```
Service Layer (Lógica de Negocio)
├── user.py
│   ├── read_users()
│   ├── read_user()
│   ├── create_user()
│   ├── update_user()
│   └── delete_user()
├── course.py
│   ├── read_courses()
│   ├── read_course()
│   ├── create_course()
│   ├── update_course()
│   └── delete_course()
├── activity.py
│   ├── read_activities()
│   ├── read_activity()
│   ├── read_activity_by_course_id()
│   ├── create_activity()
│   ├── update_activity()
│   └── delete_activity()
├── comment.py
│   ├── read_comments()
│   ├── read_comment()
│   ├── read_comment_by_course_id()
│   ├── create_comment()
│   ├── update_comment()
│   └── delete_comment()
├── answer.py
│   ├── read_answers()
│   ├── read_answer_by_id()
│   ├── read_answers_by_activity_user()
│   ├── create_answer()
│   ├── update_answer()
│   └── delete_answer()
├── debate_topics.py
│   ├── read_topic()
│   ├── generate_argument()
│   ├── summary_generator()
│   ├── save_report()
│   └── get_user_reports()
├── oratory_topics.py
│   ├── generate_oratory_topic()
│   └── analyze_oratory_input()
└── oratory_audio.py
    ├── save_audio_blob()
    ├── get_audio_blob()
    └── get_audio_list()
```

### 5. Capa de Modelos (model/)
```
Model Layer (SQLModel)
├── user.py
│   ├── UserBase (SQLModel)
│   ├── User (Table)
│   ├── UserCreate (Pydantic)
│   ├── UserRead (Pydantic)
│   └── UserUpdate (Pydantic)
├── course.py
│   ├── CourseBase (SQLModel)
│   ├── Course (Table)
│   ├── CourseCreate (Pydantic)
│   ├── CourseRead (Pydantic)
│   └── CourseUpdate (Pydantic)
├── activity.py
│   ├── ActivityBase (SQLModel)
│   ├── Activity (Table)
│   ├── ActivityCreate (Pydantic)
│   ├── ActivityRead (Pydantic)
│   └── ActivityUpdate (Pydantic)
├── comment.py
│   ├── CommentBase (SQLModel)
│   ├── Comment (Table)
│   ├── CommentCreate (Pydantic)
│   ├── CommentRead (Pydantic)
│   └── CommentUpdate (Pydantic)
├── answer.py
│   ├── AnswerBase (SQLModel)
│   ├── Answer (Table)
│   ├── AnswerCreate (Pydantic)
│   ├── AnswerRead (Pydantic)
│   └── AnswerUpdate (Pydantic)
├── debate_topics.py
│   ├── DebateTopicBase (SQLModel)
│   ├── DebateTopic (Table)
│   ├── DebateTopicRead (Pydantic)
│   ├── DebateRoundRequest (Pydantic)
│   ├── DebateDebateFeedbackRequest (Pydantic)
│   └── DebateReportRequest (Table)
└── oratory_audio.py
    ├── OratoryAudioBase (SQLModel)
    ├── OratoryAudio (Table)
    ├── OratoryAudioCreate (Pydantic)
    ├── OratoryAudioRead (Pydantic)
    └── OratoryAudioListItem (Pydantic)
```

### 6. Capa de Persistencia (database.py)
```
Database Layer
├── SQLModel Engine
│   ├── PostgreSQL Connection
│   ├── Connection Pool
│   └── Echo Mode (Development)
├── Session Management
│   ├── get_session() (Dependency)
│   ├── Session Lifecycle
│   └── Transaction Management
└── Database Operations
    ├── create_db_and_tables()
    ├── CRUD Operations
    └── Query Execution
```

### 7. Capa de Servicios Externos
```
External Services
├── OpenAI Integration
│   ├── GPT-4o-mini Model
│   ├── Chat Completions API
│   ├── Debate Argument Generation
│   └── Feedback Generation
├── Groq Integration
│   ├── Llama-3.3-70b Model
│   ├── Fallback Service
│   ├── Chat Completions
│   └── Error Handling
└── Environment Configuration
    ├── API Keys Management
    ├── Service Selection Logic
    └── Retry Mechanisms
```

## Flujo de Datos

### 1. Flujo de Petición HTTP
```
Cliente → FastAPI Router → Service Layer → Model Layer → Database → Response
```

### 2. Flujo de Pensamiento Crítico
```
Frontend → /debate-topics/process-round → generate_argument() → OpenAI/Groq → Response
```

### 3. Flujo de Oratoria
```
Frontend → /oratory-topics/analyze → analyze_oratory_input() → OpenAI/Groq → Response
```

### 4. Flujo de Audio
```
Frontend → /oratory-audio/save → save_audio_blob() → PostgreSQL BLOB → Response
```

## Tecnologías Utilizadas

### Core Framework
- **FastAPI 0.111.0** - Framework web asíncrono
- **Uvicorn 0.30.1** - Servidor ASGI
- **Pydantic 2.8.2** - Validación de datos
- **SQLModel 0.0.19** - ORM basado en SQLAlchemy

### Base de Datos
- **PostgreSQL** - Base de datos principal
- **SQLAlchemy 2.0.25** - ORM subyacente
- **psycopg2 2.9.9** - Driver de PostgreSQL

### Servicios de IA
- **OpenAI** - GPT-4o-mini para procesamiento de lenguaje
- **Groq** - Llama-3.3-70b como servicio de respaldo
- **python-dotenv 1.0.0** - Gestión de variables de entorno

### Herramientas de Desarrollo
- **pytest** - Framework de testing
- **gunicorn 21.2.0** - Servidor WSGI para producción
- **hypercorn 0.16.0** - Servidor ASGI alternativo

### Deployment
- **Vercel** - Plataforma de deployment
- **Docker** - Containerización (opcional)

## Patrones de Diseño Implementados

### 1. Repository Pattern
- Separación entre lógica de negocio y acceso a datos
- Servicios como capa de abstracción
- Modelos SQLModel para definición de esquemas

### 2. Dependency Injection
- `Depends()` para inyección de dependencias
- `get_session()` para gestión de sesiones de BD
- Configuración centralizada

### 3. Factory Pattern
- Creación de instancias de modelos
- Configuración de servicios externos
- Gestión de conexiones

### 4. Strategy Pattern
- Selección entre OpenAI y Groq
- Diferentes estrategias de análisis
- Fallback mechanisms

### 5. Adapter Pattern
- Adaptación de respuestas de IA
- Transformación de datos entre capas
- Integración con servicios externos

## Características de Arquitectura

### Escalabilidad
- Arquitectura asíncrona con FastAPI
- Pool de conexiones a base de datos
- Servicios externos independientes
- Separación clara de responsabilidades

### Mantenibilidad
- Código organizado por dominios
- Modelos Pydantic para validación
- Documentación automática con Swagger
- Testing con pytest

### Seguridad
- Validación de datos con Pydantic
- Gestión segura de API keys
- CORS configurado
- Manejo de errores estructurado

### Performance
- Operaciones asíncronas
- Pool de conexiones optimizado
- Caching de sesiones
- Respuestas JSON optimizadas

### Observabilidad
- Logging estructurado
- Documentación automática de APIs
- Manejo de errores centralizado
- Métricas de rendimiento

## Manejo de Errores

### Errores Personalizados
```python
# errors.py
class Missing(Exception):
    def __init__(self, msg: str):
        self.msg = msg

class Duplicate(Exception):
    def __init__(self, msg: str):
        self.msg = msg
```

### Manejo en Endpoints
- HTTPException para errores HTTP
- Status codes apropiados
- Mensajes de error descriptivos
- Logging de errores para debugging 