# Instalación del Proyecto

## Requisitos Previos

- Python 3.x
- pip (gestor de paquetes de Python)

## Pasos para la Instalación

1. Clona el repositorio en tu máquina local:
    ```
    git clone https://github.com/tu-usuario/tu-repositorio.git
    ```

2. Navega al directorio del proyecto:
    ```
    cd tu-repositorio
    ```

3. (Opcional) Crea un entorno virtual para el proyecto:
    ```
    python -m venv venv
    source venv/bin/activate  # En Windows usa `venv\Scripts\activate`
    ```

4. Instala las dependencias del proyecto:
    ```
    pip install -r requirements.txt
    ```

5. Ejecuta el proyecto(Back):
    ```
    npm start
    ```      

7. La carpeta `databases` contiene las tablas necesarias para cargar una nueva base de datos en un servidor sql de tu gusto.      

8. Cambia las URLs en los archivos `.env` del backend y frontend para la instalación local o en un servidor distinto.
