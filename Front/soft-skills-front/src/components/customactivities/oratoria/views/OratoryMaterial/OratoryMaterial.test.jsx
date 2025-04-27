import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import OratoryMaterial from './OratoryMaterial';

// Mock de constantes
jest.mock('../../constantes/constants', () => ({
  MATERIALS: [
    {
      title: 'Guía básica',
      description: 'Aprende los fundamentos de la oratoria',
      icon: 'icon-path-1',
      type: 'guide',
      buttonText: 'Ver Guía',
      link: '/materials/basic-guide'
    },
    {
      title: 'Técnicas avanzadas',
      description: 'Perfecciona tu técnica de oratoria',
      icon: 'icon-path-2',
      type: 'advanced',
      buttonText: 'Ver Técnicas',
      link: '/materials/advanced'
    }
  ]
}));

// Mock de componentes
jest.mock('../../../pensamientoCritico/components/BoxSelect/BoxSelect', () => ({ title, description, buttonText }) => (
  <div data-testid={`box-select-${title.toLowerCase().replace(/\s+/g, '-')}`}>
    <h3>{title}</h3>
    <p>{description}</p>
    <button>{buttonText}</button>
  </div>
));
jest.mock('../../components/Nav/Nav', () => () => <div>Nav</div>);
jest.mock('../../components/JuanDabot/JuanDabot', () => () => <div>Bot</div>);

describe('OratoryMaterial Component', () => {
  test('renderiza el componente correctamente', () => {
    render(
      <MemoryRouter>
        <OratoryMaterial />
      </MemoryRouter>
    );

    // Verificar que el título y descripción están presentes
    expect(screen.getByText('Materiales de Aprendizaje')).toBeInTheDocument();
    expect(screen.getByText('En esta sección encontrarás materiales de aprendizaje para fortalecer tus habilidades oratorias y practicar tus habilidades.')).toBeInTheDocument();
    expect(screen.getByText('Material para practicar')).toBeInTheDocument();
  });

  test('renderiza todos los materiales de aprendizaje', () => {
    render(
      <MemoryRouter>
        <OratoryMaterial />
      </MemoryRouter>
    );

    // Verificar que se muestran los BoxSelect para cada material
    expect(screen.getByTestId('box-select-guía-básica')).toBeInTheDocument();
    expect(screen.getByTestId('box-select-técnicas-avanzadas')).toBeInTheDocument();
    
    // Verificar que se muestran los títulos y descripciones de los materiales
    expect(screen.getByText('Guía básica')).toBeInTheDocument();
    expect(screen.getByText('Aprende los fundamentos de la oratoria')).toBeInTheDocument();
    expect(screen.getByText('Técnicas avanzadas')).toBeInTheDocument();
    expect(screen.getByText('Perfecciona tu técnica de oratoria')).toBeInTheDocument();
    
    // Verificar que se muestran los botones con el texto correcto
    expect(screen.getByText('Ver Guía')).toBeInTheDocument();
    expect(screen.getByText('Ver Técnicas')).toBeInTheDocument();
  });

  test('incluye los componentes Nav y JuanDabot', () => {
    render(
      <MemoryRouter>
        <OratoryMaterial />
      </MemoryRouter>
    );

    // El mock de Nav renderiza un div con el texto "Nav"
    expect(screen.getByText('Nav')).toBeInTheDocument();
    
    // El mock de JuanDabot renderiza un div con el texto "Bot"
    expect(screen.getByText('Bot')).toBeInTheDocument();
  });
}); 