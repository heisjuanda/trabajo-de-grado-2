import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import DebateReport from './DebateReport';
import axios from 'axios';

// Mock de axios más específico
jest.mock('axios');

// Mockear react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn()
  },
  ToastContainer: () => <div data-testid="toast-container" />
}));

// Mockear auth0 con un objeto user completo
jest.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    isAuthenticated: true,
    user: { 
      email: 'test@example.com', 
      name: 'Test User',
      given_name: 'Test',
      picture: 'https://example.com/pic.jpg'
    }
  })
}));

// Mockear componentes
jest.mock('../../components/Nav/Nav', () => () => <div>Nav</div>);
jest.mock('../../components/Report/Report', () => ({ id }) => <div data-testid={`report-${id}`}>Report {id}</div>);
jest.mock('../../components/Loader/Generic', () => () => <div data-testid="loader">Loading...</div>);
jest.mock('../../components/DebateReport/ReportDetail', () => () => <div>Report Detail</div>);
jest.mock('../../../oratoria/components/JuanDabot/JuanDabot', () => () => <div>Bot</div>);

// Configuración de API
process.env.REACT_APP_API_HOST = 'http://localhost:3000';

describe('DebateReport Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Configurar el mock de axios.get antes de cada prueba
    axios.get.mockResolvedValue({
      data: [
        { id: 1, created_at: '2023-06-15', rating: 8 },
        { id: 2, created_at: '2023-06-16', rating: 9 }
      ]
    });
  });

  test('renderiza el componente correctamente', async () => {
    // Renderizar con MemoryRouter
    render(
      <MemoryRouter>
        <DebateReport />
      </MemoryRouter>
    );

    // Esperar a que se resuelva la promesa de axios
    await waitFor(() => {
      expect(screen.getByText('Reportes Recientes')).toBeInTheDocument();
    });
  });
}); 