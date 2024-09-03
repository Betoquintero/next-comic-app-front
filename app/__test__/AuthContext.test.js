import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

jest.mock('js-cookie');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const MockComponent = () => {
  const { isAuthenticated, authenticateUser, logoutUser, user } = useAuth();

  React.useEffect(() => {
    // Trigger the hook here or based on an event
    authenticateUser('newFakeToken');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>User is authenticated</p>
          <p>User ID: {user?._id}</p>
          <button onClick={logoutUser}>Logout</button>
        </>
      ) : (
        <p>User is not authenticated</p>
      )}
    </div>
  );
};

describe('AuthProvider and useAuth', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({
      push: mockPush,
    });
  });  

  test('handles logout and redirects to login page', async () => {
    Cookies.get.mockReturnValue('fakeToken');

    const fakeUser = { _id: '123', name: 'Test User' };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(fakeUser),
      })
    );

    await act(async () => {
      render(
        <AuthProvider>
          <MockComponent />
        </AuthProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('User is authenticated')).toBeInTheDocument();
    });

    await act(async () => {
      const logoutButton = screen.getByText('Logout');
      logoutButton.click();
    });

    await waitFor(() => {
      expect(screen.getByText('User is not authenticated')).toBeInTheDocument();
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  test('authenticateUser sets token and user data', async () => {
    Cookies.get.mockReturnValue(undefined);

    const fakeUser = { _id: '123', name: 'Test User' };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(fakeUser),
      })
    );

    await act(async () => {
      render(
        <AuthProvider>
          <MockComponent />
        </AuthProvider>
      );
    });

    await waitFor(() => {
      expect(Cookies.set).toHaveBeenCalledWith('authToken', 'newFakeToken');
      expect(screen.getByText('User is authenticated')).toBeInTheDocument();
      expect(screen.getByText('User ID: 123')).toBeInTheDocument();
    });
  });

  test('shows error if authentication fails', async () => {
    Cookies.get.mockReturnValue(undefined);

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
      })
    );

    await act(async () => {
      render(
        <AuthProvider>
          <MockComponent />
        </AuthProvider>
      );
    });

    await waitFor(() => {
      expect(Cookies.set).toHaveBeenCalledWith('authToken', 'newFakeToken');
      expect(screen.getByText('User is not authenticated')).toBeInTheDocument();
    });
  });
});
