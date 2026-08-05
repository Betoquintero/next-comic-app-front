import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginPage from '../login/page';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

const mockFetch = (response: Partial<Response>) => {
  global.fetch = jest.fn(() => Promise.resolve(response as Response));
};

const login = (email = 'user@test.com', password = 'password123') => {
  fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: email } });
  fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: password } });
  fireEvent.click(screen.getByRole('button', { name: /login/i }));
};

describe('Login Page', () => {
  let mockRouter: { push: jest.Mock };
  let mockAuthenticateUser: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRouter = { push: jest.fn() };
    mockAuthenticateUser = jest.fn();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useAuth as jest.Mock).mockReturnValue({ authenticateUser: mockAuthenticateUser });
  });

  test('authenticates the user and redirects to their profile on success', async () => {
    mockFetch({ ok: true, json: () => Promise.resolve({ authToken: 'token123', userId: 'u1' }) });
    render(<LoginPage />);

    login();

    await waitFor(() => {
      expect(mockAuthenticateUser).toHaveBeenCalledWith('token123');
      expect(mockRouter.push).toHaveBeenCalledWith('/profile/u1');
    });
  });

  test('shows "Wrong password" on a 401 response', async () => {
    mockFetch({ ok: false, status: 401 });
    render(<LoginPage />);

    login();

    await waitFor(() => {
      expect(screen.getByText('Wrong password')).toBeInTheDocument();
    });
  });

  test('shows "User not found" on a 404 response', async () => {
    mockFetch({ ok: false, status: 404 });
    render(<LoginPage />);

    login();

    await waitFor(() => {
      expect(screen.getByText('User not found')).toBeInTheDocument();
    });
  });

  test('shows a verification notice on a 403 response', async () => {
    mockFetch({ ok: false, status: 403 });
    render(<LoginPage />);

    login();

    await waitFor(() => {
      expect(screen.getByText('Please verify your email before logging in')).toBeInTheDocument();
    });
  });

  test('shows the backend error message on other failures', async () => {
    mockFetch({ ok: false, status: 500, json: () => Promise.resolve({ message: 'Server exploded' }) });
    render(<LoginPage />);

    login();

    await waitFor(() => {
      expect(screen.getByText('Server exploded')).toBeInTheDocument();
    });
  });

  test('shows a fallback error message when the backend gives no message', async () => {
    mockFetch({ ok: false, status: 500, json: () => Promise.resolve({}) });
    render(<LoginPage />);

    login();

    await waitFor(() => {
      expect(screen.getByText('An error occurred, please try again.')).toBeInTheDocument();
    });
  });

  test('shows a generic error when the request throws', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));
    render(<LoginPage />);

    login();

    await waitFor(() => {
      expect(screen.getByText('An unexpected error occurred. Please try again later.')).toBeInTheDocument();
    });
  });

  test('clears the error message once the user starts typing again', async () => {
    mockFetch({ ok: false, status: 401 });
    render(<LoginPage />);

    login();
    await waitFor(() => {
      expect(screen.getByText('Wrong password')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'other@test.com' } });

    expect(screen.queryByText('Wrong password')).not.toBeInTheDocument();
  });
});
