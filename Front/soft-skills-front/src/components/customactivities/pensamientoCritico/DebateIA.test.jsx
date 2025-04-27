import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import DebateIA from './DebateIA';
import axios from 'axios';
import { toast } from 'react-toastify';

// Mock de constantes
jest.mock('./constantes/debateIdeas', () => ({
  ALL_IDEAS: {
    politica: {
      option: 'Política',
      description: 'Descripción de política',
      value: 'politica',
      icon: 'icon-path'
    }
  }
}));

// Mock de react-router-dom useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Mock de axios
jest.mock('axios');

// Mock de react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn()
  },
  ToastContainer: () => <div data-testid="toast-container" />
}));

// Mock de helpers
jest.mock('./helpers/helpers', () => ({
  setSessionStorageValue: jest.fn(),
  removeSessionStorageValue: jest.fn()
}));

// Mock de componentes
jest.mock('./components/Nav/Nav', () => () => <div>Nav</div>);
jest.mock('./components/InputSelection/InputSelection', () => ({ options, onSelect }) => (
  <div data-testid="input-selection">
    <select data-testid="select-topic" onChange={(e) => onSelect(e.target.value)}>
      <option value="">Seleccionar</option>
      <option value="politica">Política</option>
    </select>
  </div>
));
jest.mock('./components/Button/Button', () => {
  return ({ onclick, disabled, content, loadingState }) => (
    <button 
      data-testid="debate-button" 
      onClick={onclick} 
      disabled={!disabled} // En el componente real es !disabled || loadingState
    >
      {loadingState ? 'Cargando...' : content}
    </button>
  );
});
jest.mock('./components/BoxInfo/BoxInfo', () => ({ topic }) => (
  <div data-testid="box-info">Info del tema: {topic || ''}</div>
));
jest.mock('../oratoria/components/JuanDabot/JuanDabot', () => () => <div>Bot</div>);

// Configuración de API
process.env.REACT_APP_API_HOST = 'http://localhost:3000';

describe('DebateIA Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza el componente correctamente', () => {
    render(
      <MemoryRouter>
        <DebateIA />
      </MemoryRouter>
    );

    expect(screen.getByText('Empezar Nuevo Debate')).toBeInTheDocument();
    expect(screen.getByTestId('input-selection')).toBeInTheDocument();
    expect(screen.getByTestId('debate-button')).toBeInTheDocument();
  });

  test('habilita el botón cuando se selecciona un tema', () => {
    render(
      <MemoryRouter>
        <DebateIA />
      </MemoryRouter>
    );

    const selectTopic = screen.getByTestId('select-topic');
    // Inicialmente el botón está deshabilitado porque topic es null
    expect(screen.getByTestId('debate-button')).toBeDisabled();
    
    // Al seleccionar un tema, el botón debe habilitarse
    fireEvent.change(selectTopic, { target: { value: 'politica' } });
    expect(screen.getByTestId('debate-button')).not.toBeDisabled();
  });

  test('redirige a la página de inicio del debate cuando se obtiene un tema exitosamente', async () => {
    // Configurar el mock de axios para devolver datos de tema
    axios.get.mockResolvedValue({
      data: {
        id: 1,
        question: '¿Es la política importante?'
      }
    });

    render(
      <MemoryRouter>
        <DebateIA />
      </MemoryRouter>
    );

    // Seleccionar un tema
    const selectTopic = screen.getByTestId('select-topic');
    fireEvent.change(selectTopic, { target: { value: 'politica' } });
    
    // Ahora el botón debe estar habilitado
    const button = screen.getByTestId('debate-button');
    expect(button).not.toBeDisabled();
    
    // Hacer clic en el botón para generar debate
    fireEvent.click(button);
    
    // Verificar que se llama a axios.get con la URL correcta
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/debate-topics/politica');
    });
    
    // Verificar que se redirige a la página correcta
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/activity/debate-ia/topic-start');
    });
  });

  test('muestra un mensaje de error cuando falla la obtención del tema', async () => {
    // Configurar el mock de axios para simular un error
    axios.get.mockRejectedValue(new Error('Error de red'));

    render(
      <MemoryRouter>
        <DebateIA />
      </MemoryRouter>
    );

    // Seleccionar un tema
    const selectTopic = screen.getByTestId('select-topic');
    fireEvent.change(selectTopic, { target: { value: 'politica' } });
    
    // Hacer clic en el botón para generar debate
    fireEvent.click(screen.getByTestId('debate-button'));
    
    // Verificar que se muestra un mensaje de error
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
}); 