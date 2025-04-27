import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import OratoryReport from './OratoryReport';
import axios from 'axios';

// Mock de auth0
jest.mock('@auth0/auth0-react', () => ({
  useAuth0: jest.fn()
}));

// Mock de axios
jest.mock('axios');

// Mock de react-router-dom useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Mock de react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn()
  },
  ToastContainer: () => <div data-testid="toast-container" />
}));

// Mock de componentes
jest.mock('../../components/Nav/Nav', () => () => <div>Nav</div>);
jest.mock('../../components/Section/Section', () => ({ title, content }) => (
  <div data-testid={`section-${title.toLowerCase().replace(/\s+/g, '-')}`}>
    <h3>{title}</h3>
    <p>{content}</p>
  </div>
));

// Mock del componente Button con botones habilitados para las pruebas
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

// Mock para window.open
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
    // Configurar el estado de Auth0 como cargando
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
    // Configurar el estado de Auth0 como no autenticado
    const { useAuth0 } = require('@auth0/auth0-react');
    useAuth0.mockReturnValue({
      isLoading: false,
      isAuthenticated: false,
      user: null
    });

    // Mockear toast.error para verificar que se llamó
    const { toast } = require('react-toastify');

    render(
      <MemoryRouter initialEntries={['/']}>
        <OratoryReport />
      </MemoryRouter>
    );

    // Verificar que se muestra el mensaje de error a través de toast
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Debes iniciar sesión para ver tu historial.");
    });
  });

  test('muestra mensaje cuando no hay grabaciones', async () => {
    // Configurar el estado de Auth0 como autenticado
    const { useAuth0 } = require('@auth0/auth0-react');
    useAuth0.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      user: { email: 'test@example.com' }
    });

    // Configurar axios para devolver un array vacío
    axios.get.mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter initialEntries={['/']}>
        <OratoryReport />
      </MemoryRouter>
    );

    // Esperar a que se complete la carga
    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    // Verificar que se muestra el mensaje de no hay grabaciones
    expect(screen.getByText('No se encontraron grabaciones.')).toBeInTheDocument();
    expect(screen.getByTestId('button-volver-a-oratoria')).toBeInTheDocument();
  });

  test('muestra las grabaciones cuando existen', async () => {
    // Configurar el estado de Auth0 como autenticado
    const { useAuth0 } = require('@auth0/auth0-react');
    useAuth0.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      user: { email: 'test@example.com' }
    });

    // Configurar axios para devolver grabaciones
    axios.get.mockResolvedValueOnce({ data: mockRecordings });

    render(
      <MemoryRouter initialEntries={['/']}>
        <OratoryReport />
      </MemoryRouter>
    );

    // Esperar a que se complete la carga
    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    // Verificar que se muestran las grabaciones
    expect(screen.getByText('Historial de Grabaciones de Oratoria')).toBeInTheDocument();
    
    // Verificar que se muestran los detalles de las grabaciones usando getAllByText en lugar de getByText
    expect(screen.getAllByText(/Grabación del/)[0]).toBeInTheDocument();
    expect(screen.getByText('8/10')).toBeInTheDocument();
    
    // Buscar el texto de duración usando una función para manejar texto fragmentado
    expect(screen.getByText((content, element) => {
      return element.tagName.toLowerCase() === 'p' && 
             element.classList.contains('recording-duration') && 
             content.includes('65 segundos');
    })).toBeInTheDocument();
    
    // Verificar que existen los botones para escuchar grabaciones
    expect(screen.getAllByTestId('button-escuchar-grabación')).toHaveLength(2);
  });

  test('abre la URL de la grabación al hacer clic en el botón escuchar', async () => {
    // Configurar el estado de Auth0 como autenticado
    const { useAuth0 } = require('@auth0/auth0-react');
    useAuth0.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      user: { email: 'test@example.com' }
    });

    // Resetear el mock de window.open
    window.open = jest.fn();

    // Configurar axios para devolver grabaciones con URL de audio válida
    axios.get.mockResolvedValueOnce({ 
      data: [{
        ...mockRecordings[0],
        audio_url: 'valid-audio-url'
      }]
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <OratoryReport />
      </MemoryRouter>
    );

    // Esperar a que se complete la carga
    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    // Hacer clic en el botón para escuchar la grabación
    const button = screen.getByTestId('button-escuchar-grabación');
    fireEvent.click(button);

    // Verificar que se intenta abrir la URL correcta
    expect(window.open).toHaveBeenCalled();
  });

  test('muestra un mensaje de error si falla la obtención de grabaciones', async () => {
    // Configurar el estado de Auth0 como autenticado
    const { useAuth0 } = require('@auth0/auth0-react');
    useAuth0.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      user: { email: 'test@example.com' }
    });

    // Configurar axios para devolver un error
    const errorMessage = 'Error al obtener las grabaciones';
    axios.get.mockRejectedValueOnce(new Error(errorMessage));

    render(
      <MemoryRouter initialEntries={['/']}>
        <OratoryReport />
      </MemoryRouter>
    );

    // Esperar a que se complete la carga
    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    // Verificar que se muestra el mensaje de error
    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    expect(screen.getByText('Volver a Oratoria')).toBeInTheDocument();
  });

  test('navega a oratoria al hacer clic en el botón volver', async () => {
    // Configurar el estado de Auth0 como autenticado
    const { useAuth0 } = require('@auth0/auth0-react');
    useAuth0.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      user: { email: 'test@example.com' }
    });

    // Configurar axios para devolver grabaciones
    axios.get.mockResolvedValueOnce({ data: mockRecordings });

    render(
      <MemoryRouter initialEntries={['/']}>
        <OratoryReport />
      </MemoryRouter>
    );

    // Esperar a que se complete la carga
    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    // Hacer clic en el botón volver
    fireEvent.click(screen.getByTestId('button-volver-a-oratoria'));

    // Verificar que navega a la ruta correcta
    expect(mockNavigate).toHaveBeenCalledWith('/activity/oratoria');
  });

  test('cambia de página al hacer clic en los botones de paginación', async () => {
    // Crear un array con más de 3 grabaciones para activar la paginación
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

    // Configurar el estado de Auth0 como autenticado
    const { useAuth0 } = require('@auth0/auth0-react');
    useAuth0.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      user: { email: 'test@example.com' }
    });

    // Configurar axios para devolver muchas grabaciones
    axios.get.mockResolvedValueOnce({ data: manyRecordings });

    render(
      <MemoryRouter initialEntries={['/']}>
        <OratoryReport />
      </MemoryRouter>
    );

    // Esperar a que se complete la carga
    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    // Verificar que estamos en la página 1
    expect(screen.getByText('Página 1 de 2')).toBeInTheDocument();

    // Hacer clic en el botón de siguiente página
    fireEvent.click(screen.getByText('→'));

    // Verificar que cambiamos a la página 2
    expect(screen.getByText('Página 2 de 2')).toBeInTheDocument();

    // Hacer clic en el botón de página anterior
    fireEvent.click(screen.getByText('←'));

    // Verificar que volvemos a la página 1
    expect(screen.getByText('Página 1 de 2')).toBeInTheDocument();
  });
}); 