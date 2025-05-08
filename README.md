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

## Documentación Adicional

Para más información sobre el uso de la plataforma, consulta el archivo `Manual de uso.pdf` incluido en este repositorio.
