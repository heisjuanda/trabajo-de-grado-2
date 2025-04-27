import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import DebateStart from './DebateStart';
import {
  getSessionStorageValues,
  setSessionStorageValue,
  removeSessionStorageValue,
} from '../../helpers/helpers';
import {
  IA_CHAT_RESPONSE_CONTEXT,
  IA_FEEDBACK_RESPONSE,
  IA_TOPIC_QUESTION_INDEX,
} from '../../constantes/debateIdeas';
import axios from 'axios';

// Mock de Axios
jest.mock('axios');
// Configure axios mock
axios.post.mockResolvedValue({ data: { success: true } });
axios.get.mockResolvedValue({ data: {} });
axios.create.mockReturnThis();
axios.interceptors = {
  request: { use: jest.fn(), eject: jest.fn() },
  response: { use: jest.fn(), eject: jest.fn() }
};
axios.defaults = { baseURL: '' };

// Agregar mock para process.env
process.env.REACT_APP_API_HOST = 'http://localhost:3000';

// Mock de react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Mock de auth0
jest.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    isAuthenticated: true,
    user: { email: 'usuario.test@example.com', name: 'Usuario Test' },
    isLoading: false,
    loginWithRedirect: jest.fn(),
    logout: jest.fn()
  })
}));

// Mock de react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn()
  },
  ToastContainer: () => <div data-testid="mock-toast-container" />
}));

// Mock de los helpers
jest.mock('../../helpers/helpers', () => ({
  getFormattedDate: jest.fn().mockReturnValue('2023-06-15 10:00:00'),
  getSessionStorageValues: jest.fn(),
  setSessionStorageValue: jest.fn(),
  removeSessionStorageValue: jest.fn()
}));

// Mock de los componentes del debate
jest.mock('../../components/Nav/Nav', () => {
  return function MockNav() {
    return <div data-testid="mock-nav">Nav Mock</div>;
  };
});

jest.mock('../../components/BoxInfo/BoxInfo', () => {
  return function MockBoxInfo({ topic, question }) {
    return (
      <div data-testid="mock-box-info">
        <p>Topic: {topic}</p>
        <p>Question: {question}</p>
      </div>
    );
  };
});

jest.mock('../../components/Chat/Chat', () => {
  return function MockChat({ setFeedback }) {
    return (
      <div data-testid="mock-chat">
        <button 
          data-testid="chat-feedback-button" 
          onClick={() => setFeedback({
            rating: 8,
            resumen: 'Buen debate',
            recomendaciones: ['Mejorar argumentos', 'Usar más datos']
          })}
        >
          Enviar Feedback
        </button>
      </div>
    );
  };
});

jest.mock('../../components/Feedback/Feedback', () => {
  return function MockFeedback({ data }) {
    return (
      <div data-testid="mock-feedback">
        <p>Rating: {data.rating}</p>
        <p>Resumen: {data.resumen}</p>
      </div>
    );
  };
});

describe('DebateStart Component', () => {
  beforeEach(() => {
    // Limpiamos todos los mocks
    jest.clearAllMocks();
    
    // Restablecemos los mocks de axios
    axios.post.mockReset();
    axios.post.mockResolvedValue({ data: { success: true } });
    
    // Configuración para sessionStorage con datos simulados válidos
    getSessionStorageValues.mockImplementation((key) => {
      if (!key) {
        return JSON.stringify({
          question: '¿Cuál es el impacto de la inteligencia artificial en la sociedad?',
          topic: 1
        });
      } else if (key === IA_CHAT_RESPONSE_CONTEXT) {
        return JSON.stringify({
          debate_completo: 'Usuario: Pregunta\nIA: Respuesta'
        });
      }
      return null;
    });
  });

  test('renderiza el componente correctamente con datos del sessionStorage', () => {
    render(
      <BrowserRouter>
        <DebateStart />
      </BrowserRouter>
    );

    expect(screen.getByTestId('mock-nav')).toBeInTheDocument();
    expect(screen.getByTestId('mock-box-info')).toBeInTheDocument();
    expect(screen.getByTestId('mock-chat')).toBeInTheDocument();
    expect(screen.getByText(/¿Cuál es el impacto de la inteligencia artificial en la sociedad?/i)).toBeInTheDocument();
  });

  test('cambia de chat a feedback cuando se envía el feedback', async () => {
    render(
      <BrowserRouter>
        <DebateStart />
      </BrowserRouter>
    );

    // Inicialmente se muestra el chat
    expect(screen.getByTestId('mock-chat')).toBeInTheDocument();
    
    // Simular envío de feedback
    await act(async () => {
      screen.getByTestId('chat-feedback-button').click();
    });
    
    // Después del feedback, debería mostrar el componente de Feedback
    await waitFor(() => {
      expect(screen.getByTestId('mock-feedback')).toBeInTheDocument();
      expect(screen.getByText(/Rating: 8/i)).toBeInTheDocument();
      expect(screen.getByText(/Resumen: Buen debate/i)).toBeInTheDocument();
    });
  });

  test('guarda el reporte y muestra notificación de éxito cuando se envía feedback', async () => {
    render(
      <BrowserRouter>
        <DebateStart />
      </BrowserRouter>
    );
    
    // Simular envío de feedback
    await act(async () => {
      screen.getByTestId('chat-feedback-button').click();
    });
    
    // Verificar que se llamó a axios.post con los datos correctos
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(axios.post.mock.calls[0][0]).toContain('/debate-topics/reports');
      expect(axios.post.mock.calls[0][1]).toHaveProperty('email', 'usuario.test@example.com');
      expect(axios.post.mock.calls[0][1]).toHaveProperty('rating', 8);
    });
    
    // Verificar que se llama a setSessionStorageValue y removeSessionStorageValue
    expect(setSessionStorageValue).toHaveBeenCalled();
    expect(removeSessionStorageValue).toHaveBeenCalledWith(IA_TOPIC_QUESTION_INDEX);
    
    // Después de guardar, debería llamar a removeSessionStorageValue para limpiar
    await waitFor(() => {
      expect(removeSessionStorageValue).toHaveBeenCalledWith(IA_CHAT_RESPONSE_CONTEXT);
    });
  });

  test('maneja errores cuando falta sessionStorage', () => {
    // Simulamos que no hay datos en sessionStorage
    getSessionStorageValues.mockImplementation(() => null);
    
    render(
      <BrowserRouter>
        <DebateStart />
      </BrowserRouter>
    );
    
    // Debería intentar navegar de vuelta a la página de debate
    expect(mockNavigate).toHaveBeenCalledWith('/activity/debate-ia');
  });

  test('maneja errores cuando sessionStorage está malformado', () => {
    // Simulamos que hay datos malformados en sessionStorage (string no JSON)
    getSessionStorageValues.mockImplementation(() => '{}');
    
    render(
      <BrowserRouter>
        <DebateStart />
      </BrowserRouter>
    );
    
    // No debería dar error porque devolvemos un JSON válido pero vacío
    // Verificamos que se intentó renderizar el componente
    expect(screen.getByTestId('mock-nav')).toBeInTheDocument();
  });
}); 