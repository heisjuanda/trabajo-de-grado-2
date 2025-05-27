# Diagramas de Flujos de Usuario - Aplicación de Habilidades Blandas

## Descripción General
Los flujos de usuario mapean las interacciones completas desde el ingreso hasta la finalización de actividades en la plataforma de habilidades blandas. Se enfocan en los dos módulos principales: Pensamiento Crítico y Oratoria.

## Flujos Principales de Usuario

### 1. Flujo de Autenticación y Onboarding

#### User Journey: Primer Acceso
```
Usuario Nuevo → Landing Page → Registro → Verificación → Dashboard → Exploración de Cursos
```

#### Puntos de Contacto:
- **Entrada**: URL de la aplicación
- **Registro**: Auth0 con email/password o social login
- **Bienvenida**: Dashboard con cursos disponibles
- **Orientación**: Tooltips y guías visuales

#### Objetivos del Usuario:
- Acceder a la plataforma de manera segura
- Entender qué cursos están disponibles
- Comenzar su primer módulo de aprendizaje

### 2. Flujo Principal del Dashboard

#### User Journey: Navegación Principal
```
Login → Dashboard → Selección de Curso → Vista de Curso → Selección de Actividad → Módulo Específico
```

#### Decisiones del Usuario:
- **Curso de Oratoria (ID: 253)**: Desarrollo de habilidades de comunicación
- **Curso de Pensamiento Crítico (ID: 270)**: Desarrollo de análisis y argumentación

#### Elementos de Interfaz:
- Tarjetas de curso con imágenes específicas
- Información del instructor (Juan David Moreno Alfonso)
- Botones de acción claros ("Ver más")
- Diseño responsivo para diferentes dispositivos

### 3. Flujo de Pensamiento Crítico

#### User Journey: Módulo de Debate con IA
```
Curso → Actividad Debate IA → Selección de Tema → Inicio de Debate → Chat Interactivo → Feedback Final → Reporte
```

#### Pasos Detallados:

**Paso 1: Selección de Tema**
- Usuario accede al módulo de pensamiento crítico
- Sistema presenta temas de debate aleatorios
- Usuario selecciona un tema de interés

**Paso 2: Configuración del Debate**
- Sistema explica las reglas (máximo 10 rondas)
- Usuario lee el contexto del tema
- Comienza la primera ronda

**Paso 3: Interacción con IA**
- Usuario escribe su argumento inicial
- IA responde con contraargumento (estrategia adaptativa por ronda)
- Ciclo se repite hasta completar 10 rondas o usuario decide terminar

**Paso 4: Generación de Feedback**
- Sistema analiza todo el historial del debate
- IA genera feedback estructurado con:
  - Aspectos positivos
  - Áreas de mejora
  - Sugerencias específicas
  - Calificación final (0-10)

**Paso 5: Reporte y Seguimiento**
- Usuario puede ver su reporte completo
- Historial de debates anteriores
- Progreso en habilidades de argumentación

#### Puntos de Fricción Identificados:
- Tiempo de respuesta de la IA
- Complejidad de algunos temas
- Longitud del proceso (10 rondas)

#### Soluciones Implementadas:
- Indicadores de carga visual
- Temas graduados por dificultad
- Opción de terminar antes de las 10 rondas

### 4. Flujo de Oratoria

#### User Journey: Módulo de Análisis de Voz
```
Curso → Actividad Oratoria → Selección de Tema → Preparación → Grabación → Análisis → Feedback → Reporte
```

#### Pasos Detallados:

**Paso 1: Generación de Tema**
- Usuario selecciona nivel de dificultad (1-5)
- IA genera tema específico para práctica
- Usuario tiene tiempo para prepararse

**Paso 2: Configuración de Grabación**
- Sistema solicita permisos de micrófono
- Verificación de calidad de audio
- Instrucciones de grabación

**Paso 3: Grabación de Discurso**
- Usuario graba su presentación
- Speech Recognition API transcribe en tiempo real
- Indicadores visuales de grabación activa

**Paso 4: Análisis Automático**
- IA analiza transcripción para:
  - Fluidez y coherencia
  - Estructura del discurso
  - Uso del lenguaje
  - Claridad de ideas

**Paso 5: Feedback Personalizado**
- Calificación numérica
- Comentarios específicos sobre mejoras
- Sugerencias de práctica
- Comparación con intentos anteriores

**Paso 6: Almacenamiento y Seguimiento**
- Audio guardado como BLOB en base de datos
- Historial de grabaciones
- Métricas de progreso temporal

#### Consideraciones Técnicas:
- Calidad del micrófono del usuario
- Ruido ambiente
- Duración óptima de grabación
- Formatos de audio soportados

### 5. Flujo de Comentarios y Discusión

#### User Journey: Interacción Social
```
Vista de Curso → Pestaña Discusión → Lectura de Comentarios → Escribir Comentario → Publicación → Interacción
```

#### Funcionalidades:
- Sistema de comentarios por curso
- Moderación automática
- Respuestas anidadas
- Notificaciones de nuevos comentarios

### 6. Flujo de Reportes y Seguimiento

#### User Journey: Análisis de Progreso
```
Actividad Completada → Generación de Reporte → Vista de Métricas → Comparación Histórica → Planificación de Mejoras
```

#### Métricas Disponibles:
- Calificaciones por módulo
- Tiempo invertido en actividades
- Progreso en habilidades específicas
- Tendencias de mejora

## Personas de Usuario

### Persona 1: Estudiante de Ingeniería Principiante
- **Nombre**: María González
- **Edad**: 20 años
- **Objetivo**: Mejorar habilidades de presentación para proyectos académicos
- **Motivación**: Superar nervios al hablar en público
- **Frustración**: Falta de retroalimentación específica en presentaciones
- **Flujo Preferido**: Oratoria → Práctica gradual → Feedback detallado

### Persona 2: Estudiante Avanzado en Debate
- **Nombre**: Carlos Rodríguez
- **Edad**: 22 años
- **Objetivo**: Perfeccionar técnicas de argumentación
- **Motivación**: Participar en competencias de debate
- **Frustración**: Falta de oponentes para practicar
- **Flujo Preferido**: Pensamiento Crítico → Debates complejos → Análisis profundo

### Persona 3: Estudiante con Ansiedad Social
- **Nombre**: Ana Martínez
- **Edad**: 19 años
- **Objetivo**: Ganar confianza en comunicación oral
- **Motivación**: Prepararse para entrevistas de trabajo
- **Frustración**: Miedo al juicio de otros
- **Flujo Preferido**: Práctica privada → Feedback constructivo → Progreso gradual

## Escenarios de Uso

### Escenario 1: Preparación para Presentación Académica
**Contexto**: Estudiante debe presentar proyecto final
**Flujo**:
1. Accede al módulo de Oratoria
2. Selecciona tema relacionado con su proyecto
3. Practica múltiples veces
4. Analiza feedback para mejorar
5. Graba versión final para autoevaluación

### Escenario 2: Práctica de Argumentación
**Contexto**: Estudiante quiere mejorar en debates académicos
**Flujo**:
1. Entra al módulo de Pensamiento Crítico
2. Selecciona tema controversial
3. Debate con IA durante 10 rondas
4. Recibe feedback sobre lógica argumentativa
5. Repite con diferentes temas para diversificar

### Escenario 3: Seguimiento de Progreso
**Contexto**: Estudiante quiere ver su evolución
**Flujo**:
1. Accede a sección de reportes
2. Compara calificaciones históricas
3. Identifica áreas de mejora
4. Planifica próximas sesiones de práctica
5. Establece metas específicas

## Puntos de Dolor y Soluciones

### Problemas Identificados:
1. **Tiempo de carga de IA**: Usuarios esperan respuestas inmediatas
2. **Complejidad de temas**: Algunos temas pueden ser muy avanzados
3. **Falta de variedad**: Repetición de temas similares
4. **Feedback genérico**: Comentarios poco específicos

### Soluciones Implementadas:
1. **Indicadores de progreso**: CircularProgress y estados de carga
2. **Niveles de dificultad**: Temas graduados por complejidad
3. **Algoritmo de variación**: Selección aleatoria de temas
4. **IA contextual**: Feedback basado en análisis específico del usuario

## Métricas de Éxito

### Métricas Cuantitativas:
- Tiempo promedio de sesión: 15-20 minutos
- Tasa de finalización de actividades: >80%
- Mejora en calificaciones: +2 puntos promedio
- Retención de usuarios: >70% después de 1 semana

### Métricas Cualitativas:
- Satisfacción del usuario: Escala SUS >70
- Percepción de mejora: >85% reporta mejoras
- Facilidad de uso: >90% completa tareas sin ayuda
- Relevancia del contenido: >80% considera útil el feedback

## Oportunidades de Mejora

### Funcionalidades Futuras:
1. **Modo Colaborativo**: Debates entre usuarios reales
2. **Gamificación**: Sistema de puntos y logros
3. **Análisis de Video**: Evaluación de lenguaje corporal
4. **Integración con Calendario**: Recordatorios de práctica
5. **Exportación de Reportes**: PDF para portafolios académicos

### Optimizaciones de UX:
1. **Onboarding Interactivo**: Tutorial paso a paso
2. **Personalización**: Temas basados en carrera del estudiante
3. **Modo Offline**: Práctica sin conexión a internet
4. **Accesibilidad**: Soporte para lectores de pantalla
5. **Responsive Design**: Optimización para móviles 