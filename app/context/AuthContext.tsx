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
  role?: 'user' | 'admin';
}

interface AuthContextType {
  isAuthenticated: boolean;
  authenticateUser: (token: string) => void;
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
      authenticateUser(storedToken);
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
    await logoutRequest();
    Cookies.remove('authToken');
    setUser(null);
    setIsAuthenticated(false);
    router.push('/login');
  };

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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
