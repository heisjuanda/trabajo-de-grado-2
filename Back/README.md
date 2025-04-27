# Backend de Soft Skills

Este es el backend para la aplicación de Soft Skills, desarrollado con FastAPI.

## Estructura del proyecto

```
Back/
├── main.py             # Punto de entrada principal
├── requirements.txt    # Dependencias del proyecto
├── vercel.json         # Configuración para despliegue en Vercel
├── api/                # Carpeta para funciones serverless de Vercel
│   └── vercel.py       # Adaptador para Vercel
├── service/            # Servicios de negocio
└── database.py         # Configuración de la base de datos
```

## Despliegue en Vercel

### Requisitos previos

1. Tener una cuenta en [Vercel](https://vercel.com)
2. Tener el código en un repositorio de GitHub

### Pasos para desplegar

1. Sube tu código a un repositorio de GitHub (si aún no lo has hecho)

2. Inicia sesión en Vercel y selecciona "Import Project"

3. Selecciona "Import Git Repository" y proporciona la URL de tu repositorio

4. Configura el proyecto en Vercel:
   - **Framework Preset**: Other
   - **Root Directory**: `Back` (si tu backend está en esta carpeta)
   - **Build Command**: Deja en blanco
   - **Output Directory**: Deja en blanco
   - **Install Command**: `pip install -r requirements.txt`

5. Configura las variables de entorno necesarias:
   - `GROG_API`: Tu clave API de Groq
   - `GROG_API_WHISPER`: Tu clave API de Groq para Whisper

6. Haz clic en "Deploy"

### Verificación del despliegue

Una vez desplegado, podrás acceder a tu API en la URL proporcionada por Vercel, generalmente `https://tu-proyecto.vercel.app`.

Para verificar que todo funciona correctamente, intenta acceder a:
- `https://tu-proyecto.vercel.app/docs` - Documentación de la API

## Configuración del frontend

Después de desplegar el backend, necesitarás actualizar la URL de la API en tu frontend:

1. En tu proyecto de frontend, crea un archivo `.env.production` con:
   ```
   REACT_APP_API_HOST=https://tu-backend.vercel.app
   ```

2. Despliega tu frontend siguiendo los pasos similares para tu proyecto Front.

## Solución de problemas

- **CORS**: Si tienes problemas de CORS, asegúrate de que la URL de tu frontend esté correctamente configurada en la lista de `origins` en el middleware CORS.
- **Rutas**: Si alguna ruta no funciona, comprueba que los endpoints estén correctamente definidos en tu aplicación FastAPI.
- **Límites de Vercel**: Ten en cuenta que el plan gratuito de Vercel tiene límites en cuanto a duración de ejecución y tamaño de las respuestas. 