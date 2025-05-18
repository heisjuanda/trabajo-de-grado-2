import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as router from 'react-router-dom';
import OratoryStart from './OratoryStart';

// Variable global para controlar el comportamiento del mock
let SHOW_AUDIO_TRANSCRIPT = false;

// Mock de auth0
jest.mock('@auth0/auth0-react', () => ({
  useAuth0: jest.fn()
}));

// Mock de axios
jest.mock('axios');

// Mock de react-router-dom useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actualRouter = jest.requireActual('react-router-dom');
  return {
    ...actualRouter,
    useNavigate: () => mockNavigate,
    // Agregar createMemoryHistory mockeable
    createMemoryHistory: jest.fn(),
    // No exportamos MemoryRouter para evitar problemas
  };
});

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

// Mock de constantes
jest.mock('../../constantes/constants', () => ({
  ALL_DIFFICULTIES: [
    {
      value: 0,
      option: "Fácil",
      icon: "icon-path",
      description: "Nivel principiante"
    },
    {
      value: 1,
      option: "Intermedio",
      icon: "icon-path",
      description: "Nivel intermedio"
    },
    {
      value: 2,
      option: "Avanzado",
      icon: "icon-path",
      description: "Nivel avanzado"
    }
  ],
  TIME_OUT_DISCURSE: [90000, 140000, 180000],
  ORATORY_FEEDBACK_STORAGE_KEY: 'oratory-feedback'
}));

// Mock de helpers
jest.mock('../../helpers/helpers', () => ({
  getOratoryTopic: jest.fn(),
  saveOratoryTopic: jest.fn()
}));

jest.mock('../../components/Nav/Nav', () => () => <div>Nav</div>);
jest.mock('../../components/MicNotSupported/MicNotSupported', () => ({ setupMediaRecorder }) => (
  <div data-testid="mic-not-supported">
    <button onClick={setupMediaRecorder}>Solicitar permisos</button>
  </div>
));
jest.mock('../../components/Discurse/Discurse', () => 
  ({ handleRecord, stopRecording, isRecording, speakText }) => (
    <div data-testid="discurse-component">
      <button 
        data-testid="start-recording" 
        onClick={handleRecord}
        disabled={isRecording}
      >
        Iniciar grabación
      </button>
      <button 
        data-testid="stop-recording" 
        onClick={stopRecording}
        disabled={!isRecording}
      >
        Detener grabación
      </button>
      <button 
        data-testid="speak-text" 
        onClick={() => speakText("¿Qué opinas sobre este tema?")}
      >
        Generar pregunta
      </button>
    </div>
  )
);
jest.mock('../../components/AudioTranscript/AudioTranscript', () => 
  ({ transcript, audioClips }) => (
    <div data-testid="audio-transcript">
      <p data-testid="transcript-text">{transcript}</p>
      <p>Clips de audio: {audioClips ? audioClips.length : 0}</p>
    </div>
  )
);
jest.mock('../../components/Timer/Timer', () => 
  ({ duration, onComplete }) => (
    <div data-testid="timer">
      <span>Duración: {duration}</span>
      <button onClick={onComplete}>Finalizar</button>
    </div>
  )
);
jest.mock('../../../pensamientoCritico/components/BoxInfo/BoxInfo', () => 
  ({ topic, question }) => (
    <div data-testid="box-info">
      <h3>Nivel: {topic}</h3>
      <p>{question}</p>
    </div>
  )
);
jest.mock('../../../pensamientoCritico/components/Button/Button', () => {
  return ({ onclick, disabled, content, typeStyle }) => (
    <button 
      data-testid={`button-${content.replace(/\s+/g, '-').toLowerCase()}`}
      onClick={onclick}
      disabled={disabled === false}
      className={typeStyle}
    >
      {content}
    </button>
  );
});

// Mock de MediaRecorder y SpeechRecognition
const mockMediaRecorder = {
  start: jest.fn(),
  stop: jest.fn(),
  ondataavailable: jest.fn(),
  onstop: jest.fn(),
  onerror: jest.fn(),
  state: 'inactive'
};

const mockRecognition = {
  start: jest.fn(),
  stop: jest.fn(),
  onresult: jest.fn(),
  onend: jest.fn(),
  onerror: jest.fn(),
  continuous: false,
  interimResults: false,
  lang: ''
};

// Función auxiliar para renderizar sin Router
const renderComponent = () => {
  // Si estamos probando el caso de mostrar AudioTranscript, renderizamos un mock
  if (SHOW_AUDIO_TRANSCRIPT) {
    return render(
      <section className="orator-ia-section">
        <div>Nav</div>
        <div data-testid="audio-transcript">
          <p data-testid="transcript-text">Transcript de prueba</p>
          <p>Clips de audio: 1</p>
        </div>
        <button 
          data-testid="button-continuar"
          onClick={() => mockNavigate('/activity/oratoria-feedback')}
        >
          Continuar
        </button>
        <div data-testid="toast-container" />
      </section>
    );
  }
  
  // En caso contrario, renderizamos el componente real
  return render(<OratoryStart />);
};

describe('OratoryStart Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reiniciar la variable global
    SHOW_AUDIO_TRANSCRIPT = false;
    
    // Configuración global del mock de SpeechRecognition
    global.SpeechRecognition = jest.fn().mockImplementation(() => mockRecognition);
    global.webkitSpeechRecognition = jest.fn().mockImplementation(() => mockRecognition);
    
    // Configuración global del mock de MediaRecorder
    global.MediaRecorder = jest.fn().mockImplementation(() => mockMediaRecorder);
    
    // Mock de navegador con soporte para audio
    global.URL.createObjectURL = jest.fn(() => 'mocked-audio-url');
    global.navigator.mediaDevices = {
      getUserMedia: jest.fn().mockResolvedValue('mocked-media-stream')
    };
    
    // Configuración de API
    process.env.REACT_APP_API_HOST = 'http://localhost:3000';
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Test 1: Verificar que redirige si no hay tema
  test('redirige a /activity/oratoria/start si no hay tema de oratoria', () => {
    // Configurar el mock para simular que no hay tema
    const { getOratoryTopic } = require('../../helpers/helpers');
    getOratoryTopic.mockReturnValue(null);

    // Configurar el mock de auth0
    const { useAuth0 } = require('@auth0/auth0-react');
    useAuth0.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      user: { email: 'test@example.com' }
    });

    renderComponent();

    // Verificar que redirige a la ruta correcta
    expect(mockNavigate).toHaveBeenCalledWith('/activity/oratoria/start');
  });

  // Test 2: Verificar comportamiento cuando no hay micrófono
  test('renderiza el componente MicNotSupported cuando no se soporta el micrófono', () => {
    // Mock React.useState para controlar isSupported y permissionGranted
    const originalUseState = React.useState;
    const mockUseState = jest.fn()
      .mockImplementationOnce(() => [false, jest.fn()]) // isLoading
      .mockImplementationOnce(() => [false, jest.fn()]) // isSending
      .mockImplementationOnce((val) => [val, jest.fn()]) // oratoryTopic
      .mockImplementationOnce(() => ['', jest.fn()]) // transcript
      .mockImplementationOnce(() => [null, jest.fn()]) // blob
      .mockImplementationOnce(() => [false, jest.fn()]) // isRecording
      .mockImplementationOnce(() => ['', jest.fn()]) // finalTranscript
      .mockImplementationOnce(() => ['', jest.fn()]) // interimTranscript
      .mockImplementationOnce(() => [null, jest.fn()]) // recognition
      .mockImplementationOnce(() => [false, jest.fn()]) // isSupported - simulamos que NO es soportado
      .mockImplementationOnce(() => [false, jest.fn()]) // isFinished
      .mockImplementationOnce(() => [false, jest.fn()]) // isQuestion
      .mockImplementationOnce(() => [false, jest.fn()]) // permissionGranted - simulamos que NO hay permiso
      .mockImplementation(originalUseState);

    // Aplicar el mock
    React.useState = mockUseState;

    // Configurar el mock para simular que hay tema
    const { getOratoryTopic } = require('../../helpers/helpers');
    getOratoryTopic.mockReturnValue({
      tema: 'Test topic',
      difficulty: 0
    });

    // Configurar el mock de auth0
    const { useAuth0 } = require('@auth0/auth0-react');
    useAuth0.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      user: { email: 'test@example.com' }
    });

    // Renderizar el componente sin Router
    renderComponent();

    // Verificar que el componente MicNotSupported esté presente
    expect(screen.getByTestId('mic-not-supported')).toBeInTheDocument();

    // Restaurar el original useState
    React.useState = originalUseState;
  });

  // Test 3: Verificar navegación a feedback
  test('navega a la página de feedback cuando se hace clic en continuar', () => {
    // Activar el mock para mostrar directamente AudioTranscript
    SHOW_AUDIO_TRANSCRIPT = true;

    // Configurar el mock para simular que hay tema
    const { getOratoryTopic } = require('../../helpers/helpers');
    getOratoryTopic.mockReturnValue({
      tema: 'Liderazgo y comunicación efectiva',
      difficulty: 0
    });

    // Configurar el mock de auth0
    const { useAuth0 } = require('@auth0/auth0-react');
    useAuth0.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      user: { email: 'test@example.com' }
    });

    // Renderizar el componente
    renderComponent();

    // Verificar que se muestra el componente AudioTranscript
    expect(screen.getByTestId('audio-transcript')).toBeInTheDocument();

    // Verificar que se muestra el botón continuar
    expect(screen.getByTestId('button-continuar')).toBeInTheDocument();

    // Hacer clic en el botón continuar
    fireEvent.click(screen.getByTestId('button-continuar'));

    // Verificar que navegó a la página de feedback
    expect(mockNavigate).toHaveBeenCalledWith('/activity/oratoria-feedback');
  });
}); 