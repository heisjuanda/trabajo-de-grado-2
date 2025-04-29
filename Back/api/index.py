from fastapi import Request
import sys
import os
import logging
import traceback

# Configuración de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("vercel_app")

# Añadir la ruta del proyecto al path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Importar la aplicación principal
try:
    from main import app
    logger.info("Aplicación principal importada correctamente")
except Exception as e:
    logger.error(f"Error al importar la aplicación principal: {e}")
    logger.error(traceback.format_exc())
    from fastapi import FastAPI
    app = FastAPI()
    
    @app.get("/")
    async def error_root():
        return {
            "error": "Error al inicializar la aplicación", 
            "details": str(e),
            "traceback": traceback.format_exc()
        }

# Punto de entrada para Vercel
def handler(request):
    logger.info(f"Recibida solicitud: {request.url.path}")
    try:
        return app
    except Exception as e:
        logger.error(f"Error en el handler: {e}")
        logger.error(traceback.format_exc())
        return app 