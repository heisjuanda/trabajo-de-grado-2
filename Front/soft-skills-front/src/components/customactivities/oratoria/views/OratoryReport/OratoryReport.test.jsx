import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import OratoryReport from './OratoryReport';
import axios from 'axios';

jest.mock('@auth0/auth0-react', () => ({
  useAuth0: jest.fn()
}));

jest.mock('axios');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn()
  },
  ToastContainer: () => <div data-testid="toast-container" />
}));

jest.mock('../../components/Nav/Nav', () => () => <div>Nav</div>);
jest.mock('../../components/Section/Section', () => ({ title, content }) => (
  <div data-testid={`section-${title.toLowerCase().replace(/\s+/g, '-')}`}>
    <h3>{title}</h3>
    <p>{content}</p>
  </div>
));

jest.mock('../../../pensamientoCritico/components/Button/Button', () => {
  return function MockButton({ onclick, content, typeStyle }) {
    return (
      <button 
        data-testid={`button-${content.replace(/\s+/g, '-').toLowerCase()}`}
        onClick={onclick}
        disabled={false}
        className={typeStyle}
      >
        {content}
      </button>
    );
  };
});

jest.mock('../../../pensamientoCritico/components/Loader/Loader', () => () => (
  <div data-testid="loader">Cargando...</div>
));

jest.mock('../../../pensamientoCritico/components/PerformanceMetrics/PerformanceMetrics', () => {
  return function MockPerformanceMetrics({ reports }) {
    return <div data-testid="performance-metrics">Métricas de rendimiento</div>;
  };
});

global.open = jest.fn();

describe('OratoryReport Component', () => {
  const mockRecordings = [
    {
      id: 1,
      created_at: '2023-05-15T10:00:00Z',
      calification: 8,
      duration_ms: 65000,
      audio_url: 'audio-url-1',
      feedback: JSON.stringify({
        transcripcion_whisper: 'Transcripción del audio 1',
        resumen: 'Resumen del discurso 1',
        sentimiento: 'Positivo',
        temas_clave: 'Liderazgo, comunicación'
      })
    },
    {
      id: 2,
      created_at: '2023-05-16T11:00:00Z',
      calification: 9,
      duration_ms: 75000,
      audio_url: 'audio-url-2',
      feedback: JSON.stringify({
        transcripcion_whisper: 'Transcripción del audio 2',
        resumen: 'Resumen del discurso 2',
        sentimiento: 'Muy positivo',
        temas_clave: 'Trabajo en equipo, innovación'
      })
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.REACT_APP_API_HOST = 'http://localhost:3000';
  });

  test('muestra el loader mientras se está cargando', () => {
    const { useAuth0 } = require('@auth0/auth0-react');
    useAuth0.mockReturnValue({
      isLoading: true,
      isAuthenticated: false,
      user: null
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <OratoryReport />
      </MemoryRouter>
    );

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  test('muestra mensaje de error si el usuario no está autenticado', async () => {
    const { useAuth0 } = require('@auth0/auth0-react');
    useAuth0.mockReturnValue({
      isLoading: false,
      isAuthenticated: false,
      user: null
    });

    const { toast } = require('react-toastify');

    render(
      <MemoryRouter initialEntries={['/']}>
        <OratoryReport />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Debes iniciar sesión para ver tu historial.");
    });
  });

  test('muestra mensaje cuando no hay grabaciones', async () => {
    const { useAuth0 } = require('@auth0/auth0-react');
    useAuth0.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      user: { email: 'test@example.com' }
    });

    axios.get.mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter initialEntries={['/']}>
        <OratoryReport />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    expect(screen.getByText('No se encontraron grabaciones.')).toBeInTheDocument();
    expect(screen.getByTestId('button-volver-a-oratoria')).toBeInTheDocument();
  });

  test('muestra las grabaciones cuando existen', async () => {
    const { useAuth0 } = require('@auth0/auth0-react');
    useAuth0.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      user: { email: 'test@example.com' }
    });

    axios.get.mockResolvedValue({ data: mockRecordings });

    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <OratoryReport />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    expect(axios.get).toHaveBeenCalled();

    expect(screen.getByText('Historial de Grabaciones de Oratoria')).toBeInTheDocument();
    
    expect(screen.getByText('Ordenar por:')).toBeInTheDocument();
    expect(screen.getByText('Fecha (más reciente primero)')).toBeInTheDocument();

    expect(screen.getByTestId('button-volver-a-oratoria')).toBeInTheDocument();
      
    const sortSelect = screen.getByLabelText('Ordenar por:');
    fireEvent.change(sortSelect, { target: { value: 'date-asc' } });
    
    await waitFor(() => {
      const recordingItems = container.querySelectorAll('.recording-item');
      expect(recordingItems.length).toBeGreaterThan(0);
    });
  });

  test('abre la URL de la grabación al hacer clic en el botón escuchar', async () => {
    const { useAuth0 } = require('@auth0/auth0-react');
    useAuth0.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      user: { email: 'test@example.com' }
    });

    window.open = jest.fn();

    axios.get.mockResolvedValueOnce({ 
      data: [{
        ...mockRecordings[0],
        audio_url: 'valid-audio-url'
      }]
    });

    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <OratoryReport />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });
    
    await waitFor(() => {
      const buttons = screen.getAllByTestId('button-escuchar-grabación');
      expect(buttons.length).toBeGreaterThan(0);
      
      fireEvent.click(buttons[0]);
      
      expect(window.open).toHaveBeenCalled();
    });
  });

  test('muestra un mensaje de error si falla la obtención de grabaciones', async () => {
    const { useAuth0 } = require('@auth0/auth0-react');
    useAuth0.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      user: { email: 'test@example.com' }
    });

    const errorMessage = 'Error al obtener las grabaciones';
    axios.get.mockRejectedValueOnce(new Error(errorMessage));

    render(
      <MemoryRouter initialEntries={['/']}>
        <OratoryReport />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    expect(screen.getByText('Volver a Oratoria')).toBeInTheDocument();
  });

  test('navega a oratoria al hacer clic en el botón volver', async () => {
    const { useAuth0 } = require('@auth0/auth0-react');
    useAuth0.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      user: { email: 'test@example.com' }
    });

    axios.get.mockResolvedValueOnce({ data: mockRecordings });

    render(
      <MemoryRouter initialEntries={['/']}>
        <OratoryReport />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('button-volver-a-oratoria'));

    expect(mockNavigate).toHaveBeenCalledWith('/activity/oratoria');
  });

  test('cambia de página al hacer clic en los botones de paginación', async () => {
    const manyRecordings = [
      ...mockRecordings,
      {
        id: 3,
        created_at: '2023-05-17T12:00:00Z',
        calification: 7,
        duration_ms: 55000,
        audio_url: 'audio-url-3',
        feedback: JSON.stringify({
          transcripcion_whisper: 'Transcripción del audio 3',
          resumen: 'Resumen del discurso 3',
          sentimiento: 'Neutro',
          temas_clave: 'Gestión, planificación'
        })
      },
      {
        id: 4,
        created_at: '2023-05-18T13:00:00Z',
        calification: 6,
        duration_ms: 45000,
        audio_url: 'audio-url-4',
        feedback: JSON.stringify({
          transcripcion_whisper: 'Transcripción del audio 4',
          resumen: 'Resumen del discurso 4',
          sentimiento: 'Neutro',
          temas_clave: 'Aprendizaje, mejora'
        })
      }
    ];

    const { useAuth0 } = require('@auth0/auth0-react');
    useAuth0.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      user: { email: 'test@example.com' }
    });

    axios.get.mockResolvedValueOnce({ data: manyRecordings });

    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <OratoryReport />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });
    
    await waitFor(() => {
      const paginationElement = container.querySelector('.pagination');
      expect(paginationElement).not.toBeNull();
    });
    
    await waitFor(() => {
      const buttons = container.querySelectorAll('.pagination button');
      expect(buttons.length).toBe(2);
      
      fireEvent.click(buttons[1]); 
      
      fireEvent.click(buttons[0]); 
    });
  });
}); 