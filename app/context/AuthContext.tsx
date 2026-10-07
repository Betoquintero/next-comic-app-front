'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { refreshAccessToken, logout as logoutRequest } from '../../lib/api';

const ACCESS_TOKEN_LIFETIME_MS = 15 * 60 * 1000;

export interface User {
  _id: string;
  username: string;
  email: string;
  // Only used to decide what the UI shows (e.g. admin-only links) - the
  // backend checks the role in the DB on every admin request.
  role?: 'user' | 'admin';
}

interface AuthContextType {
  isAuthenticated: boolean;
  authenticateUser: (token: string) => void;  // Accept token as a parameter
  logoutUser: () => void;
  user: User | null;
  authenticatedFetch: (path: string, init?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = Cookies.get('authToken');
    if (storedToken) {
      authenticateUser(storedToken);  // Fetch user data if token exists
    } else {
      setLoading(false);
    }
  }, []);

  const persistToken = (token: string) => {
    Cookies.set('authToken', token, {
      secure: true,
      sameSite: 'strict',
      expires: new Date(Date.now() + ACCESS_TOKEN_LIFETIME_MS),
    });
  };

  // Shared by authenticateUser (mount-time / post-login check) and
  // authenticatedFetch (everything else): attaches the token, and on a 401
  // tries one silent refresh-and-retry. `refreshFailed: true` means a 401
  // was hit AND the refresh didn't recover it, so the caller should treat
  // this as a real logout rather than just a failed request.
  const fetchWithRefresh = async (
    path: string,
    token: string | undefined,
    init: RequestInit = {}
  ): Promise<{ response: Response; refreshFailed: boolean }> => {
    const doFetch = (t: string | undefined) =>
      fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
        ...init,
        headers: {
          ...init.headers,
          Authorization: `Bearer ${t ?? ''}`,
        },
      });

    const response = await doFetch(token);
    if (response.status !== 401) {
      return { response, refreshFailed: false };
    }

    const newToken = await refreshAccessToken();
    if (!newToken) {
      return { response, refreshFailed: true };
    }

    persistToken(newToken);
    return { response: await doFetch(newToken), refreshFailed: false };
  };

  // The JWT payload (/auth/me) doesn't carry the role, so it's read from the
  // user document. Best-effort: on any failure the user is treated as a
  // regular user, which only hides admin UI.
  const fetchRole = async (): Promise<User['role']> => {
    try {
      const { response } = await fetchWithRefresh('/user/loggedInUser', Cookies.get('authToken'));
      if (!response.ok) return 'user';
      const body = await response.json();
      return body?.data?.role === 'admin' ? 'admin' : 'user';
    } catch {
      return 'user';
    }
  };

  const authenticateUser = async (token: string) => {
    persistToken(token);

    try {
      const { response, refreshFailed } = await fetchWithRefresh('/auth/me', token);

      if (refreshFailed) {
        logoutUser();
        return;
      }

      if (response.ok) {
        const userData = await response.json();
        const role = await fetchRole();
        setUser({ ...userData, role });
        setIsAuthenticated(true);
      } else {
        console.error('Failed to fetch user data');
        logoutUser();
      }
    } catch (error) {
      console.error('Failed to authenticate user', error);
      logoutUser();
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    await logoutRequest(); // Best-effort: revokes the refresh token server-side
    Cookies.remove('authToken');
    setUser(null);
    setIsAuthenticated(false);
    router.push('/login');
  };

  // Drop-in replacement for `fetch` against the API: attaches the access
  // token and, on a 401, tries one silent refresh-and-retry before giving up.
  const authenticatedFetch = async (path: string, init: RequestInit = {}): Promise<Response> => {
    const { response, refreshFailed } = await fetchWithRefresh(path, Cookies.get('authToken'), init);

    if (refreshFailed) {
      logoutUser();
    }

    return response;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        authenticateUser,
        logoutUser,
        user,
        authenticatedFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook for easy access to the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
