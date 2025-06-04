import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

# Configurar matplotlib para usar fuentes compatibles
plt.rcParams['font.family'] = 'DejaVu Sans'
plt.rcParams['figure.facecolor'] = 'white'

# Datos de la encuesta (respuestas válidas sin la primera fila vacía)
datos_encuesta = [
    # [H1, H2, H3, H4, H5, H6, H7, H8, H9, H10]
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],  # paula.bohorquez
    [4, 5, 4, 5, 4, 4, 4, 5, 4, 4],  # juan.m.gomez
    [5, 5, 4, 5, 4, 5, 5, 4, 4, 5],  # santiago.arboleda
    [4, 5, 5, 5, 4, 4, 4, 5, 4, 5],  # jose.castano
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],  # giljuancamilo39
    [4, 4, 5, 4, 3, 4, 3, 5, 3, 4],  # manuela.delgado
    [4, 5, 4, 5, 4, 5, 5, 5, 4, 4],  # samuel.romero
    [5, 5, 5, 5, 4, 5, 5, 5, 5, 5],  # karen.sofia.lopez
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],  # agudelo.samuel
    [4, 4, 4, 4, 3, 4, 4, 4, 4, 4],  # andresjlopez55
    [4, 4, 3, 5, 3, 4, 4, 5, 3, 5],  # ordonez.kevin
    [4, 4, 4, 4, 4, 4, 5, 5, 4, 5],  # heisjuanda
    [4, 4, 4, 4, 4, 4, 4, 4, 4, 4],  # jdmoreno
    [4, 5, 5, 5, 3, 5, 5, 4, 4, 4],  # tionanadocelu
]

# Nombres de las heurísticas completas
heuristicas_completas = [
    "Visibilidad del estado del sistema",
    "Correspondencia entre sistema y mundo real", 
    "Control y libertad del usuario",
    "Consistencia y estándares",
    "Prevención de errores",
    "Reconocimiento antes que recuerdo",
    "Flexibilidad y eficiencia de uso",
    "Estética y diseño minimalista",
    "Ayuda a reconocer y recuperarse de errores",
    "Ayuda y documentación"
]

# Nombres cortos para las gráficas
heuristicas_cortas = [
    "Visibilidad del estado",
    "Lenguaje y símbolos",
    "Control y libertad", 
    "Consistencia",
    "Prevención de errores",
    "Reconocimiento vs recuerdo",
    "Flexibilidad y eficiencia",
    "Estética y minimalismo",
    "Mensajes de error",
    "Ayuda y documentación"
]

# Calcular promedios por heurística
df = pd.DataFrame(datos_encuesta)
promedios = df.mean().round(2).tolist()

print("=== REPORTE DE EVALUACIÓN HEURÍSTICA DE NIELSEN ===")
print(f"Total de respuestas válidas: {len(datos_encuesta)}")
print("\nPromedios por heurística:")
for i, (heuristica, promedio) in enumerate(zip(heuristicas_completas, promedios)):
    print(f"{i+1}. {heuristica}: {promedio}")

# Función para crear gráfico de barras
def crear_grafico_barras():
    plt.figure(figsize=(12, 8))
    bars = plt.barh(range(len(heuristicas_cortas)), promedios, color='#1976d2', alpha=0.8)
    
    plt.yticks(range(len(heuristicas_cortas)), heuristicas_cortas)
    plt.xlabel('Promedio (escala 1-5)', fontsize=12)
    plt.title('Evaluación Heurística de Nielsen\nPromedio por Criterio', fontsize=14, fontweight='bold')
    plt.xlim(0, 5)
    plt.grid(axis='x', linestyle='--', alpha=0.7)
    
    # Agregar valores en las barras
    for i, (bar, score) in enumerate(zip(bars, promedios)):
        plt.text(bar.get_width() + 0.05, bar.get_y() + bar.get_height()/2, 
                f'{score:.2f}', va='center', fontweight='bold')
    
    # Línea de referencia en 4.0
    plt.axvline(x=4.0, color='red', linestyle='--', alpha=0.5, label='Referencia (4.0)')
    plt.legend()
    
    plt.tight_layout()
    plt.savefig('heuristica_nielsen_barras.png', dpi=300, bbox_inches='tight')
    print("✓ Gráfico de barras guardado como 'heuristica_nielsen_barras.png'")

# Función para crear gráfico de radar
def crear_grafico_radar():
    # Nombres más cortos para el radar
    labels_radar = [
        "Visibilidad", "Lenguaje", "Control", "Consistencia", "Prevención",
        "Reconocimiento", "Flexibilidad", "Estética", "Errores", "Ayuda"
    ]
    
    # Ángulos para el radar (agregar el primer punto al final para cerrar el círculo)
    angles = np.linspace(0, 2 * np.pi, len(labels_radar), endpoint=False).tolist()
    promedios_radar = promedios + [promedios[0]]  # Cerrar el círculo
    angles += [angles[0]]
    
    fig, ax = plt.subplots(figsize=(8, 8), subplot_kw=dict(polar=True))
    
    # Crear el gráfico
    ax.plot(angles, promedios_radar, 'o-', linewidth=2, color='#1976d2', label='Evaluación')
    ax.fill(angles, promedios_radar, alpha=0.25, color='#1976d2')
    
    # Personalizar el gráfico
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(labels_radar)
    ax.set_ylim(0, 5)
    ax.set_yticks([1, 2, 3, 4, 5])
    ax.set_yticklabels(['1', '2', '3', '4', '5'])
    ax.grid(True)
    
    plt.title('Evaluación Heurística de Nielsen\nGráfico Radar', size=14, fontweight='bold', pad=20)
    
    plt.tight_layout()
    plt.savefig('heuristica_nielsen_radar.png', dpi=300, bbox_inches='tight')
    print("✓ Gráfico radar guardado como 'heuristica_nielsen_radar.png'")

# Función para mostrar estadísticas adicionales
def mostrar_estadisticas():
    print(f"\n=== ESTADÍSTICAS ADICIONALES ===")
    print(f"Promedio general: {np.mean(promedios):.2f}")
    print(f"Heurística mejor evaluada: {heuristicas_cortas[np.argmax(promedios)]} ({max(promedios)})")
    print(f"Heurística con menor puntuación: {heuristicas_cortas[np.argmin(promedios)]} ({min(promedios)})")
    
    # Clasificar por rangos
    excelente = [h for h, p in zip(heuristicas_cortas, promedios) if p >= 4.5]
    bueno = [h for h, p in zip(heuristicas_cortas, promedios) if 4.0 <= p < 4.5]
    mejorable = [h for h, p in zip(heuristicas_cortas, promedios) if p < 4.0]
    
    print(f"\nClasificación por desempeño:")
    print(f"Excelente (≥4.5): {len(excelente)} heurísticas")
    for h in excelente: print(f"  - {h}")
    print(f"Bueno (4.0-4.4): {len(bueno)} heurísticas") 
    for h in bueno: print(f"  - {h}")
    print(f"Mejorable (<4.0): {len(mejorable)} heurísticas")
    for h in mejorable: print(f"  - {h}")

# Ejecutar todas las funciones
if __name__ == "__main__":
    try:
        mostrar_estadisticas()
        print(f"\n=== GENERANDO GRÁFICAS ===")
        crear_grafico_barras()
        crear_grafico_radar()
        print(f"\n✓ ¡Gráficas generadas exitosamente!")
        print(f"✓ Archivos creados:")
        print(f"  - heuristica_nielsen_barras.png") 
        print(f"  - heuristica_nielsen_radar.png")
        
    except Exception as e:
        print(f"❌ Error al generar las gráficas: {e}")
        print("Asegúrate de tener instalados: pip install matplotlib pandas numpy") 