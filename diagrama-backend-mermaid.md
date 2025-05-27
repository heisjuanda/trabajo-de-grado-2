# Diagrama de Arquitectura Backend - Código Mermaid

## Diagrama Principal de Arquitectura

```mermaid
graph TB
    %% Capa de Cliente
    Client[🌐 Cliente Frontend] --> API[🚀 FastAPI Application]
    
    %% Capa de Aplicación
    API --> CORS[🔒 CORS Middleware]
    CORS --> Router[🛣️ API Router]
    
    %% Capa de Enrutamiento
    Router --> UserRouter[👤 /users]
    Router --> CourseRouter[📚 /courses]
    Router --> ActivityRouter[📋 /activity]
    Router --> CommentRouter[💬 /comment]
    Router --> AnswerRouter[📝 /answer]
    Router --> DebateRouter[🧠 /debate-topics]
    Router --> OratoryRouter[🎤 /oratory-topics]
    Router --> AudioRouter[🎵 /oratory-audio]
    
    %% Capa de Servicios
    UserRouter --> UserService[👤 User Service]
    CourseRouter --> CourseService[📚 Course Service]
    ActivityRouter --> ActivityService[📋 Activity Service]
    CommentRouter --> CommentService[💬 Comment Service]
    AnswerRouter --> AnswerService[📝 Answer Service]
    DebateRouter --> DebateService[🧠 Debate Service]
    OratoryRouter --> OratoryService[🎤 Oratory Service]
    AudioRouter --> AudioService[🎵 Audio Service]
    
    %% Capa de Modelos
    UserService --> UserModel[👤 User Model]
    CourseService --> CourseModel[📚 Course Model]
    ActivityService --> ActivityModel[📋 Activity Model]
    CommentService --> CommentModel[💬 Comment Model]
    AnswerService --> AnswerModel[📝 Answer Model]
    DebateService --> DebateModel[🧠 Debate Model]
    AudioService --> AudioModel[🎵 Audio Model]
    
    %% Capa de Base de Datos
    UserModel --> DB[(🗄️ PostgreSQL)]
    CourseModel --> DB
    ActivityModel --> DB
    CommentModel --> DB
    AnswerModel --> DB
    DebateModel --> DB
    AudioModel --> DB
    
    %% Servicios Externos
    DebateService --> OpenAI[🤖 OpenAI GPT-4o-mini]
    DebateService --> Groq[🦙 Groq Llama-3.3-70b]
    OratoryService --> OpenAI
    OratoryService --> Groq
    
    %% Configuración
    API --> Config[⚙️ Configuration]
    Config --> EnvVars[🔐 Environment Variables]
    
    %% Clases de estilo
    classDef clientLayer fill:#e3f2fd
    classDef appLayer fill:#f3e5f5
    classDef routerLayer fill:#e8f5e8
    classDef serviceLayer fill:#fff3e0
    classDef modelLayer fill:#fce4ec
    classDef dbLayer fill:#f1f8e9
    classDef externalLayer fill:#fff8e1
    
    class Client clientLayer
    class API,CORS,Router appLayer
    class UserRouter,CourseRouter,ActivityRouter,CommentRouter,AnswerRouter,DebateRouter,OratoryRouter,AudioRouter routerLayer
    class UserService,CourseService,ActivityService,CommentService,AnswerService,DebateService,OratoryService,AudioService serviceLayer
    class UserModel,CourseModel,ActivityModel,CommentModel,AnswerModel,DebateModel,AudioModel modelLayer
    class DB dbLayer
    class OpenAI,Groq,Config,EnvVars externalLayer
```

## Diagrama de Flujo de Datos - Pensamiento Crítico

```mermaid
sequenceDiagram
    participant F as Frontend
    participant R as Router
    participant DS as Debate Service
    participant AI as OpenAI/Groq
    participant DB as PostgreSQL
    
    F->>R: POST /debate-topics/{id}
    R->>DS: get_topic_by_id(id)
    DS->>DB: SELECT * FROM debate_topics WHERE id = ?
    DB->>DS: DebateTopic data
    DS->>R: DebateTopicRead
    R->>F: Topic data
    
    F->>R: POST /debate-topics/process-round
    R->>DS: generate_argument(context, response, round)
    DS->>AI: Chat completion request
    AI->>DS: AI generated argument
    DS->>R: Argument response
    R->>F: AI argument
    
    Note over F,DB: Repeat for up to 10 rounds
    
    F->>R: POST /debate-topics/give-feedback
    R->>DS: summary_generator(debate_text)
    DS->>AI: Generate feedback request
    AI->>DS: Structured feedback
    DS->>R: Feedback response
    R->>F: Final feedback
    
    F->>R: POST /debate-topics/save-report
    R->>DS: save_report(report_data)
    DS->>DB: INSERT INTO debate_reports
    DB->>DS: Report saved
    DS->>R: Success response
    R->>F: Report saved confirmation
```

## Diagrama de Flujo de Datos - Oratoria

```mermaid
sequenceDiagram
    participant F as Frontend
    participant R as Router
    participant OS as Oratory Service
    participant AS as Audio Service
    participant AI as OpenAI/Groq
    participant DB as PostgreSQL
    
    F->>R: GET /oratory-topics/{difficulty}
    R->>OS: generate_oratory_topic(difficulty)
    OS->>AI: Generate topic request
    AI->>OS: Generated topic
    OS->>R: Topic response
    R->>F: Oratory topic
    
    F->>R: POST /oratory-topics/analyze
    R->>OS: analyze_oratory_input(text)
    OS->>AI: Analyze speech request
    AI->>OS: Analysis results
    OS->>R: Analysis response
    R->>F: Speech analysis
    
    F->>R: POST /oratory-audio/save
    R->>AS: save_audio_blob(audio_data)
    AS->>DB: INSERT audio as BLOB
    DB->>AS: Audio saved
    AS->>R: Success response
    R->>F: Audio saved confirmation
    
    F->>R: GET /oratory-audio/list
    R->>AS: get_audio_list(filters)
    AS->>DB: SELECT audio metadata
    DB->>AS: Audio list
    AS->>R: Audio list response
    R->>F: Audio list
```

## Diagrama de Modelos de Datos

```mermaid
erDiagram
    User {
        int id PK
        string name
        string email
        string password
    }
    
    Course {
        int id PK
        string title
        string description
        string image
    }
    
    Activity {
        int id PK
        string title
        string description
        string content_type
        string path
        int course_id FK
    }
    
    Comment {
        int id PK
        string content
        string user_email
        int course_id FK
        datetime created_at
    }
    
    Answer {
        int id PK
        string content
        string user_email
        int activity_id FK
        int question_id
        datetime created_at
    }
    
    DebateTopic {
        int id PK
        string question
        string description
    }
    
    DebateReport {
        int id PK
        string email
        string topic
        string chat
        string feedback
        datetime created_at
    }
    
    OratoryAudio {
        int id PK
        string user_email
        string feedback
        int calification
        string transcript
        bytes audio_data
        string audio_format
        int duration_ms
        datetime created_at
    }
    
    %% Relaciones
    Course ||--o{ Activity : "has many"
    Course ||--o{ Comment : "has many"
    Activity ||--o{ Answer : "has many"
    User ||--o{ Comment : "creates"
    User ||--o{ Answer : "provides"
    User ||--o{ DebateReport : "generates"
    User ||--o{ OratoryAudio : "records"
```

## Diagrama de Servicios y Dependencias

```mermaid
graph LR
    %% Servicios principales
    subgraph "🏗️ Core Services"
        US[User Service]
        CS[Course Service]
        AS[Activity Service]
        CMS[Comment Service]
        ANS[Answer Service]
    end
    
    %% Servicios de IA
    subgraph "🤖 AI Services"
        DS[Debate Service]
        OS[Oratory Service]
        AUS[Audio Service]
    end
    
    %% Modelos
    subgraph "📊 Data Models"
        UM[User Model]
        CM[Course Model]
        AM[Activity Model]
        COM[Comment Model]
        ANM[Answer Model]
        DM[Debate Model]
        AUM[Audio Model]
    end
    
    %% Servicios externos
    subgraph "🌐 External APIs"
        OpenAI[OpenAI API]
        Groq[Groq API]
    end
    
    %% Base de datos
    subgraph "🗄️ Database"
        PG[(PostgreSQL)]
    end
    
    %% Configuración
    subgraph "⚙️ Configuration"
        Config[Settings]
        Env[Environment]
    end
    
    %% Conexiones Core Services
    US --> UM
    CS --> CM
    AS --> AM
    CMS --> COM
    ANS --> ANM
    
    %% Conexiones AI Services
    DS --> DM
    OS --> OpenAI
    OS --> Groq
    DS --> OpenAI
    DS --> Groq
    AUS --> AUM
    
    %% Conexiones a BD
    UM --> PG
    CM --> PG
    AM --> PG
    COM --> PG
    ANM --> PG
    DM --> PG
    AUM --> PG
    
    %% Configuración
    Config --> Env
    DS --> Config
    OS --> Config
```

## Diagrama de Estados del Sistema

```mermaid
stateDiagram-v2
    [*] --> Starting
    Starting --> Configuring: Load Environment
    Configuring --> DatabaseConnecting: Setup Complete
    DatabaseConnecting --> Ready: DB Connected
    
    Ready --> ProcessingRequest: HTTP Request
    ProcessingRequest --> ValidatingData: Parse Request
    ValidatingData --> ExecutingService: Data Valid
    ValidatingData --> ErrorResponse: Data Invalid
    
    ExecutingService --> DatabaseOperation: Service Logic
    ExecutingService --> AIService: AI Required
    ExecutingService --> DirectResponse: Simple Operation
    
    DatabaseOperation --> DatabaseConnected: Query DB
    DatabaseConnected --> ProcessingResponse: DB Success
    DatabaseConnected --> ErrorResponse: DB Error
    
    AIService --> OpenAICall: Primary AI
    AIService --> GroqCall: Fallback AI
    OpenAICall --> ProcessingResponse: AI Success
    OpenAICall --> GroqCall: AI Error
    GroqCall --> ProcessingResponse: AI Success
    GroqCall --> ErrorResponse: AI Error
    
    ProcessingResponse --> Ready: Response Sent
    DirectResponse --> Ready: Response Sent
    ErrorResponse --> Ready: Error Sent
    
    Ready --> Shutdown: Stop Signal
    Shutdown --> [*]
```

## Diagrama de Deployment

```mermaid
graph TB
    %% Desarrollo
    subgraph "💻 Development"
        DevEnv[Local Environment]
        DevDB[(Local PostgreSQL)]
        DevEnv --> DevDB
    end
    
    %% Producción
    subgraph "☁️ Production"
        Vercel[Vercel Platform]
        ProdDB[(Production PostgreSQL)]
        CDN[Vercel CDN]
        
        Vercel --> ProdDB
        Vercel --> CDN
    end
    
    %% Servicios externos
    subgraph "🤖 External Services"
        OpenAIAPI[OpenAI API]
        GroqAPI[Groq API]
    end
    
    %% CI/CD
    subgraph "🔄 CI/CD"
        GitHub[GitHub Repository]
        VercelDeploy[Vercel Deployment]
        
        GitHub --> VercelDeploy
        VercelDeploy --> Vercel
    end
    
    %% Conexiones
    DevEnv -.-> OpenAIAPI
    DevEnv -.-> GroqAPI
    Vercel --> OpenAIAPI
    Vercel --> GroqAPI
    
    %% Monitoreo
    subgraph "📊 Monitoring"
        Logs[Vercel Logs]
        Metrics[Performance Metrics]
        
        Vercel --> Logs
        Vercel --> Metrics
    end
```

## Uso de los Diagramas

### Para incluir en LaTeX:
1. Copia cada código Mermaid
2. Genera las imágenes en [mermaid.live](https://mermaid.live)
3. Exporta como PNG/SVG de alta calidad
4. Incluye en tu documento

### Ejemplo de inclusión:
```latex
\begin{figure}[h]
    \centering
    \includegraphics[width=\textwidth]{diagrama-arquitectura-backend.png}
    \caption{Arquitectura Backend con FastAPI y PostgreSQL}
    \label{fig:backend-architecture}
\end{figure}
```

### Diagramas recomendados para el Anexo C:
1. **Diagrama Principal** - Vista general de la arquitectura
2. **Diagrama de Modelos** - Estructura de la base de datos
3. **Diagrama de Servicios** - Organización de servicios y dependencias
4. **Diagrama de Deployment** - Configuración de producción 