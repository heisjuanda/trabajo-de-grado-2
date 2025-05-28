import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import OratorIA from './OratorIA';
import axios from 'axios';
import { toast } from 'react-toastify';

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

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

jest.mock('axios');

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn()
  },
  ToastContainer: () => <div data-testid="toast-container" />
}));

jest.mock('../../helpers/helpers', () => ({
  parseOratoryTopic: jest.fn(data => data),
  saveOratoryTopic: jest.fn(),
  removeOratoryTopic: jest.fn()
}));

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

process.env.REACT_APP_API_HOST = 'http://localhost:3000';

const mockCompatibleBrowser = () => {
  Object.defineProperty(navigator, 'userAgent', {
    value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    configurable: true
  });
  
  Object.defineProperty(window, 'chrome', {
    value: { runtime: {} },
    configurable: true
  });
  
  Object.defineProperty(navigator, 'brave', {
    value: undefined,
    configurable: true
  });
  
  delete window.InstallTrigger;
};

const mockIncompatibleBrowser = () => {
  Object.defineProperty(navigator, 'userAgent', {
    value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Brave/1.26.74',
    configurable: true
  });
  
  Object.defineProperty(navigator, 'brave', {
    value: { 
      isBrave: jest.fn().mockResolvedValue(true)
    },
    configurable: true
  });
  
  delete window.chrome;
  
  delete window.InstallTrigger;
  
  delete window.StyleMedia;
};

const mockMobileDevice = () => {
  Object.defineProperty(navigator, 'userAgent', {
    value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    configurable: true
  });
};

describe('OratorIA Component', () => {
  const originalUserAgent = Object.getOwnPropertyDescriptor(navigator, 'userAgent');
  const originalChrome = Object.getOwnPropertyDescriptor(window, 'chrome');
  const originalBrave = Object.getOwnPropertyDescriptor(navigator, 'brave');
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockCompatibleBrowser();
  });
  
  afterEach(() => {
    if (originalUserAgent) {
      Object.defineProperty(navigator, 'userAgent', originalUserAgent);
    }
    if (originalChrome) {
      Object.defineProperty(window, 'chrome', originalChrome);
    } else {
      delete window.chrome;
    }
    if (originalBrave) {
      Object.defineProperty(navigator, 'brave', originalBrave);
    } else {
      delete navigator.brave;
    }
  });

  test('renderiza el componente correctamente con navegador compatible', () => {
    render(
      <MemoryRouter>
        <OratorIA />
      </MemoryRouter>
    );

    expect(screen.getByText('Empezar Nuevo Discurso')).toBeInTheDocument();
    expect(screen.getByTestId('input-selection')).toBeInTheDocument();
    expect(screen.getByTestId('oratory-button')).toBeInTheDocument();
    expect(screen.getByTestId('box-info')).toBeInTheDocument();
  });

  test('llama a removeOratoryTopic al montar el componente', () => {
    render(
      <MemoryRouter>
        <OratorIA />
      </MemoryRouter>
    );

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
    expect(screen.getByTestId('oratory-button')).toBeDisabled();
    
    fireEvent.change(selectDifficulty, { target: { value: 'facil' } });
    expect(screen.getByTestId('oratory-button')).not.toBeDisabled();
  });

  test('redirige a la página de inicio del discurso cuando se obtiene un tema exitosamente', async () => {
    const { parseOratoryTopic } = require('../../helpers/helpers');
    parseOratoryTopic.mockImplementation(() => ({
      id: 1,
      guion: 'Este es un guion de prueba',
      frasesClave: ['frase1', 'frase2']
    }));

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

    const selectDifficulty = screen.getByTestId('select-difficulty');
    fireEvent.change(selectDifficulty, { target: { value: 'facil' } });
    
    const button = screen.getByTestId('oratory-button');
    expect(button).not.toBeDisabled();
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/oratory-topics/facil');
    });
    
    const { saveOratoryTopic } = require('../../helpers/helpers');
    await waitFor(() => {
      expect(saveOratoryTopic).toHaveBeenCalled();
    });
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/activity/oratoria/topic-start');
    });
  });

  test('muestra un mensaje de error cuando falla la obtención del tema', async () => {
    axios.get.mockRejectedValue(new Error('Error de red'));

    render(
      <MemoryRouter>
        <OratorIA />
      </MemoryRouter>
    );

    const selectDifficulty = screen.getByTestId('select-difficulty');
    fireEvent.change(selectDifficulty, { target: { value: 'facil' } });
    
    fireEvent.click(screen.getByTestId('oratory-button'));
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
    
    const { removeOratoryTopic } = require('../../helpers/helpers');
    await waitFor(() => {
      expect(removeOratoryTopic).toHaveBeenCalledTimes(3);
    });
  });

  test('intenta nuevamente cuando parseOratoryTopic devuelve null', async () => {
    const { parseOratoryTopic } = require('../../helpers/helpers');
    parseOratoryTopic
      .mockImplementationOnce(() => null)
      .mockImplementationOnce(() => ({
        id: 1,
        guion: 'Este es un guion de prueba',
        frasesClave: ['frase1', 'frase2']
      }));

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

    const selectDifficulty = screen.getByTestId('select-difficulty');
    fireEvent.change(selectDifficulty, { target: { value: 'facil' } });
    
    fireEvent.click(screen.getByTestId('oratory-button'));
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(2);
    });
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
      expect(toast.error.mock.calls[0][0]).toContain("Intentando");
    });
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/activity/oratoria/topic-start');
    });
  });

  test('muestra advertencia cuando se detecta dispositivo móvil', () => {
    mockMobileDevice();
    
    render(
      <MemoryRouter>
        <OratorIA />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Dispositivo móvil detectado')).toBeInTheDocument();
    expect(screen.getByText(/Esta actividad requiere un ordenador con micrófono/)).toBeInTheDocument();
    
    expect(screen.getByTestId('oratory-button')).toHaveTextContent('No disponible en móviles');
    
    expect(screen.queryByTestId('input-selection')).not.toBeInTheDocument();
    
    expect(screen.queryByTestId('box-info')).not.toBeInTheDocument();
  });

  test('muestra advertencia cuando el navegador no es compatible', async () => {
    mockIncompatibleBrowser();
    
    render(
      <MemoryRouter>
        <OratorIA />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getAllByText('Navegador no compatible')).toHaveLength(2);
    });
    
    expect(screen.getByText(/Tu navegador no soporta las funciones de reconocimiento de voz/)).toBeInTheDocument();
    
    expect(screen.getByText('Google Chrome')).toBeInTheDocument();
    expect(screen.getByText('Mozilla Firefox')).toBeInTheDocument();
    expect(screen.getByText('Microsoft Edge')).toBeInTheDocument();
    
    expect(screen.getByTestId('oratory-button')).toHaveTextContent('Navegador no compatible');
    
    expect(screen.queryByTestId('input-selection')).not.toBeInTheDocument();
    
    expect(screen.queryByTestId('box-info')).not.toBeInTheDocument();
  });

  test('no permite hacer clic en el botón cuando el navegador no es compatible', async () => {
    mockIncompatibleBrowser();
    
    render(
      <MemoryRouter>
        <OratorIA />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId('oratory-button')).toBeDisabled();
    });
    
    const button = screen.getByTestId('oratory-button');
    fireEvent.click(button);
    
    expect(axios.get).not.toHaveBeenCalled();
  });
}); 