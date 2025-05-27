import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import OratorIA from './OratorIA';
import axios from 'axios';
import { toast } from 'react-toastify';

// Mock de constantes
jest.mock('../../constantes/constants', () => ({
  ALL_DIFFICULTIES: {
    facil: {
      option: 'Fácil',
      description: 'Nivel principiante',
      value: 'facil',
      icon: 'icon-path'
    },
    intermedio: {
      option: 'Intermedio',
      description: 'Nivel medio',
      value: 'intermedio',
      icon: 'icon-path'
    },
    dificil: {
      option: 'Difícil',
      description: 'Nivel avanzado',
      value: 'dificil',
      icon: 'icon-path'
    }
  },
  ORATORY_FEEDBACK_STORAGE_KEY: 'oratory-feedback'
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
    warning: jest.fn(),
    info: jest.fn()
  },
  ToastContainer: () => <div data-testid="toast-container" />
}));

// Mock de helpers
jest.mock('../../helpers/helpers', () => ({
  parseOratoryTopic: jest.fn(data => data),
  saveOratoryTopic: jest.fn(),
  removeOratoryTopic: jest.fn()
}));

// Mock de componentes
jest.mock('../../../pensamientoCritico/components/InputSelection/InputSelection', () => ({ options, onSelect }) => (
  <div data-testid="input-selection">
    <select data-testid="select-difficulty" onChange={(e) => onSelect(e.target.value)}>
      <option value="">Seleccionar</option>
      <option value="facil">Fácil</option>
      <option value="intermedio">Intermedio</option>
      <option value="dificil">Difícil</option>
    </select>
  </div>
));
jest.mock('../../../pensamientoCritico/components/Button/Button', () => {
  return ({ onclick, disabled, content, loadingState, typeStyle }) => (
    <button 
      data-testid="oratory-button" 
      onClick={onclick} 
      disabled={!disabled} 
      className={typeStyle || ""}
    >
      {loadingState ? 'Cargando...' : content}
    </button>
  );
});
jest.mock('../../../pensamientoCritico/components/BoxInfo/BoxInfo', () => ({ topic }) => (
  <div data-testid="box-info">Info del tema: {topic || ''}</div>
));
jest.mock('../../components/Nav/Nav', () => () => <div>Nav</div>);
jest.mock('../../components/JuanDabot/JuanDabot', () => () => <div>Bot</div>);

// Configuración de API
process.env.REACT_APP_API_HOST = 'http://localhost:3000';

// Mock del entorno del navegador para simular compatibilidad
describe('OratorIA Component', () => {
  // Guardar la implementación original de navigator.userAgent
  const originalUserAgent = Object.getOwnPropertyDescriptor(navigator, 'userAgent');
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Simular Chrome como navegador para pasar el check de compatibilidad
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      configurable: true
    });
    
    // Mock SpeechRecognition para indicar que el navegador lo soporta
    global.SpeechRecognition = jest.fn();
    global.webkitSpeechRecognition = jest.fn();
  });
  
  afterEach(() => {
    // Restaurar la implementación original de navigator.userAgent
    if (originalUserAgent) {
      Object.defineProperty(navigator, 'userAgent', originalUserAgent);
    }
    
    // Limpiar el mock de SpeechRecognition
    delete global.SpeechRecognition;
    delete global.webkitSpeechRecognition;
  });

  test('renderiza el componente correctamente', () => {
    render(
      <MemoryRouter>
        <OratorIA />
      </MemoryRouter>
    );

    expect(screen.getByText('Empezar Nuevo Discurso')).toBeInTheDocument();
    expect(screen.getByTestId('input-selection')).toBeInTheDocument();
    expect(screen.getByTestId('oratory-button')).toBeInTheDocument();
  });

  test('llama a removeOratoryTopic al montar el componente', () => {
    render(
      <MemoryRouter>
        <OratorIA />
      </MemoryRouter>
    );

    // Verificar que removeOratoryTopic se llamó dos veces (una para cada clave)
    const { removeOratoryTopic } = require('../../helpers/helpers');
    expect(removeOratoryTopic).toHaveBeenCalledTimes(2);
    expect(removeOratoryTopic).toHaveBeenCalledWith();
    expect(removeOratoryTopic).toHaveBeenCalledWith('oratory-feedback');
  });

  test('habilita el botón cuando se selecciona una dificultad', () => {
    render(
      <MemoryRouter>
        <OratorIA />
      </MemoryRouter>
    );

    const selectDifficulty = screen.getByTestId('select-difficulty');
    // Inicialmente el botón está deshabilitado porque difficulty es null
    expect(screen.getByTestId('oratory-button')).toBeDisabled();
    
    // Al seleccionar una dificultad, el botón debe habilitarse
    fireEvent.change(selectDifficulty, { target: { value: 'facil' } });
    expect(screen.getByTestId('oratory-button')).not.toBeDisabled();
  });

  test('redirige a la página de inicio del discurso cuando se obtiene un tema exitosamente', async () => {
    // Configura el mock de parseOratoryTopic para devolver datos válidos
    const { parseOratoryTopic } = require('../../helpers/helpers');
    parseOratoryTopic.mockImplementation(() => ({
      id: 1,
      guion: 'Este es un guion de prueba',
      frasesClave: ['frase1', 'frase2']
    }));

    // Configurar el mock de axios para devolver datos de tema
    axios.get.mockResolvedValue({
      data: {
        id: 1,
        guion: 'Este es un guion de prueba',
        frasesClave: ['frase1', 'frase2']
      }
    });

    render(
      <MemoryRouter>
        <OratorIA />
      </MemoryRouter>
    );

    // Seleccionar una dificultad
    const selectDifficulty = screen.getByTestId('select-difficulty');
    fireEvent.change(selectDifficulty, { target: { value: 'facil' } });
    
    // Ahora el botón debe estar habilitado
    const button = screen.getByTestId('oratory-button');
    expect(button).not.toBeDisabled();
    
    // Hacer clic en el botón para generar discurso
    fireEvent.click(button);
    
    // Verificar que se llama a axios.get con la URL correcta
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/oratory-topics/facil');
    });
    
    // Verificar que se guardó el tema
    const { saveOratoryTopic } = require('../../helpers/helpers');
    await waitFor(() => {
      expect(saveOratoryTopic).toHaveBeenCalled();
    });
    
    // Verificar que se redirige a la página correcta
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/activity/oratoria/topic-start');
    });
  });

  test('muestra un mensaje de error cuando falla la obtención del tema', async () => {
    // Configurar el mock de axios para simular un error
    axios.get.mockRejectedValue(new Error('Error de red'));

    render(
      <MemoryRouter>
        <OratorIA />
      </MemoryRouter>
    );

    // Seleccionar una dificultad
    const selectDifficulty = screen.getByTestId('select-difficulty');
    fireEvent.change(selectDifficulty, { target: { value: 'facil' } });
    
    // Hacer clic en el botón para generar discurso
    fireEvent.click(screen.getByTestId('oratory-button'));
    
    // Verificar que se muestra un mensaje de error
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
    
    // Verificar que se limpia el tema guardado
    const { removeOratoryTopic } = require('../../helpers/helpers');
    await waitFor(() => {
      // removeOratoryTopic ya se llamó 2 veces en el useEffect inicial
      expect(removeOratoryTopic).toHaveBeenCalledTimes(3);
    });
  });

  test('intenta nuevamente cuando parseOratoryTopic devuelve null', async () => {
    // Configura el mock de parseOratoryTopic para devolver null la primera vez y datos válidos la segunda
    const { parseOratoryTopic } = require('../../helpers/helpers');
    parseOratoryTopic
      .mockImplementationOnce(() => null)
      .mockImplementationOnce(() => ({
        id: 1,
        guion: 'Este es un guion de prueba',
        frasesClave: ['frase1', 'frase2']
      }));

    // Configurar el mock de axios para devolver datos dos veces
    axios.get
      .mockResolvedValueOnce({
        data: { id: 1 }
      })
      .mockResolvedValueOnce({
        data: { 
          id: 2,
          guion: 'Este es otro guion de prueba',
          frasesClave: ['frase3', 'frase4']
        }
      });

    render(
      <MemoryRouter>
        <OratorIA />
      </MemoryRouter>
    );

    // Seleccionar una dificultad
    const selectDifficulty = screen.getByTestId('select-difficulty');
    fireEvent.change(selectDifficulty, { target: { value: 'facil' } });
    
    // Hacer clic en el botón para generar discurso
    fireEvent.click(screen.getByTestId('oratory-button'));
    
    // Verificar que se llama a axios.get dos veces
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(2);
    });
    
    // Verificar que se muestra un mensaje de error para el primer intento
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
      expect(toast.error.mock.calls[0][0]).toContain("Intentando");
    });
    
    // Verificar que finalmente se guardó el tema y se navega a la página correcta
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/activity/oratoria/topic-start');
    });
  });

  test('muestra advertencia cuando se detecta dispositivo móvil', () => {
    // Simular dispositivo móvil
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
      configurable: true
    });
    
    render(
      <MemoryRouter>
        <OratorIA />
      </MemoryRouter>
    );
    
    // Verificar que se muestra el mensaje de advertencia para móviles
    expect(screen.getByText('Esta actividad no es compatible con dispositivos móviles.')).toBeInTheDocument();
    
    // Verificar que el botón muestra el mensaje correcto
    expect(screen.getByTestId('oratory-button')).toHaveTextContent('No disponible en móviles');
  });
}); 