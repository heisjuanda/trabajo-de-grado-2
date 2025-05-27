# Diagramas de Flujos de Usuario - Código Mermaid

## Diagrama de Flujo Principal de Usuario

```mermaid
flowchart TD
    Start([👤 Usuario Accede]) --> Auth{🔐 ¿Autenticado?}
    
    Auth -->|No| Login[🔑 Página de Login]
    Auth -->|Sí| Dashboard[🏠 Dashboard]
    
    Login --> AuthChoice{Método de Autenticación}
    AuthChoice -->|Email/Password| EmailAuth[📧 Login con Email]
    AuthChoice -->|Social Login| SocialAuth[🌐 Login Social]
    
    EmailAuth --> AuthSuccess{✅ ¿Éxito?}
    SocialAuth --> AuthSuccess
    
    AuthSuccess -->|No| LoginError[❌ Error de Login]
    AuthSuccess -->|Sí| Dashboard
    
    LoginError --> Login
    
    Dashboard --> CourseSelection{📚 Selección de Curso}
    CourseSelection -->|Oratoria| OratoryCourse[🎤 Curso de Oratoria]
    CourseSelection -->|Pensamiento Crítico| CriticalCourse[🧠 Curso de Pensamiento Crítico]
    
    OratoryCourse --> OratoryActivity[🎯 Actividades de Oratoria]
    CriticalCourse --> CriticalActivity[💭 Actividades de Pensamiento Crítico]
    
    OratoryActivity --> OratoryFlow[🎤 Flujo de Oratoria]
    CriticalActivity --> DebateFlow[💬 Flujo de Debate]
    
    OratoryFlow --> Reports[📊 Reportes y Seguimiento]
    DebateFlow --> Reports
    
    Reports --> Dashboard
    
    %% Estilos
    classDef startEnd fill:#e1f5fe
    classDef process fill:#f3e5f5
    classDef decision fill:#e8f5e8
    classDef activity fill:#fff3e0
    classDef error fill:#ffebee
    
    class Start,Reports startEnd
    class Login,EmailAuth,SocialAuth,Dashboard,OratoryCourse,CriticalCourse process
    class Auth,AuthChoice,AuthSuccess,CourseSelection decision
    class OratoryActivity,CriticalActivity,OratoryFlow,DebateFlow activity
    class LoginError error
```

## Diagrama de Flujo de Pensamiento Crítico

```mermaid
flowchart TD
    Start([🧠 Módulo Pensamiento Crítico]) --> TopicSelection[🎯 Selección de Tema]
    
    TopicSelection --> TopicGeneration[🎲 Generación Aleatoria de Tema]
    TopicGeneration --> TopicDisplay[📋 Mostrar Tema y Contexto]
    
    TopicDisplay --> UserReady{👤 ¿Usuario Listo?}
    UserReady -->|No| TopicDisplay
    UserReady -->|Sí| DebateStart[🚀 Iniciar Debate]
    
    DebateStart --> RoundCounter[🔢 Contador: Ronda 1/10]
    RoundCounter --> UserInput[✍️ Usuario Escribe Argumento]
    
    UserInput --> ValidateInput{✅ ¿Argumento Válido?}
    ValidateInput -->|No| InputError[❌ Error: Mínimo 10 caracteres]
    ValidateInput -->|Sí| AIProcessing[🤖 IA Procesando...]
    
    InputError --> UserInput
    
    AIProcessing --> AIStrategy{🎯 Estrategia por Ronda}
    AIStrategy -->|Rondas 1-3| ExploreStrategy[🔍 Explorar Perspectivas]
    AIStrategy -->|Rondas 4-6| DeepStrategy[🔬 Profundizar Argumentos]
    AIStrategy -->|Rondas 7-8| RefineStrategy[🎨 Refinar Posición]
    AIStrategy -->|Rondas 9-10| ConcludeStrategy[🎯 Conclusión Reflexiva]
    
    ExploreStrategy --> AIResponse[💬 Respuesta de IA]
    DeepStrategy --> AIResponse
    RefineStrategy --> AIResponse
    ConcludeStrategy --> AIResponse
    
    AIResponse --> UpdateHistory[📝 Actualizar Historial]
    UpdateHistory --> CheckRounds{🔢 ¿Ronda < 10?}
    
    CheckRounds -->|Sí| NextRound[➡️ Siguiente Ronda]
    CheckRounds -->|No| GenerateFeedback[📊 Generar Feedback]
    
    NextRound --> RoundCounter
    
    GenerateFeedback --> FeedbackProcessing[🤖 IA Analizando Debate...]
    FeedbackProcessing --> FeedbackDisplay[📋 Mostrar Feedback Estructurado]
    
    FeedbackDisplay --> SaveReport{💾 ¿Guardar Reporte?}
    SaveReport -->|Sí| ReportSaved[✅ Reporte Guardado]
    SaveReport -->|No| BackToCourse[🔙 Volver al Curso]
    
    ReportSaved --> ViewReports[📊 Ver Reportes Históricos]
    ViewReports --> BackToCourse
    
    BackToCourse --> End([🏁 Fin del Flujo])
    
    %% Estilos
    classDef startEnd fill:#e1f5fe
    classDef process fill:#f3e5f5
    classDef decision fill:#e8f5e8
    classDef aiProcess fill:#fff3e0
    classDef error fill:#ffebee
    classDef success fill:#e8f5e8
    
    class Start,End startEnd
    class TopicSelection,TopicGeneration,TopicDisplay,DebateStart,RoundCounter,UserInput,UpdateHistory,NextRound,FeedbackDisplay,BackToCourse,ViewReports process
    class UserReady,ValidateInput,AIStrategy,CheckRounds,SaveReport decision
    class AIProcessing,ExploreStrategy,DeepStrategy,RefineStrategy,ConcludeStrategy,AIResponse,GenerateFeedback,FeedbackProcessing aiProcess
    class InputError error
    class ReportSaved success
```

## Diagrama de Flujo de Oratoria

```mermaid
flowchart TD
    Start([🎤 Módulo de Oratoria]) --> DifficultySelection[🎯 Seleccionar Dificultad]
    
    DifficultySelection --> DifficultyLevel{📊 Nivel de Dificultad}
    DifficultyLevel -->|1-2| BeginnerTopic[🌱 Tema Principiante]
    DifficultyLevel -->|3| IntermediateTopic[🌿 Tema Intermedio]
    DifficultyLevel -->|4-5| AdvancedTopic[🌳 Tema Avanzado]
    
    BeginnerTopic --> TopicGeneration[🤖 IA Genera Tema]
    IntermediateTopic --> TopicGeneration
    AdvancedTopic --> TopicGeneration
    
    TopicGeneration --> TopicDisplay[📋 Mostrar Tema Generado]
    TopicDisplay --> PreparationTime[⏰ Tiempo de Preparación]
    
    PreparationTime --> UserReady{👤 ¿Listo para Grabar?}
    UserReady -->|No| PreparationTime
    UserReady -->|Sí| MicPermission[🎙️ Solicitar Permisos de Micrófono]
    
    MicPermission --> PermissionCheck{✅ ¿Permisos Otorgados?}
    PermissionCheck -->|No| PermissionError[❌ Error: Permisos Requeridos]
    PermissionCheck -->|Sí| AudioSetup[🔧 Configuración de Audio]
    
    PermissionError --> MicPermission
    
    AudioSetup --> AudioTest[🎵 Prueba de Calidad de Audio]
    AudioTest --> QualityCheck{🔍 ¿Calidad Adecuada?}
    
    QualityCheck -->|No| AudioAdjust[⚙️ Ajustar Configuración]
    QualityCheck -->|Sí| RecordingStart[🔴 Iniciar Grabación]
    
    AudioAdjust --> AudioTest
    
    RecordingStart --> Recording[🎙️ Grabando...]
    Recording --> SpeechRecognition[🗣️ Speech Recognition API]
    
    SpeechRecognition --> RealTimeTranscript[📝 Transcripción en Tiempo Real]
    RealTimeTranscript --> RecordingActive{🔴 ¿Grabación Activa?}
    
    RecordingActive -->|Sí| Recording
    RecordingActive -->|No| StopRecording[⏹️ Detener Grabación]
    
    StopRecording --> AudioProcessing[🔄 Procesando Audio...]
    AudioProcessing --> TranscriptAnalysis[📊 Análisis de Transcripción]
    
    TranscriptAnalysis --> AIAnalysis[🤖 IA Analizando Discurso...]
    AIAnalysis --> AnalysisAspects{🎯 Aspectos de Análisis}
    
    AnalysisAspects --> FluencyAnalysis[🌊 Análisis de Fluidez]
    AnalysisAspects --> CoherenceAnalysis[🧩 Análisis de Coherencia]
    AnalysisAspects --> StructureAnalysis[🏗️ Análisis de Estructura]
    AnalysisAspects --> LanguageAnalysis[📚 Análisis de Lenguaje]
    
    FluencyAnalysis --> GenerateFeedback[📋 Generar Feedback]
    CoherenceAnalysis --> GenerateFeedback
    StructureAnalysis --> GenerateFeedback
    LanguageAnalysis --> GenerateFeedback
    
    GenerateFeedback --> ScoreCalculation[🎯 Cálculo de Calificación]
    ScoreCalculation --> FeedbackDisplay[📊 Mostrar Feedback Detallado]
    
    FeedbackDisplay --> SaveAudio{💾 ¿Guardar Audio?}
    SaveAudio -->|Sí| AudioStorage[🗄️ Guardar en Base de Datos]
    SaveAudio -->|No| ViewHistory[📈 Ver Historial]
    
    AudioStorage --> AudioSaved[✅ Audio Guardado como BLOB]
    AudioSaved --> ViewHistory
    
    ViewHistory --> ProgressMetrics[📊 Métricas de Progreso]
    ProgressMetrics --> BackToCourse[🔙 Volver al Curso]
    
    BackToCourse --> End([🏁 Fin del Flujo])
    
    %% Estilos
    classDef startEnd fill:#e1f5fe
    classDef process fill:#f3e5f5
    classDef decision fill:#e8f5e8
    classDef aiProcess fill:#fff3e0
    classDef error fill:#ffebee
    classDef success fill:#e8f5e8
    classDef recording fill:#ffecb3
    
    class Start,End startEnd
    class DifficultySelection,TopicGeneration,TopicDisplay,PreparationTime,MicPermission,AudioSetup,AudioTest,AudioAdjust,RecordingStart,StopRecording,AudioProcessing,TranscriptAnalysis,ScoreCalculation,FeedbackDisplay,ViewHistory,ProgressMetrics,BackToCourse process
    class DifficultyLevel,UserReady,PermissionCheck,QualityCheck,RecordingActive,AnalysisAspects,SaveAudio decision
    class BeginnerTopic,IntermediateTopic,AdvancedTopic,AIAnalysis,FluencyAnalysis,CoherenceAnalysis,StructureAnalysis,LanguageAnalysis,GenerateFeedback aiProcess
    class PermissionError error
    class AudioSaved success
    class Recording,SpeechRecognition,RealTimeTranscript recording
```

## Diagrama de User Journey Completo

```mermaid
journey
    title User Journey - Aplicación de Habilidades Blandas
    
    section Descubrimiento
      Buscar plataforma de habilidades: 3: Usuario
      Encontrar aplicación: 4: Usuario
      Leer información: 4: Usuario
      
    section Registro
      Acceder a la aplicación: 5: Usuario
      Crear cuenta con Auth0: 4: Usuario
      Verificar email: 3: Usuario
      Completar perfil: 4: Usuario
      
    section Exploración
      Ver dashboard: 5: Usuario
      Explorar cursos disponibles: 5: Usuario
      Leer descripciones: 4: Usuario
      Seleccionar primer curso: 5: Usuario
      
    section Pensamiento Crítico
      Acceder al módulo: 5: Usuario
      Seleccionar tema de debate: 4: Usuario
      Leer contexto: 4: Usuario
      Escribir primer argumento: 3: Usuario
      Recibir respuesta de IA: 5: Usuario
      Continuar debate: 4: Usuario
      Completar 10 rondas: 3: Usuario
      Recibir feedback: 5: Usuario
      
    section Oratoria
      Acceder al módulo: 5: Usuario
      Seleccionar dificultad: 4: Usuario
      Leer tema generado: 4: Usuario
      Preparar discurso: 3: Usuario
      Configurar micrófono: 3: Usuario
      Grabar presentación: 4: Usuario
      Ver transcripción: 4: Usuario
      Recibir análisis: 5: Usuario
      
    section Seguimiento
      Ver reportes: 5: Usuario
      Analizar progreso: 4: Usuario
      Comparar calificaciones: 4: Usuario
      Planificar mejoras: 4: Usuario
      
    section Retención
      Regresar a la plataforma: 4: Usuario
      Practicar regularmente: 4: Usuario
      Ver mejoras: 5: Usuario
      Recomendar a otros: 5: Usuario
```

## Diagrama de Personas de Usuario

```mermaid
mindmap
  root((👥 Personas de Usuario))
    🌱 María González
      Estudiante Principiante
      20 años
      Objetivos
        Mejorar presentaciones
        Superar nervios
        Feedback específico
      Motivaciones
        Proyectos académicos
        Confianza personal
      Frustraciones
        Falta de práctica
        Sin retroalimentación
      Flujo Preferido
        Oratoria gradual
        Práctica privada
        
    🌿 Carlos Rodríguez
      Estudiante Avanzado
      22 años
      Objetivos
        Perfeccionar argumentación
        Competencias de debate
        Análisis profundo
      Motivaciones
        Competir en debates
        Liderazgo estudiantil
      Frustraciones
        Falta de oponentes
        Temas repetitivos
      Flujo Preferido
        Debates complejos
        Análisis detallado
        
    🌸 Ana Martínez
      Estudiante con Ansiedad
      19 años
      Objetivos
        Ganar confianza
        Preparar entrevistas
        Comunicación efectiva
      Motivaciones
        Futuro profesional
        Crecimiento personal
      Frustraciones
        Miedo al juicio
        Ansiedad social
      Flujo Preferido
        Práctica privada
        Feedback constructivo
        Progreso gradual
```

## Diagrama de Puntos de Contacto

```mermaid
graph LR
    subgraph "🌐 Canales Digitales"
        Web[💻 Aplicación Web]
        Mobile[📱 Responsive Mobile]
        Email[📧 Notificaciones Email]
    end
    
    subgraph "🎯 Puntos de Interacción"
        Landing[🏠 Landing Page]
        Auth[🔐 Autenticación]
        Dashboard[📊 Dashboard]
        Course[📚 Vista de Curso]
        Activity[🎯 Actividades]
        Feedback[📋 Feedback]
        Reports[📈 Reportes]
    end
    
    subgraph "🤖 Servicios de IA"
        OpenAI[🧠 OpenAI GPT-4o-mini]
        Groq[🦙 Groq Llama-3.3-70b]
        Speech[🗣️ Speech Recognition]
    end
    
    subgraph "👤 Experiencia del Usuario"
        Discovery[🔍 Descubrimiento]
        Onboarding[🚀 Onboarding]
        Learning[📚 Aprendizaje]
        Practice[🎯 Práctica]
        Progress[📈 Progreso]
        Retention[🔄 Retención]
    end
    
    %% Conexiones
    Web --> Landing
    Mobile --> Landing
    Landing --> Auth
    Auth --> Dashboard
    Dashboard --> Course
    Course --> Activity
    Activity --> Feedback
    Feedback --> Reports
    
    Activity --> OpenAI
    Activity --> Groq
    Activity --> Speech
    
    Discovery --> Onboarding
    Onboarding --> Learning
    Learning --> Practice
    Practice --> Progress
    Progress --> Retention
    Retention --> Learning
    
    %% Estilos
    classDef digital fill:#e3f2fd
    classDef interaction fill:#f3e5f5
    classDef ai fill:#fff3e0
    classDef experience fill:#e8f5e8
    
    class Web,Mobile,Email digital
    class Landing,Auth,Dashboard,Course,Activity,Feedback,Reports interaction
    class OpenAI,Groq,Speech ai
    class Discovery,Onboarding,Learning,Practice,Progress,Retention experience
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
    \includegraphics[width=\textwidth]{diagrama-flujo-usuario-principal.png}
    \caption{Flujo Principal de Usuario en la Aplicación}
    \label{fig:user-flow-main}
\end{figure}
```

### Diagramas recomendados para el Anexo E:
1. **Flujo Principal** - Vista general de navegación
2. **Flujo de Pensamiento Crítico** - Proceso detallado del módulo de debate
3. **Flujo de Oratoria** - Proceso detallado del módulo de voz
4. **User Journey** - Experiencia completa del usuario
5. **Personas** - Perfiles de usuarios objetivo
6. **Puntos de Contacto** - Mapa de interacciones del sistema 