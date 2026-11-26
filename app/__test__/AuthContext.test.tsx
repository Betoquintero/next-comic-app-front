import React from 'react';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

jest.mock('js-cookie', () => ({
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const TestComponent = () => {
  const { isAuthenticated, authenticateUser, logoutUser, user, authenticatedFetch } = useAuth();
  const [fetchResult, setFetchResult] = React.useState<string | null>(null);

  const runFetch = async () => {
    const response = await authenticatedFetch('/some-protected-route');
    setFetchResult(`status:${response.status}`);
  };

  return (
    <div>
      <p data-testid="auth-status">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</p>
      <p data-testid="user">{user ? user.username : 'No User'}</p>
      <p data-testid="role">{user?.role ?? 'No Role'}</p>
      <p data-testid="fetch-result">{fetchResult ?? 'No Result'}</p>
      <button onClick={() => authenticateUser('mock-token')} data-testid="login-button">
        Login
      </button>
      <button onClick={logoutUser} data-testid="logout-button">
        Logout
      </button>
      <button onClick={runFetch} data-testid="fetch-button">
        Fetch
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
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ username: 'testuser' }),
      } as unknown as Response)
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
      expect(Cookies.set).toHaveBeenCalledWith(
        'authToken',
        'mock-token',
        expect.objectContaining({ secure: true, sameSite: 'strict', expires: expect.any(Date) })
      );
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
      expect(screen.getByTestId('user')).toHaveTextContent('testuser');
    });
  });

  test('reads the role from /user/loggedInUser after authenticating', async () => {
    global.fetch = jest.fn((url: string) =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve(
            url.includes('/user/loggedInUser')
              ? { data: { username: 'admin', role: 'admin' } }
              : { username: 'admin' }
          ),
      } as unknown as Response)
    ) as jest.Mock;

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      fireEvent.click(screen.getByTestId('login-button'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('role')).toHaveTextContent('admin');
    });
  });

  test('treats the user as a regular user if the role lookup fails', async () => {
    global.fetch = jest.fn((url: string) =>
      url.includes('/user/loggedInUser')
        ? Promise.reject(new Error('network down'))
        : Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve({ username: 'testuser' }),
          } as unknown as Response)
    ) as jest.Mock;

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      fireEvent.click(screen.getByTestId('login-button'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
      expect(screen.getByTestId('role')).toHaveTextContent('user');
    });
  });

  test('logs out user, revokes the session server-side, and clears local authentication', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ message: 'Logged out successfully' }) } as unknown as Response)
    );

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      fireEvent.click(screen.getByTestId('logout-button'));
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/logout'),
        expect.objectContaining({ method: 'POST', credentials: 'include' })
      );
      expect(Cookies.remove).toHaveBeenCalledWith('authToken');
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
      expect(screen.getByTestId('user')).toHaveTextContent('No User');
      expect(mockRouter.push).toHaveBeenCalledWith('/login');
    });
  });

  test('fetches user from stored token on mount', async () => {
    (Cookies.get as jest.Mock).mockReturnValue('existing-token');

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ username: 'persistedUser' }),
      } as unknown as Response)
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

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
      } as unknown as Response)
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

  test('refreshes silently on mount when the stored access token has expired, instead of logging out', async () => {
    (Cookies.get as jest.Mock).mockReturnValue('expired-token');

    let meCalls = 0;
    global.fetch = jest.fn((url: RequestInfo | URL) => {
      if (String(url).includes('/auth/refresh-token')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ authToken: 'new-token' }),
        } as unknown as Response);
      }

      if (!String(url).includes('/auth/me')) {
        return Promise.resolve({
          status: 200,
          ok: true,
          json: () => Promise.resolve({ data: { role: 'user' } }),
        } as unknown as Response);
      }

      meCalls += 1;
      const isFirstAttempt = meCalls === 1;
      return Promise.resolve({
        status: isFirstAttempt ? 401 : 200,
        ok: !isFirstAttempt,
        json: () => Promise.resolve({ username: 'refreshedUser' }),
      } as unknown as Response);
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
      expect(screen.getByTestId('user')).toHaveTextContent('refreshedUser');
    });
    expect(meCalls).toBe(2);
    expect(Cookies.remove).not.toHaveBeenCalled();
  });

  test('logs out on mount when the stored access token is expired and the refresh also fails', async () => {
    (Cookies.get as jest.Mock).mockReturnValue('expired-token');

    global.fetch = jest.fn((url: RequestInfo | URL) => {
      if (String(url).includes('/auth/refresh-token')) {
        return Promise.resolve({ ok: false, status: 401 } as unknown as Response);
      }
      return Promise.resolve({ status: 401, ok: false } as unknown as Response);
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(Cookies.remove).toHaveBeenCalledWith('authToken');
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
      expect(mockRouter.push).toHaveBeenCalledWith('/login');
    });
  });

  describe('authenticatedFetch', () => {
    beforeEach(() => {
      (Cookies.get as jest.Mock).mockReturnValue(undefined);
    });

    test('returns the response directly when the request succeeds', async () => {
      global.fetch = jest.fn(() => Promise.resolve({ status: 200, ok: true } as unknown as Response));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      fireEvent.click(screen.getByTestId('fetch-button'));

      await waitFor(() => {
        expect(screen.getByTestId('fetch-result')).toHaveTextContent('status:200');
      });
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    test('refreshes the token and retries once on a 401, returning the retried response', async () => {
      let protectedRouteCalls = 0;
      global.fetch = jest.fn((url: RequestInfo | URL) => {
        if (String(url).includes('/auth/refresh-token')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ authToken: 'new-token' }),
          } as unknown as Response);
        }

        protectedRouteCalls += 1;
        const isFirstAttempt = protectedRouteCalls === 1;
        return Promise.resolve({ status: isFirstAttempt ? 401 : 200, ok: !isFirstAttempt } as unknown as Response);
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      fireEvent.click(screen.getByTestId('fetch-button'));

      await waitFor(() => {
        expect(screen.getByTestId('fetch-result')).toHaveTextContent('status:200');
      });
      expect(protectedRouteCalls).toBe(2);
      expect(Cookies.set).toHaveBeenCalledWith(
        'authToken',
        'new-token',
        expect.objectContaining({ secure: true, sameSite: 'strict', expires: expect.any(Date) })
      );
    });

    test('logs the user out when the refresh fails after a 401', async () => {
      global.fetch = jest.fn((url: RequestInfo | URL) => {
        if (String(url).includes('/auth/refresh-token')) {
          return Promise.resolve({ ok: false, status: 401 } as unknown as Response);
        }
        return Promise.resolve({ status: 401, ok: false } as unknown as Response);
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      fireEvent.click(screen.getByTestId('fetch-button'));

      await waitFor(() => {
        expect(Cookies.remove).toHaveBeenCalledWith('authToken');
        expect(mockRouter.push).toHaveBeenCalledWith('/login');
      });
    });
  });
});
