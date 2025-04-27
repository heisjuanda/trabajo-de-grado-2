import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock necesario para Auth0
jest.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    isAuthenticated: false,
    user: null,
    isLoading: false,
    loginWithRedirect: jest.fn(),
    logout: jest.fn()
  })
}));

test('renderiza el botón de inicio de sesión', () => {
  render(<App />);
  const loginButton = screen.getByText(/Iniciar sesión/i);
  expect(loginButton).toBeInTheDocument();
});
