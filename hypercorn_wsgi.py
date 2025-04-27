import sys
import os

# Ruta a tu aplicación
path = '/home/hellojuanda/trabajo-de-grado-2/Back'
if path not in sys.path:
    sys.path.append(path)

# Configuración de variables de entorno
os.environ['GROG_API'] = 'tu_api_key_aqui'
os.environ['GROG_API_WHISPER'] = 'tu_api_key_whisper_aqui'

# Importamos nuestra aplicación FastAPI
from main import app

# Creamos un adaptador WSGI usando Hypercorn
from hypercorn.middleware import AsyncioWSGIMiddleware

# Envolvemos nuestra aplicación FastAPI en el adaptador WSGI
application = AsyncioWSGIMiddleware(app) 