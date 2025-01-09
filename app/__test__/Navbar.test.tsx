import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

// Mock useAuth hook
jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Navbar Component', () => {
  const mockLogoutUser = jest.fn();
  const mockRouterBack = jest.fn();
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({
      back: mockRouterBack,
      push: mockRouterPush,
    });
  });

  test('renders home link and go back button', () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
    });

    render(<Navbar />);

    const homeLink = screen.getByText('Home');
    const goBackButton = screen.getByText('Go Back');

    expect(homeLink).toBeInTheDocument();
    expect(goBackButton).toBeInTheDocument();
  });

  test('renders signup and login links when not authenticated', () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
    });

    render(<Navbar />);

    const signupLink = screen.getByText('Signup');
    const loginLink = screen.getByText('Login');

    expect(signupLink).toBeInTheDocument();
    expect(loginLink).toBeInTheDocument();
  });

  test('renders profile link and logout button when authenticated', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { _id: 'user123' },
      logoutUser: mockLogoutUser,
    });

    render(<Navbar />);

    const profileLink = screen.getByText('Profile');
    const logoutButton = screen.getByText('Logout');

    expect(profileLink).toBeInTheDocument();
    expect(logoutButton).toBeInTheDocument();
  });

  test('calls logoutUser when logout button is clicked', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { _id: 'user123' },
      logoutUser: mockLogoutUser,
    });

    render(<Navbar />);

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    expect(mockLogoutUser).toHaveBeenCalledTimes(1);
  });
});
