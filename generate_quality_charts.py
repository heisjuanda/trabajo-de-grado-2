#!/usr/bin/env python3
"""
Script para generar gráficos de métricas de calidad
Anexo H - Reportes de Métricas de Calidad
"""

import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
from datetime import datetime
import os

# Configuración de estilo
plt.style.use('seaborn-v0_8')
sns.set_palette("husl")

def create_backend_coverage_chart():
    """Genera gráfico de cobertura del backend"""
    modules = ['debate_topics.py', 'oratory_topics.py', 'oratory_audio.py', 
               'activity.py', 'answer.py', 'comment.py', 'course.py', 'user.py']
    coverage = [86, 86, 33, 0, 0, 0, 0, 0]
    colors = ['#2ecc71' if c >= 80 else '#f39c12' if c >= 50 else '#e74c3c' for c in coverage]
    
    fig, ax = plt.subplots(figsize=(12, 8))
    bars = ax.barh(modules, coverage, color=colors)
    
    # Agregar valores en las barras
    for i, (bar, cov) in enumerate(zip(bars, coverage)):
        width = bar.get_width()
        ax.text(width + 1, bar.get_y() + bar.get_height()/2, 
                f'{cov}%', ha='left', va='center', fontweight='bold')
    
    ax.set_xlabel('Cobertura de Código (%)', fontsize=12, fontweight='bold')
    ax.set_title('Cobertura de Código Backend por Módulo\nAplicación de Habilidades Blandas', 
                 fontsize=14, fontweight='bold', pad=20)
    ax.set_xlim(0, 100)
    
    # Líneas de referencia
    ax.axvline(x=50, color='orange', linestyle='--', alpha=0.7, label='Mínimo Aceptable (50%)')
    ax.axvline(x=80, color='green', linestyle='--', alpha=0.7, label='Objetivo (80%)')
    
    ax.legend(loc='lower right')
    ax.grid(axis='x', alpha=0.3)
    
    plt.tight_layout()
    plt.savefig('backend_coverage_chart.png', dpi=300, bbox_inches='tight')
    plt.close()

def create_e2e_performance_chart():
    """Genera gráfico de rendimiento E2E"""
    tests = ['Debate IA\n(Pensamiento Crítico)', 'Oratoria\n(Análisis de Voz)']
    times = [16.451, 14.978]
    
    fig, ax = plt.subplots(figsize=(10, 6))
    bars = ax.bar(tests, times, color=['#3498db', '#9b59b6'], alpha=0.8)
    
    # Agregar valores en las barras
    for bar, time in zip(bars, times):
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., height + 0.2,
                f'{time:.1f}s', ha='center', va='bottom', fontweight='bold')
    
    ax.set_ylabel('Tiempo de Ejecución (segundos)', fontsize=12, fontweight='bold')
    ax.set_title('Rendimiento de Pruebas End-to-End\nTiempo de Ejecución por Flujo Crítico', 
                 fontsize=14, fontweight='bold', pad=20)
    
    # Línea de referencia
    ax.axhline(y=20, color='red', linestyle='--', alpha=0.7, label='Límite Máximo (20s)')
    ax.axhline(y=15, color='orange', linestyle='--', alpha=0.7, label='Objetivo (15s)')
    
    ax.legend()
    ax.grid(axis='y', alpha=0.3)
    ax.set_ylim(0, 25)
    
    plt.tight_layout()
    plt.savefig('e2e_performance_chart.png', dpi=300, bbox_inches='tight')
    plt.close()

def create_quality_summary_chart():
    """Genera gráfico resumen de calidad global"""
    categories = ['Backend\n(Módulos Críticos)', 'Frontend\n(Tests Unitarios)', 
                  'E2E\n(Flujos Críticos)', 'Estabilidad\nde Tests']
    scores = [86, 92, 100, 100]
    
    fig, ax = plt.subplots(figsize=(10, 8))
    
    # Crear gráfico de barras radial
    angles = np.linspace(0, 2 * np.pi, len(categories), endpoint=False)
    scores_rad = scores + [scores[0]]  # Cerrar el círculo
    angles_rad = np.concatenate((angles, [angles[0]]))
    
    ax = plt.subplot(111, projection='polar')
    ax.plot(angles_rad, scores_rad, 'o-', linewidth=2, color='#2ecc71')
    ax.fill(angles_rad, scores_rad, alpha=0.25, color='#2ecc71')
    
    ax.set_xticks(angles)
    ax.set_xticklabels(categories, fontsize=11)
    ax.set_ylim(0, 100)
    ax.set_yticks([20, 40, 60, 80, 100])
    ax.set_yticklabels(['20%', '40%', '60%', '80%', '100%'])
    ax.grid(True)
    
    plt.title('Resumen de Calidad Global del Proyecto\nCalificación: 94.5/100', 
              fontsize=14, fontweight='bold', pad=30)
    
    plt.tight_layout()
    plt.savefig('quality_summary_radar.png', dpi=300, bbox_inches='tight')
    plt.close()

def create_test_distribution_chart():
    """Genera gráfico de distribución de tests"""
    # Datos de tests
    test_types = ['Backend\nUnitarios', 'Frontend\nUnitarios', 'E2E\nCypress']
    test_counts = [17, 12, 2]
    colors = ['#e74c3c', '#3498db', '#2ecc71']
    
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))
    
    # Gráfico de barras
    bars = ax1.bar(test_types, test_counts, color=colors, alpha=0.8)
    for bar, count in zip(bars, test_counts):
        height = bar.get_height()
        ax1.text(bar.get_x() + bar.get_width()/2., height + 0.2,
                f'{count}', ha='center', va='bottom', fontweight='bold')
    
    ax1.set_ylabel('Número de Tests', fontsize=12, fontweight='bold')
    ax1.set_title('Distribución de Tests por Tipo', fontsize=12, fontweight='bold')
    ax1.grid(axis='y', alpha=0.3)
    
    # Gráfico de pastel
    ax2.pie(test_counts, labels=test_types, colors=colors, autopct='%1.1f%%',
            startangle=90, textprops={'fontsize': 10})
    ax2.set_title('Proporción de Tests Implementados', fontsize=12, fontweight='bold')
    
    plt.tight_layout()
    plt.savefig('test_distribution_chart.png', dpi=300, bbox_inches='tight')
    plt.close()

def create_coverage_trend_chart():
    """Genera gráfico de tendencia de cobertura"""
    modules = ['debate_topics', 'oratory_topics', 'oratory_audio', 'otros_módulos']
    lines_total = [78, 118, 24, 227]
    lines_covered = [67, 102, 8, 0]
    coverage_pct = [86, 86, 33, 0]
    
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 10))
    
    # Gráfico de líneas de código
    x = np.arange(len(modules))
    width = 0.35
    
    bars1 = ax1.bar(x - width/2, lines_total, width, label='Total Líneas', 
                    color='lightblue', alpha=0.7)
    bars2 = ax1.bar(x + width/2, lines_covered, width, label='Líneas Cubiertas', 
                    color='darkblue', alpha=0.8)
    
    ax1.set_xlabel('Módulos', fontsize=12, fontweight='bold')
    ax1.set_ylabel('Líneas de Código', fontsize=12, fontweight='bold')
    ax1.set_title('Líneas de Código vs Cobertura por Módulo', fontsize=12, fontweight='bold')
    ax1.set_xticks(x)
    ax1.set_xticklabels(modules, rotation=45, ha='right')
    ax1.legend()
    ax1.grid(axis='y', alpha=0.3)
    
    # Gráfico de porcentaje de cobertura
    colors = ['#2ecc71' if c >= 80 else '#f39c12' if c >= 50 else '#e74c3c' for c in coverage_pct]
    bars = ax2.bar(modules, coverage_pct, color=colors, alpha=0.8)
    
    for bar, pct in zip(bars, coverage_pct):
        height = bar.get_height()
        ax2.text(bar.get_x() + bar.get_width()/2., height + 1,
                f'{pct}%', ha='center', va='bottom', fontweight='bold')
    
    ax2.set_xlabel('Módulos', fontsize=12, fontweight='bold')
    ax2.set_ylabel('Cobertura (%)', fontsize=12, fontweight='bold')
    ax2.set_title('Porcentaje de Cobertura por Módulo', fontsize=12, fontweight='bold')
    ax2.set_xticklabels(modules, rotation=45, ha='right')
    ax2.set_ylim(0, 100)
    ax2.grid(axis='y', alpha=0.3)
    
    plt.tight_layout()
    plt.savefig('coverage_trend_chart.png', dpi=300, bbox_inches='tight')
    plt.close()

def main():
    """Función principal para generar todos los gráficos"""
    print("🎯 Generando Reportes de Métricas de Calidad - Anexo H")
    print("=" * 60)
    
    # Crear directorio para gráficos si no existe
    if not os.path.exists('quality_charts'):
        os.makedirs('quality_charts')
    
    os.chdir('quality_charts')
    
    print("📊 Generando gráfico de cobertura backend...")
    create_backend_coverage_chart()
    
    print("⚡ Generando gráfico de rendimiento E2E...")
    create_e2e_performance_chart()
    
    print("🎯 Generando gráfico resumen de calidad...")
    create_quality_summary_chart()
    
    print("📈 Generando gráfico de distribución de tests...")
    create_test_distribution_chart()
    
    print("📉 Generando gráfico de tendencia de cobertura...")
    create_coverage_trend_chart()
    
    print("\n✅ Todos los gráficos generados exitosamente!")
    print(f"📁 Ubicación: {os.getcwd()}")
    print("\nArchivos generados:")
    for file in os.listdir('.'):
        if file.endswith('.png'):
            print(f"  - {file}")
    
    print(f"\n📅 Fecha de generación: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}")

if __name__ == "__main__":
    main() 