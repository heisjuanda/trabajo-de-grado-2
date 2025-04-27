import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import MainDebate from './MainDebate';
import { ALL_SECTIONS } from '../../constantes/debateIdeas';

// Mock de axios para evitar problemas con las importaciones
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  create: jest.fn().mockReturnThis(),
  interceptors: {
    request: { use: jest.fn(), eject: jest.fn() },
    response: { use: jest.fn(), eject: jest.fn() }
  },
  defaults: { baseURL: '' }
}));

// Mock window.open para pruebas de navegación externa
const mockOpen = jest.fn();
window.open = mockOpen;

// Mock para JuanDabot y otros componentes que podrían causar problemas en el test
jest.mock('../../../oratoria/components/JuanDabot/JuanDabot', () => {
  return function MockJuanDabot() {
    return <div data-testid="mock-juandabot">JuanDabot Mock</div>;
  };
});

jest.mock('../../components/Nav/Nav', () => {
  return function MockNav() {
    return <div data-testid="mock-nav">Nav Mock</div>;
  };
});

// Mock para BoxSelect ya que podría tener dependencias externas
jest.mock('../../components/BoxSelect/BoxSelect', () => {
  // Definimos una función handleClick externa al mock
  const mockHandleClick = jest.fn();
  
  // Retornamos una función que simulará el componente
  function MockBoxSelect(props) {
    return (
      <div data-testid="mock-box-select" className="box-select-mock">
        <h3>{props.title}</h3>
        <p>{props.description}</p>
        <span>{props.type}</span>
        <button 
          onClick={() => {
            mockHandleClick(props.link);
            if (props.link?.startsWith('http')) {
              // mockOpen fue definido fuera del mock
              mockOpen(props.link, '_blank');
            }
          }} 
          data-link={props.link}
        >
          {props.buttonText}
        </button>
      </div>
    );
  }
  
  // Adjuntamos la función handleClick al componente mock para poder probarla
  MockBoxSelect.mockHandleClick = mockHandleClick;
  
  return MockBoxSelect;
});

describe('MainDebate Component', () => {
  beforeEach(() => {
    mockOpen.mockClear();
    // Renderizamos el componente antes de cada test
    render(
      <BrowserRouter>
        <MainDebate />
      </BrowserRouter>
    );
  });

  test('renderiza el título principal correctamente', () => {
    const title = screen.getByText(/Desarrolla Tus Habilidades De Pensamiento Cŕitico/i);
    expect(title).toBeInTheDocument();
  });
  
  test('renderiza el título de herramientas correctamente', () => {
    const toolsTitle = screen.getByText(/Herramientas de Aprendizaje Interactivo/i);
    expect(toolsTitle).toBeInTheDocument();
  });
  
  test('renderiza la descripción del pensamiento crítico', () => {
    const description = screen.getByText(/El pensamiento crítico es la capacidad/i);
    expect(description).toBeInTheDocument();
  });
  
  test('renderiza todos los componentes BoxSelect de ALL_SECTIONS', () => {
    // Verificamos que se rendericen los componentes BoxSelect para cada sección
    const boxSelects = screen.getAllByTestId('mock-box-select');
    expect(boxSelects).toHaveLength(ALL_SECTIONS.length);
    
    // Verificamos que cada sección tenga su título correspondiente
    ALL_SECTIONS.forEach(section => {
      const title = screen.getByText(section.title);
      expect(title).toBeInTheDocument();
      
      const description = screen.getByText(section.description);
      expect(description).toBeInTheDocument();
      
      const type = screen.getByText(section.type);
      expect(type).toBeInTheDocument();
      
      const button = screen.getByText(section.buttonText);
      expect(button).toBeInTheDocument();
    });
  });
  
  test('renderiza los componentes mockeados correctamente', () => {
    const navMock = screen.getByTestId('mock-nav');
    const juandabotMock = screen.getByTestId('mock-juandabot');
    
    expect(navMock).toBeInTheDocument();
    expect(juandabotMock).toBeInTheDocument();
  });

  test('los enlaces externos abren en nueva ventana', () => {
    // Encontramos los botones que deberían abrir enlaces externos (segundo y tercer elemento en ALL_SECTIONS)
    const externalLinks = ALL_SECTIONS.filter(section => section.link.startsWith('http'));
    
    externalLinks.forEach(section => {
      const button = screen.getByText(section.buttonText);
      fireEvent.click(button);
      
      // Verificamos que window.open fue llamado con la URL correcta
      expect(mockOpen).toHaveBeenCalledWith(section.link, '_blank');
    });
    
    // Verificamos que window.open fue llamado la cantidad correcta de veces
    expect(mockOpen).toHaveBeenCalledTimes(externalLinks.length);
  });
}); 