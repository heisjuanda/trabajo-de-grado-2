from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

# Crear una aplicación FastAPI simple
app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Aplicación FastAPI funcionando en Vercel"}

@app.get("/api/hello")
async def hello():
    return {"message": "¡Hola desde la API de Vercel!"}

# Punto de entrada para Vercel
def handler(request):
    return app 