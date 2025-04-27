import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import MainOratory from './MainOratory';

// Mock de constantes
jest.mock('../../constantes/constants', () => ({
  ALL_SECTIONS: [
    {
      title: 'Práctica de Discurso',
      description: 'Practica tus habilidades de oratoria con diferentes niveles',
      icon: 'icon-path',
      type: 'practice',
      buttonText: 'Practicar',
      link: '/activity/oratoria/start'
    },
    {
      title: 'Tus Reportes',
      description: 'Revisa tus reportes anteriores',
      icon: 'icon-path',
      type: 'reports',
      buttonText: 'Ver Reportes',
      link: '/activity/oratoria/reports'
    }
  ],
  ORATORY_FEEDBACK_STORAGE_KEY: 'oratory-feedback'
}));

// Mock de helpers
const mockRemoveOratoryTopic = jest.fn();
jest.mock('../../helpers/helpers', () => ({
  removeOratoryTopic: jest.fn()
}));

// Mock de componentes
jest.mock('../../../pensamientoCritico/components/BoxSelect/BoxSelect', () => ({ title, description, buttonText }) => (
  <div data-testid="box-select">
    <h3>{title}</h3>
    <p>{description}</p>
    <button>{buttonText}</button>
  </div>
));
jest.mock('../../components/Nav/Nav', () => () => <div>Nav</div>);
jest.mock('../../components/JuanDabot/JuanDabot', () => () => <div>Bot</div>);

describe('MainOratory Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza el componente correctamente', () => {
    render(
      <MemoryRouter>
        <MainOratory />
      </MemoryRouter>
    );

    // Verificar que el título principal se muestra
    expect(screen.getByText('Desarrolla Tus Habilidades De Oratoria')).toBeInTheDocument();
    
    // Verificar que la descripción se muestra
    expect(screen.getByText(/La oratoria es la capacidad de expresar ideas y argumentos/)).toBeInTheDocument();
    
    // Verificar que el título de sección se muestra
    expect(screen.getByText('Herramientas de Aprendizaje Interactivo')).toBeInTheDocument();
    
    // Verificar que se renderizaron los BoxSelect para cada sección
    const boxSelects = screen.getAllByTestId('box-select');
    expect(boxSelects).toHaveLength(2);
    
    // Verificar contenido específico de cada BoxSelect
    expect(screen.getByText('Práctica de Discurso')).toBeInTheDocument();
    expect(screen.getByText('Tus Reportes')).toBeInTheDocument();
  });

  test('llama a removeOratoryTopic al montar el componente', () => {
    render(
      <MemoryRouter>
        <MainOratory />
      </MemoryRouter>
    );

    // Verificar que removeOratoryTopic se llamó dos veces (una para cada clave)
    expect(require('../../helpers/helpers').removeOratoryTopic).toHaveBeenCalledTimes(2);
    expect(require('../../helpers/helpers').removeOratoryTopic).toHaveBeenCalledWith();
    expect(require('../../helpers/helpers').removeOratoryTopic).toHaveBeenCalledWith('oratory-feedback');
  });
}); 