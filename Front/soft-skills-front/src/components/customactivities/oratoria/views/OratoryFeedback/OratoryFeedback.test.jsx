import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import OratoryFeedback from './OratoryFeedback';

// Mock de react-router-dom useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Mock de constantes
jest.mock('../../constantes/constants', () => ({
  ORATORY_FEEDBACK_STORAGE_KEY: 'oratory-feedback'
}));

// Mock de helpers
jest.mock('../../helpers/helpers', () => ({
  getOratoryTopic: jest.fn(),
  removeOratoryTopic: jest.fn()
}));

// Mock de componentes
jest.mock('../../components/Section/Section', () => ({ title, content }) => (
  <div data-testid={`section-${title.toLowerCase()}`}>
    <h3>{title}</h3>
    <p>{content}</p>
  </div>
));
jest.mock('../../components/Nav/Nav', () => () => <div>Nav</div>);
jest.mock('../../../pensamientoCritico/components/Button/Button', () => {
  return ({ onclick, disabled, content, typeStyle }) => (
    <button 
      data-testid={`button-${content.replace(/\s+/g, '-').toLowerCase()}`}
      onClick={onclick}
      disabled={!disabled}
      className={typeStyle}
    >
      {content}
    </button>
  );
});

describe('OratoryFeedback Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('redirige a /activity/oratoria/start cuando no hay feedback', () => {
    // Configurar mock para simular que no hay feedback
    const { getOratoryTopic } = require('../../helpers/helpers');
    getOratoryTopic.mockReturnValue(null);

    render(
      <MemoryRouter>
        <OratoryFeedback />
      </MemoryRouter>
    );

    // Verificar que se redirige a la ruta correcta
    expect(mockNavigate).toHaveBeenCalledWith('/activity/oratoria/start');
    
    // Verificar que muestra el mensaje de no hay feedback
    expect(screen.getByText('No hay feedback')).toBeInTheDocument();
  });

  test('renderiza el feedback correctamente cuando existe', () => {
    // Configurar mock para simular feedback existente
    const mockFeedback = {
      calificacion: 8,
      resumen: 'Buen discurso, clara estructura.',
      sentimiento: 'Positivo, confiado.',
      temas_clave: 'Comunicación, liderazgo, trabajo en equipo.'
    };
    
    const { getOratoryTopic } = require('../../helpers/helpers');
    getOratoryTopic.mockReturnValue(mockFeedback);

    render(
      <MemoryRouter>
        <OratoryFeedback />
      </MemoryRouter>
    );

    // Verificar que no redirige
    expect(mockNavigate).not.toHaveBeenCalled();
    
    // Verificar que muestra el título y la calificación
    expect(screen.getByText('Feedback de tu Discurso')).toBeInTheDocument();
    expect(screen.getByText('Calificación: 8🎯')).toBeInTheDocument();
    
    // Verificar que las secciones existen
    expect(screen.getByTestId('section-resumen')).toBeInTheDocument();
    expect(screen.getByTestId('section-sentimiento')).toBeInTheDocument();
    expect(screen.getByTestId('section-temas clave')).toBeInTheDocument();
    
    // Verificar el contenido de las secciones
    expect(screen.getByText('Buen discurso, clara estructura.')).toBeInTheDocument();
    expect(screen.getByText('Positivo, confiado.')).toBeInTheDocument();
    expect(screen.getByText('Comunicación, liderazgo, trabajo en equipo.')).toBeInTheDocument();
  });

  test('llama a removeOratoryTopic cuando se desmonta el componente', () => {
    // Configurar mock para simular feedback existente
    const mockFeedback = {
      calificacion: 8,
      resumen: 'Resumen de prueba',
      sentimiento: 'Sentimiento de prueba',
      temas_clave: 'Temas de prueba'
    };
    
    const { getOratoryTopic, removeOratoryTopic } = require('../../helpers/helpers');
    getOratoryTopic.mockReturnValue(mockFeedback);

    const { unmount } = render(
      <MemoryRouter>
        <OratoryFeedback />
      </MemoryRouter>
    );

    // Desmontar el componente para activar el cleanup del useEffect
    unmount();
    
    // Verificar que se llamó a removeOratoryTopic
    expect(removeOratoryTopic).toHaveBeenCalled();
  });

  test('navega a nuevo discurso cuando se hace clic en el botón correspondiente', () => {
    // Configurar mock para simular feedback existente
    const mockFeedback = {
      calificacion: 8,
      resumen: 'Resumen de prueba',
      sentimiento: 'Sentimiento de prueba',
      temas_clave: 'Temas de prueba'
    };
    
    const { getOratoryTopic } = require('../../helpers/helpers');
    getOratoryTopic.mockReturnValue(mockFeedback);

    render(
      <MemoryRouter>
        <OratoryFeedback />
      </MemoryRouter>
    );

    // Hacer clic en el botón "Nuevo discurso"
    fireEvent.click(screen.getByTestId('button-nuevo-discurso'));
    
    // Verificar que navega a la ruta correcta
    expect(mockNavigate).toHaveBeenCalledWith('/activity/oratoria/topic-start');
  });

  test('navega a ver reportes cuando se hace clic en el botón correspondiente', () => {
    // Configurar mock para simular feedback existente
    const mockFeedback = {
      calificacion: 8,
      resumen: 'Resumen de prueba',
      sentimiento: 'Sentimiento de prueba',
      temas_clave: 'Temas de prueba'
    };
    
    const { getOratoryTopic } = require('../../helpers/helpers');
    getOratoryTopic.mockReturnValue(mockFeedback);

    render(
      <MemoryRouter>
        <OratoryFeedback />
      </MemoryRouter>
    );

    // Hacer clic en el botón "Ver reportes"
    fireEvent.click(screen.getByTestId('button-ver-reportes'));
    
    // Verificar que navega a la ruta correcta
    expect(mockNavigate).toHaveBeenCalledWith('/activity/oratoria/reports');
  });
}); 