# Trabajo de Grado 2 - Plataforma de Habilidades Blandas

## Aplicación en Producción

Puedes acceder a la aplicación en el siguiente enlace:
[https://trabajo-de-grado-2-front.vercel.app/](https://trabajo-de-grado-2-front.vercel.app/)

## Requisitos Previos

### Para el Backend:
- Python 3.9+
- pip (gestor de paquetes de Python)
- Servidor SQL (MySQL, PostgreSQL, etc.)

### Para el Frontend:
- Node.js (v16+)
- npm o yarn

## Estructura del Proyecto

El proyecto está dividido en dos partes principales:
- `Back/`: Backend desarrollado con FastAPI
- `Front/soft-skills-front/`: Frontend desarrollado con React

## Instalación en Entorno Local

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/tu-repositorio.git
cd tu-repositorio
```

### 2. Configurar el Backend

1. Navegar al directorio del backend:
   ```bash
   cd Back
   ```

2. Crear y activar un entorno virtual:
   ```bash
   python -m venv venv
   # En Windows:
   venv\Scripts\activate
   # En Linux/Mac:
   source venv/bin/activate
   ```

3. Instalar dependencias:
   ```bash
   pip install -r requirements.txt
   ```

4. Configurar la base de datos:
   - Crear una base de datos en tu servidor SQL
   - Importar las tablas desde la carpeta `DataBases/`
   - Configurar las variables de entorno en un archivo `.env` (basado en los valores de `config.py`)

5. Iniciar el servidor de desarrollo:
   ```bash
   python main.py
   ```
    o
   ```bash
   uvicorn main:app --reload
   ```

### 3. Configurar el Frontend

1. Navegar al directorio del frontend:
   ```bash
   cd Front/soft-skills-front
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   - Crear un archivo `.env` en la raíz del directorio frontend
   - Configurar la URL del backend (ejemplo: `REACT_APP_API_URL=http://localhost:8000`)

4. Iniciar el servidor de desarrollo:
   ```bash
   npm start
   ```

5. Acceder a la aplicación en tu navegador:
   ```
   http://localhost:3000
   ```

## Pruebas Unitarias y de Integración

### Pruebas del Backend

El backend utiliza pytest para ejecutar las pruebas unitarias.

1. Asegúrate de tener activado el entorno virtual:
   ```bash
   cd Back
   # Si no está activado Linux/Mac:
   source venv/bin/activate 
   # o Windows:
   venv\Scripts\activate
   ```

2. Instalar dependencias de pruebas si aún no lo has hecho:
   ```bash
   pip install pytest pytest-cov
   ```

3. Ejecutar todas las pruebas:
   ```bash
   python -m pytest
   ```

4. Para ejecutar pruebas con detalles:
   ```bash
   python -m pytest -v
   ```

5. Para ejecutar pruebas específicas:
   ```bash
   python -m pytest tests/test_debate_topics.py -v
   python -m pytest tests/test_oratory_topics.py -v
   ```

6. Para ejecutar pruebas con cobertura:
   ```bash
   python -m pytest --cov=service tests/
   ```

### Pruebas del Frontend

El frontend utiliza Jest y React Testing Library para las pruebas.

1. Navegar al directorio del frontend:
   ```bash
   cd Front/soft-skills-front
   ```

2. Ejecutar todas las pruebas:
   ```bash
   npm test
   ```

3. Ejecutar pruebas en modo watch (desarrollo):
   ```bash
   npm test -- --watch
   ```

4. Ejecutar pruebas con cobertura:
   ```bash
   npm test -- --coverage
   ```

5. Para ejecutar un archivo de prueba específico:
   ```bash
   npm test -- src/components/__tests__/MiComponente.test.js
   ```

## Configuración para Producción

Para desplegar la aplicación en un entorno de producción:

1. En el frontend:
   ```bash
   npm run build
   ```

2. En el backend, asegúrate de configurar correctamente:
   - Variables de entorno para producción
   - Servidor WSGI/ASGI (Gunicorn/Hypercorn)
   - Configuraciones de seguridad adecuadas

# Documentación Adicional

## Diagramas 
### Dashboard
![dashboard](https://github.com/user-attachments/assets/f37d2c05-17dd-4249-9a5b-3c6f2b0cd00f)
### Debate IA
![debateIa](https://github.com/user-attachments/assets/5fd3a498-7d2c-4ffd-8e99-d7057bd6656a)
### Oratoria IA
![oratoria](https://github.com/user-attachments/assets/bf6f6361-d328-4824-a49c-d15d2a7ab7ba)
### Juan Dabot
![JuanDaBot (2)](https://github.com/user-attachments/assets/4133c711-89c5-4728-9380-db0d61dde77d)
### Base de Datos
![DbFlow](https://github.com/user-attachments/assets/385ff8e1-8258-4987-b53b-6d80ee732820)

## WereFrames
### Debate IA
![Tesis juanda drawio (1)](https://github.com/user-attachments/assets/c809370e-9603-41a9-a75a-baba943c33ef)
### Oratoria IA
![Tesis juanda drawio](https://github.com/user-attachments/assets/34495c29-d0c5-477a-b45e-1088bc3edccd)
### Debate IA MAIN
```bash
+-------------------------------------------------------------------------------------------------------------------+
| [Logo/Dashboard]     [Inicio]     [Debates]     [Reportes]                                                       |
+-------------------------------------------------------------------------------------------------------------------+

                                  +---------------------------------------------+
                                  |     Desarrolla Tus Habilidades De          |
                                  |         Pensamiento Crítico                |
                                  +---------------------------------------------+
                                  | Texto descriptivo breve sobre el           |
                                  | pensamiento crítico.                       |
                                  +---------------------------------------------+

                  +-------------------------------------------------------------+
                  |       Herramientas de Aprendizaje Interactivo               |
                  +-------------------------------------------------------------+

+-----------------------------+   +-----------------------------+   +-----------------------------+
| [🧠 Icono Debate IA]         |   | [🎥 Icono Videos]            |   | [🧩 Icono Puzzles]           |
| Debate IA                   |   | Videos                      |   | Puzzles                     |
| Breve descripción sobre     |   | Breve descripción sobre     |   | Breve descripción sobre     |
| debates con IA.             |   | videos y su contenido.      |   | puzzles y juegos.           |
|                             |   |                             |   |                             |
| +-------------------------+ |   | +-------------------------+ |   | +-------------------------+ |
| |     Empezar Debate      | |   | |        Ver Ahora        | |   | |      Jugar Juegos       | |
| +-------------------------+ |   | +-------------------------+ |   | +-------------------------+ |
+-----------------------------+   +-----------------------------+   +-----------------------------+

                                                                    +--------------------------+
                                                                    | [💬 Icono Chat]           |
                                                                    | ¿Tienes dudas o quieres  |
                                                                    | consejos? Chatea...      |
                                                                    +--------------------------+
```
### Debate IA Start
```bash
+-------------------------------------------------------------------------------------------------------------------+
| [Logo/Dashboard]  [Inicio]  [Discursos]  [Reportes]                                                               |
+-------------------------------------------------------------------------------------------------------------------+

                                  +---------------------------------------------+
                                  |           Empezar Nuevo Discurso            |
                                  +---------------------------------------------+

                                  Dificultad:
                                  +---------------------------------------------+
                                  | [-- Seleccionar --]                      ▼ |
                                  +---------------------------------------------+

                                  +---------------------------------------------+
                                  |              Empezar discurso               |
                                  +---------------------------------------------+


                                  +---------------------------------------------+
                                  | [💡]                                        |
                                  |                                             |
                                  |  (Selecciona un Tema para mostrar su título)|
                                  |                                             |
                                  |  Descripción del Tema                       |
                                  |  (Selecciona un Tema para mostrar la        |
                                  |   descripción)                              |
                                  +---------------------------------------------+


                                                                    +--------------------------+
                                                                    | [Icono Avatar]           |
                                                                    | ¿Tienes dudas o quieres  |
                                                                    | consejos? Chatea...      |
                                                                    +--------------------------+
```
### Debate IA Reports
```bash
+-------------------------------------------------------------------------------------------------------------------+
| [Logo/Dashboard]  [Inicio]  [Discursos]  [Reportes]                                                               |
+-------------------------------------------------------------------------------------------------------------------+

                +---------------------------------------------------+ +---------------------+
                |        Historial de Grabaciones de Oratoria       | |    Ver Métricas     |
                +---------------------------------------------------+ +---------------------+


                                           Ordenar por: [ Fecha (más reciente primero) ▼ ]


+-------------------------------------------------------------------------------------------------------------------+
|                                                                      Grabación del DD/MM/AAAA, HH:MM (a/p). m.    |
| Calificación: X/10                                                                  Duración: X segundos          |
|                                                                                                                   |
|   +-----------------------------------------------------------------------------------------------------------+   |
|   | ► Ver transcripción                                                                                       |   |
|   +-----------------------------------------------------------------------------------------------------------+   |
|                                                                                                                   |
|   +-----------------------------------------------------------------------------------------------------------+   |
|   | ► Ver análisis detallado                                                                                  |   |
|   +-----------------------------------------------------------------------------------------------------------+   |
|                                                                                                                   |
|   +-------------------------------------+                                                                       |
|   |        Escuchar grabación         |                                                                       |
|   +-------------------------------------+                                                                       |
+-------------------------------------------------------------------------------------------------------------------+

+-------------------------------------------------------------------------------------------------------------------+
|                                                                      Grabación del DD/MM/AAAA, HH:MM (a/p). m.    |
| Calificación: Y/10                                                                  Duración: Y segundos          |
|                                                                                                                   |
|   +-----------------------------------------------------------------------------------------------------------+   |
|   | ► Ver transcripción                                                                                       |   |
|   +-----------------------------------------------------------------------------------------------------------+   |
|                                                                                                                   |
|   ( ... estructura similar para análisis y botón ... )                                                            |
|                                                                                                                   |
+-------------------------------------------------------------------------------------------------------------------+
  (...)


                                                                                       +--------------------------+
                                                                                       | [Icono Avatar]           |
                                                                                       | ¿Tienes dudas o quieres  |
                                                                                       | consejos? Chatea...      |
                                                                                       +--------------------------+
                                                                                       
```
### Oratoria IA Main
```bash
+-------------------------------------------------------------------------------------------------------------------+
| [Logo/Dashboard]  [Inicio]  [Discursos]  [Reportes]                                                               |
+-------------------------------------------------------------------------------------------------------------------+

                                  +---------------------------------------------+
                                  |      Desarrolla Tus Habilidades De          |
                                  |      Oratoria                               |
                                  +---------------------------------------------+
                                  +---------------------------------------------+
                                  |   Texto descriptivo breve sobre la          |
                                  |   oratoria y sus técnicas.                  |
                                  +---------------------------------------------+


                  +-------------------------------------------------------------+
                  |            Herramientas de Aprendizaje Interactivo          |
                  +-------------------------------------------------------------+


+-----------------------------+  +-----------------------------+  +-----------------------------+
| [🎤] INTERACTIVO            |  | [▶️] EDUCACIÓN              |  | [🗣️] INTERACTIVO            |
|                             |  |                             |  |                             |
| Retos de Discurso           |  | Videos de Oratoria          |  | Ejercicios de Oratoria      |
|                             |  |                             |  |                             |
| Breve descripción sobre     |  | Breve descripción sobre     |  | Breve descripción sobre     |
| retos de discurso.          |  | videos y su contenido.      |  | ejercicios de oratoria.     |
|                             |  |                             |  |                             |
| +-------------------------+ |  | +-------------------------+ |  | +-------------------------+ |
| |     Comenzar Reto       | |  | |        Ver Ahora        | |  | |        Practicar        | |
| +-------------------------+ |  | +-------------------------+ |  | +-------------------------+ |
+-----------------------------+  +-----------------------------+  +-----------------------------+


                                                                    +--------------------------+
                                                                    | [Icono Avatar]           |
                                                                    | ¿Tienes dudas o quieres  |
                                                                    | consejos? Chatea...      |
                                                                    +--------------------------+
```
### Oratoria Start
```bash
+-------------------------------------------------------------------------------------------------------------------+
| [Logo/Dashboard]  [Inicio]  [Discursos]  [Reportes]                                                               |
+-------------------------------------------------------------------------------------------------------------------+

                                  +---------------------------------------------+
                                  |           Empezar Nuevo Discurso            |
                                  +---------------------------------------------+

                                  Dificultad:
                                  +---------------------------------------------+
                                  | [-- Seleccionar --]                      ▼ |
                                  +---------------------------------------------+

                                  +---------------------------------------------+
                                  |              Empezar discurso               |
                                  +---------------------------------------------+


                                  +---------------------------------------------+
                                  | [💡]                                        |
                                  |                                             |
                                  |  (Selecciona un Tema para mostrar su título)|
                                  |                                             |
                                  |  Descripción del Tema                       |
                                  |  (Selecciona un Tema para mostrar la        |
                                  |   descripción)                              |
                                  +---------------------------------------------+


                                                                    +--------------------------+
                                                                    | [Icono Avatar]           |
                                                                    | ¿Tienes dudas o quieres  |
                                                                    | consejos? Chatea...      |
                                                                    +--------------------------+
```
### Debate IA Reports
```bash
+----------------------------------------------------------------------------------------------------+
| [Logo/App Name (Opcional)]  Dashboard   Inicio    Discursos    Reportes                          |
+----------------------------------------------------------------------------------------------------+

                                Historial de Grabaciones de Oratoria

                                                                      [Botón: Ver Métricas]

                                                           Ordenar por: [Dropdown: Fecha (más reciente primero) v]

+----------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   Calificación: X/10                                             Grabación del DD/MM/AAAA, HH:MM  |
|                                                                                       Duración: X segundos |
|                                                                                                  |
|    > Ver transcripción                                                                           |
|                                                                                                  |
|    > Ver análisis detallado                                                                      |
|                                                                                                  |
|    [Botón: Escuchar grabación]                                                                   |
|                                                                                                  |
+----------------------------------------------------------------------------------------------------+

+----------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   Calificación: Y/10                                             Grabación del DD/MM/AAAA, HH:MM  |
|                                                                                       Duración: Y segundos |
|                                                                                                  |
|    > Ver transcripción                                                                           |
|                                                                                                  |
|    > Ver análisis detallado                                                                      |
|                                                                                                  |
|    [Botón: Escuchar grabación]                                                                   |
|                                                                                                  |
+----------------------------------------------------------------------------------------------------+

(... más elementos de la lista ...)


                                                                      +------------------------------+
                                                                      | [Icono Chat]  ¿Tienes dudas? |
                                                                      |               Chatea con...  |
                                                                      +------------------------------+
```
