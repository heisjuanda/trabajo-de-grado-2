# Diagrama de Arquitectura Frontend - Aplicación de Habilidades Blandas

## Descripción General
La aplicación React está estructurada en capas con una arquitectura modular que separa responsabilidades y facilita el mantenimiento.

## Estructura de Capas

### 1. Capa de Enrutamiento (App.js)
```
App.js (Router Principal)
├── Rutas de Autenticación
│   ├── / (SignIn)
│   ├── /signin (SignIn)
│   └── /signup (SignUp)
├── Rutas Principales
│   ├── /dashboard (Dashboard)
│   ├── /courses/:id (Course)
│   └── /activity/:id (Activity)
└── Rutas de Actividades Personalizadas
    ├── /activity/debate-ia/* (Pensamiento Crítico)
    ├── /activity/oratoria/* (Oratoria)
    └── /activity/* (Otras actividades)
```

### 2. Capa de Componentes Principales

#### Dashboard Component
```
Dashboard.js
├── ResponsiveAppBar (Navegación)
├── ProfileInDashboard (Perfil de usuario)
├── Material-UI Theme Provider
├── Course Cards Grid
│   ├── Card con imagen específica por curso
│   ├── Filtrado por IDs permitidos [253, 270]
│   └── Navegación a Course/:id
└── Funciones auxiliares
    ├── getCourseImage()
    ├── getCourseTitle()
    └── getCourseDescription()
```

#### Course Component
```
Course.js
├── ResponsiveAppBar (Navegación)
├── Header con imagen de fondo
├── Grid Layout (8/4)
│   ├── Columna Principal (8)
│   │   ├── Información del curso
│   │   ├── Sistema de pestañas
│   │   │   ├── Tab: Actividades
│   │   │   └── Tab: Discusión (Comments)
│   │   └── Lista de actividades
│   └── Columna Lateral (4)
│       ├── Video específico por curso
│       ├── Información del instructor
│       └── Botones de navegación
├── Funciones auxiliares
│   ├── getActivityIcon()
│   ├── getCourseImage()
│   └── getCourseVideo()
└── Carga paralela con Promise.all()
```

### 3. Capa de Actividades Personalizadas

#### Módulo de Pensamiento Crítico
```
pensamientoCritico/
├── DebateIA.jsx (Componente principal)
├── views/
│   ├── DebateStart/ (Inicio de debate)
│   ├── MainDebate/ (Debate principal)
│   └── DebateReport/ (Reportes)
├── components/
│   ├── Chat/
│   │   ├── Chat.jsx (Sistema de chat)
│   │   └── Message/ (Componentes de mensaje)
│   ├── DebateReport/
│   │   └── ReportDetail.jsx
│   └── Loader/ (Componente de carga)
└── helpers/
    └── helpers.js (Utilidades)
```

#### Módulo de Oratoria
```
oratoria/
├── views/
│   ├── OratorIA/ (IA de oratoria)
│   ├── OratoryStart/ (Inicio)
│   ├── MainOratory/ (Principal)
│   ├── OratoryMaterial/ (Material)
│   ├── OratoryFeedback/ (Retroalimentación)
│   └── OratoryReport/ (Reportes)
└── Integración con Speech Recognition API
```

### 4. Capa de Componentes Compartidos

#### Navegación y Layout
```
Componentes Compartidos
├── ResponsiveAppBar/ (Barra de navegación)
├── ProfileInDashboard/ (Perfil en dashboard)
├── Comments/ (Sistema de comentarios)
├── Activity/ (Actividad genérica)
└── Autenticación
    ├── SignIn/ (Inicio de sesión)
    └── SignUp/ (Registro)
```

### 5. Capa de Servicios y Estado

#### Gestión de Estado
```
Estado y Servicios
├── React Hooks (useState, useEffect)
├── Auth0 (useAuth0)
├── React Router (useParams, Link, Navigate)
├── Axios (Comunicación con API)
├── Session Storage (Persistencia local)
└── Material-UI Theme Provider
```

#### Integración con APIs
```
API Integration
├── Backend FastAPI
│   ├── /courses (Cursos)
│   ├── /activity (Actividades)
│   ├── /debate-topics (Pensamiento crítico)
│   ├── /oratory-topics (Oratoria)
│   └── /oratory-audio (Audio de oratoria)
├── OpenAI API (GPT-4o-mini)
├── Groq API (Llama-3.3-70b)
└── Speech Recognition API
```

### 6. Capa de Recursos y Assets

#### Recursos Estáticos
```
Resources
├── icons/
│   ├── dashDebateIA.png (Pensamiento crítico)
│   ├── dashOratorIA.png (Oratoria)
│   └── juandabot.png (Default)
├── CSS Modules
└── Material-UI Components
```

## Flujo de Datos

### 1. Flujo de Autenticación
```
Usuario → SignIn → Auth0 → Dashboard → Cursos
```

### 2. Flujo de Navegación Principal
```
Dashboard → Course → Activity → Módulos Específicos
```

### 3. Flujo de Pensamiento Crítico
```
Course → DebateIA → DebateStart → MainDebate → Chat → DebateReport
```

### 4. Flujo de Oratoria
```
Course → OratorIA → OratoryStart → MainOratory → OratoryFeedback → OratoryReport
```

## Tecnologías Utilizadas

### Core
- **React.js 18+** - Framework principal
- **React Router v6** - Enrutamiento
- **Material-UI v5** - Sistema de diseño
- **Axios** - Cliente HTTP

### Autenticación y Estado
- **Auth0** - Autenticación
- **React Hooks** - Gestión de estado local
- **Session Storage** - Persistencia

### APIs y Servicios
- **Speech Recognition API** - Reconocimiento de voz
- **FastAPI Backend** - API REST
- **OpenAI/Groq** - Servicios de IA

### Herramientas de Desarrollo
- **Create React App** - Configuración inicial
- **Jest + React Testing Library** - Testing
- **Cypress** - Pruebas E2E

## Patrones de Diseño Implementados

1. **Component Composition** - Composición de componentes reutilizables
2. **Container/Presentational** - Separación de lógica y presentación
3. **Higher-Order Components** - ThemeProvider, Auth0Provider
4. **Custom Hooks** - Lógica reutilizable
5. **Module Pattern** - Organización por funcionalidad
6. **Observer Pattern** - useEffect para efectos secundarios

## Características de Arquitectura

### Escalabilidad
- Estructura modular por funcionalidad
- Componentes reutilizables
- Separación clara de responsabilidades

### Mantenibilidad
- Código organizado por características
- Funciones auxiliares centralizadas
- Configuración de tema centralizada

### Performance
- Lazy loading de componentes
- Carga paralela de datos
- Optimización de re-renders

### Accesibilidad
- Material-UI con soporte ARIA
- Navegación por teclado
- Contraste de colores adecuado 