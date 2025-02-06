import React from 'react';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

// Mock de Cookies y useRouter
jest.mock('js-cookie', () => ({
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Componente de prueba para acceder al contexto
const TestComponent = () => {
  const { isAuthenticated, authenticateUser, logoutUser, user } = useAuth();

  return (
    <div>
      <p data-testid="auth-status">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</p>
      <p data-testid="user">{user ? user.username : 'No User'}</p>
      <button onClick={() => authenticateUser('mock-token')} data-testid="login-button">
        Login
      </button>
      <button onClick={logoutUser} data-testid="logout-button">
        Logout
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  let mockRouter;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRouter = { push: jest.fn() };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  test('renders AuthProvider and initializes as not authenticated', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    expect(screen.getByTestId('user')).toHaveTextContent('No User');
  });

  test('authenticates user when a token is provided', async () => {
    (global as any).fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ username: 'testuser' }),
      })
    );

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      fireEvent.click(screen.getByTestId('login-button'));
    });

    await waitFor(() => {
      expect(Cookies.set).toHaveBeenCalledWith('authToken', 'mock-token', { secure: true, sameSite: 'strict' });
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
      expect(screen.getByTestId('user')).toHaveTextContent('testuser');
    });
  });

  test('logs out user and clears authentication', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      fireEvent.click(screen.getByTestId('logout-button'));
    });

    expect(Cookies.remove).toHaveBeenCalledWith('authToken');
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    expect(screen.getByTestId('user')).toHaveTextContent('No User');
    expect(mockRouter.push).toHaveBeenCalledWith('/login');
  });

  test('fetches user from stored token on mount', async () => {
    (Cookies.get as jest.Mock).mockReturnValue('existing-token');

    (global as any).fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ username: 'persistedUser' }),
      })
    );

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
      expect(screen.getByTestId('user')).toHaveTextContent('persistedUser');
    });
  });

  test('logs out user if token fetch fails', async () => {
    (Cookies.get as jest.Mock).mockReturnValue('invalid-token');

    (global as any).fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
      })
    );

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(Cookies.remove).toHaveBeenCalledWith('authToken');
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
      expect(screen.getByTestId('user')).toHaveTextContent('No User');
    });
  });
});
