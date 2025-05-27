# Diagrama de Arquitectura Frontend - Código Mermaid

## Diagrama Principal de Arquitectura

```mermaid
graph TB
    %% Capa de Usuario
    User[👤 Usuario] --> Auth[🔐 Autenticación]
    
    %% Capa de Enrutamiento
    Auth --> App[📱 App.js - Router Principal]
    
    %% Rutas principales
    App --> SignIn[🔑 SignIn]
    App --> SignUp[📝 SignUp]
    App --> Dashboard[🏠 Dashboard]
    App --> Course[📚 Course]
    App --> Activity[📋 Activity]
    
    %% Dashboard
    Dashboard --> NavBar[🧭 ResponsiveAppBar]
    Dashboard --> Profile[👤 ProfileInDashboard]
    Dashboard --> CourseGrid[🎯 Course Cards Grid]
    
    %% Course Component
    Course --> CourseNav[🧭 ResponsiveAppBar]
    Course --> CourseHeader[🖼️ Header con imagen]
    Course --> CourseMain[📄 Información principal]
    Course --> CourseSide[📺 Video y navegación]
    Course --> Comments[💬 Sistema de comentarios]
    
    %% Actividades Personalizadas
    Activity --> PensamientoCritico[🧠 Pensamiento Crítico]
    Activity --> Oratoria[🎤 Oratoria]
    Activity --> OtrasActividades[📚 Otras Actividades]
    
    %% Módulo Pensamiento Crítico
    PensamientoCritico --> DebateStart[🚀 DebateStart]
    PensamientoCritico --> MainDebate[💭 MainDebate]
    PensamientoCritico --> DebateReport[📊 DebateReport]
    MainDebate --> Chat[💬 Chat Component]
    Chat --> Message[📝 Message Component]
    
    %% Módulo Oratoria
    Oratoria --> OratoryStart[🚀 OratoryStart]
    Oratoria --> MainOratory[🎤 MainOratory]
    Oratoria --> OratoryFeedback[📈 OratoryFeedback]
    Oratoria --> OratoryReport[📊 OratoryReport]
    
    %% Servicios y APIs
    Chat --> FastAPI[🔗 FastAPI Backend]
    OratoryFeedback --> SpeechAPI[🎙️ Speech Recognition API]
    FastAPI --> OpenAI[🤖 OpenAI GPT-4o-mini]
    FastAPI --> Groq[🦙 Groq Llama-3.3-70b]
    
    %% Estado y Persistencia
    Dashboard --> ReactHooks[⚛️ React Hooks]
    Course --> SessionStorage[💾 Session Storage]
    Auth --> Auth0[🔐 Auth0 Service]
    
    %% Styling y UI
    Dashboard --> MaterialUI[🎨 Material-UI v5]
    Course --> ThemeProvider[🎭 Theme Provider]
    
    %% Clases de estilo
    classDef userLayer fill:#e1f5fe
    classDef routingLayer fill:#f3e5f5
    classDef componentLayer fill:#e8f5e8
    classDef serviceLayer fill:#fff3e0
    classDef dataLayer fill:#fce4ec
    
    class User userLayer
    class Auth,App routingLayer
    class SignIn,SignUp,Dashboard,Course,Activity,PensamientoCritico,Oratoria componentLayer
    class FastAPI,OpenAI,Groq,SpeechAPI serviceLayer
    class ReactHooks,SessionStorage,Auth0 dataLayer
```

## Diagrama de Flujo de Datos

```mermaid
sequenceDiagram
    participant U as Usuario
    participant A as Auth0
    participant D as Dashboard
    participant C as Course
    participant PC as Pensamiento Crítico
    participant API as FastAPI
    participant IA as OpenAI/Groq
    
    U->>A: Login
    A->>D: Autenticación exitosa
    D->>API: GET /courses
    API->>D: Lista de cursos [253, 270]
    D->>U: Muestra cursos filtrados
    
    U->>C: Selecciona curso
    C->>API: GET /courses/:id
    C->>API: GET /activity/course/:id
    API->>C: Datos del curso y actividades
    C->>U: Muestra información del curso
    
    U->>PC: Inicia actividad de debate
    PC->>API: POST /debate-topics/process-round
    API->>IA: Procesa respuesta del usuario
    IA->>API: Genera contraargumento
    API->>PC: Respuesta de IA
    PC->>U: Muestra respuesta en chat
    
    Note over U,IA: Ciclo se repite hasta 10 rondas
    
    PC->>API: POST /debate-topics/give-feedback
    API->>IA: Genera feedback final
    IA->>API: Feedback estructurado
    API->>PC: Feedback completo
    PC->>U: Muestra reporte final
```

## Diagrama de Componentes Detallado

```mermaid
graph LR
    %% Componentes principales
    subgraph "🏠 Dashboard"
        D1[ResponsiveAppBar]
        D2[ProfileInDashboard]
        D3[Course Cards]
        D4[Material-UI Theme]
    end
    
    subgraph "📚 Course"
        C1[Course Header]
        C2[Course Info]
        C3[Activities List]
        C4[Video Player]
        C5[Comments System]
        C6[Tab Navigation]
    end
    
    subgraph "🧠 Pensamiento Crítico"
        PC1[DebateStart]
        PC2[MainDebate]
        PC3[Chat Component]
        PC4[Message Component]
        PC5[DebateReport]
        PC6[Feedback Display]
    end
    
    subgraph "🎤 Oratoria"
        O1[OratoryStart]
        O2[MainOratory]
        O3[Speech Recognition]
        O4[OratoryFeedback]
        O5[OratoryReport]
    end
    
    subgraph "🔧 Servicios"
        S1[Axios HTTP Client]
        S2[React Router]
        S3[Auth0 Provider]
        S4[Session Storage]
    end
    
    subgraph "🎨 UI Framework"
        UI1[Material-UI Components]
        UI2[Custom Theme]
        UI3[Responsive Grid]
        UI4[Icons & Assets]
    end
    
    %% Conexiones
    D3 --> C1
    C3 --> PC1
    C3 --> O1
    PC2 --> PC3
    PC3 --> PC4
    O2 --> O3
    
    %% Servicios conectados
    S1 --> PC2
    S1 --> O2
    S2 --> D1
    S3 --> D2
    S4 --> PC3
    
    %% UI conectado
    UI1 --> D4
    UI2 --> C1
    UI3 --> C2
    UI4 --> D3
```

## Diagrama de Estados y Hooks

```mermaid
stateDiagram-v2
    [*] --> Loading
    Loading --> Authenticated: Auth0 Success
    Loading --> Unauthenticated: Auth0 Fail
    
    Unauthenticated --> SignIn
    SignIn --> Loading: Login Attempt
    
    Authenticated --> Dashboard
    Dashboard --> CourseView: Select Course
    CourseView --> ActivityView: Select Activity
    
    state ActivityView {
        [*] --> PensamientoCritico
        [*] --> Oratoria
        
        state PensamientoCritico {
            [*] --> DebateInit
            DebateInit --> ChatActive: Start Debate
            ChatActive --> ChatActive: Send Message
            ChatActive --> FeedbackGeneration: Complete 10 Rounds
            FeedbackGeneration --> ReportView: Show Results
        }
        
        state Oratoria {
            [*] --> RecordingSetup
            RecordingSetup --> Recording: Start Recording
            Recording --> Processing: Stop Recording
            Processing --> FeedbackDisplay: Analysis Complete
        }
    }
    
    ActivityView --> CourseView: Back to Course
    CourseView --> Dashboard: Back to Dashboard
```

## Uso del Diagrama

### Para incluir en LaTeX:
1. Copia el código Mermaid
2. Usa un generador online como mermaid.live
3. Exporta como PNG/SVG
4. Incluye en tu documento LaTeX

### Ejemplo de inclusión en LaTeX:
```latex
\begin{figure}[h]
    \centering
    \includegraphics[width=\textwidth]{diagrama-arquitectura-frontend.png}
    \caption{Arquitectura Frontend de la Aplicación de Habilidades Blandas}
    \label{fig:frontend-architecture}
\end{figure}
``` 