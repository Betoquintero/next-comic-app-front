'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export interface User {
  _id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  authenticateUser: (token: string) => void;  // Accept token as a parameter
  logoutUser: () => void;
  user: User | null;
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

  const authenticateUser = async (token: string) => {
    Cookies.set('authToken', token, { secure: true, sameSite: 'strict' });  // Store token in cookies

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
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
    Cookies.remove('authToken');
    setUser(null);
    setIsAuthenticated(false);
    router.push('/login');
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
