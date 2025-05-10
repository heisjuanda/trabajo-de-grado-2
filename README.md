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
![Debate-ia](https://github.com/user-attachments/assets/e310fc1a-fa82-43ca-b50a-fd623fbfe0e9)
### Oratoria IA
![Oratoria](https://github.com/user-attachments/assets/144c8772-0851-413b-8f63-1da2017aade4)
### Juan Dabot
![JuanDaBot (2)](https://github.com/user-attachments/assets/4133c711-89c5-4728-9380-db0d61dde77d)
### Base de Datos
![DbFlow](https://github.com/user-attachments/assets/385ff8e1-8258-4987-b53b-6d80ee732820)

