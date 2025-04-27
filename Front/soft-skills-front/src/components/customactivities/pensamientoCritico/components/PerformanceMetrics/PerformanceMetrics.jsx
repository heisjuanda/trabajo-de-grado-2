import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './PerformanceMetrics.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PerformanceMetrics = ({ reports }) => {
  const chartData = useMemo(() => {
    if (!reports || reports.length === 0) return null;

    const lastReports = [...reports]
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      .slice(-20);

    const labels = lastReports.map(report => {
      const date = new Date(report.created_at);
      return date.toLocaleDateString();
    });

    const ratings = lastReports.map(report => report.rating);

    const movingAverage = [];
    const windowSize = 3;
    
    for (let i = 0; i < ratings.length; i++) {
      const windowStart = Math.max(0, i - windowSize + 1);
      const window = ratings.slice(windowStart, i + 1);
      const avg = window.reduce((sum, val) => sum + val, 0) / window.length;
      movingAverage.push(Math.round(avg * 10) / 10);
    }

    return {
      labels,
      datasets: [
        {
          label: 'Calificación',
          data: ratings,
          borderColor: '#4285F4',
          backgroundColor: 'rgba(66, 133, 244, 0.2)',
          tension: 0.3,
          pointRadius: 4,
          pointBackgroundColor: '#4285F4',
        },
        {
          label: 'Tendencia',
          data: movingAverage,
          borderColor: '#34A853',
          backgroundColor: 'rgba(52, 168, 83, 0.1)',
          borderDash: [5, 5],
          tension: 0.5,
          pointRadius: 0,
        }
      ]
    };
  }, [reports]);

  const stats = useMemo(() => {
    if (!reports || reports.length === 0) return null;

    const ratings = reports.map(report => report.rating);
    const average = ratings.reduce((sum, val) => sum + val, 0) / ratings.length;
    const max = Math.max(...ratings);
    const min = Math.min(...ratings);
    
    const sorted = [...reports].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    
    let improvement = 0;
    if (sorted.length >= 6) {
      const firstThree = sorted.slice(0, 3).map(r => r.rating);
      const lastThree = sorted.slice(-3).map(r => r.rating);
      
      const firstAvg = firstThree.reduce((sum, val) => sum + val, 0) / 3;
      const lastAvg = lastThree.reduce((sum, val) => sum + val, 0) / 3;
      
      improvement = lastAvg - firstAvg;
    }

    return {
      average: Math.round(average * 10) / 10,
      max,
      min,
      improvement: Math.round(improvement * 10) / 10,
      totalReports: reports.length
    };
  }, [reports]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Progreso de Rendimiento',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          title: function(tooltipItems) {
            return `Fecha: ${tooltipItems[0].label}`;
          },
          label: function(context) {
            return `${context.dataset.label}: ${context.raw}/10`;
          }
        }
      }
    },
    scales: {
      y: {
        min: 0,
        max: 10,
        title: {
          display: true,
          text: 'Calificación'
        },
        ticks: {
          stepSize: 1
        }
      },
      x: {
        title: {
          display: true,
          text: 'Fecha'
        }
      }
    }
  };

  if (!reports || reports.length === 0) {
    return (
      <div className="performance-metrics-container">
        <h3>Métricas de Rendimiento</h3>
        <p className="no-data-message">No hay suficientes datos para mostrar métricas de rendimiento.</p>
      </div>
    );
  }

  return (
    <div className="performance-metrics-container">
      <h3>Métricas de Rendimiento</h3>
      
      <div className="stats-cards">
        <div className="stat-card">
          <span className="stat-value">{stats.average}</span>
          <span className="stat-label">Promedio</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.max}</span>
          <span className="stat-label">Máximo</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.min}</span>
          <span className="stat-label">Mínimo</span>
        </div>
        <div className="stat-card improvement">
          <span className="stat-value" style={{ color: stats.improvement > 0 ? '#34A853' : (stats.improvement < 0 ? '#EA4335' : '#9AA0A6') }}>
            {stats.improvement > 0 ? '+' : ''}{stats.improvement}
          </span>
          <span className="stat-label">Mejora</span>
        </div>
      </div>
      
      {chartData && (
        <div className="chart-container">
          <Line data={chartData} options={options} />
        </div>
      )}
      
      <p className="metrics-note">
        * Mostrando los últimos {Math.min(20, reports.length)} reportes de un total de {stats.totalReports}
      </p>
    </div>
  );
};

export default PerformanceMetrics; 