import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from '../components/NavBar';
import { useAuth } from '../context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

// Mockeamos los hooks de Next.js y el contexto de autenticación
jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(() => ({
    isAuthenticated: false,
    user: null,
    logoutUser: jest.fn(),
  })),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href} data-testid={`link-${href}`}>
      {children}
    </a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

describe('Navbar Component', () => {
  let mockRouter: { refresh: jest.Mock, push: jest.Mock, back: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mockeamos el router y pathname
    mockRouter = { refresh: jest.fn(), push: jest.fn(), back: jest.fn() };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (usePathname as jest.Mock).mockReturnValue('/');
  });

  test('renders Home and Contact links correctly', () => {
    render(<Navbar />);

    expect(screen.getByTestId('link-/')).toBeInTheDocument();
    expect(screen.getByTestId('link-/contact')).toBeInTheDocument();
  });

  test('renders Chat link correctly', () => {
    render(<Navbar />);

    const chatLink = screen.getByTestId('link-/chat');
    expect(chatLink).toBeInTheDocument();
    expect(chatLink).toHaveAttribute('href', '/chat');
  });

  test('renders Categorize link for an admin user', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: { _id: '123', role: 'admin' },
      logoutUser: jest.fn(),
    });

    render(<Navbar />);

    const categorizeLink = screen.getByTestId('link-/categorize');
    expect(categorizeLink).toBeInTheDocument();
    expect(categorizeLink).toHaveAttribute('href', '/categorize');
  });

  test('hides Categorize link for a regular user and for visitors', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: { _id: '123', role: 'user' },
      logoutUser: jest.fn(),
    });
    const { unmount } = render(<Navbar />);
    expect(screen.queryByTestId('link-/categorize')).not.toBeInTheDocument();
    unmount();

    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false, user: null });
    render(<Navbar />);
    expect(screen.queryByTestId('link-/categorize')).not.toBeInTheDocument();
  });

  test('renders Signup and Login when user is not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false });

    render(<Navbar />);

    expect(screen.getByTestId('link-/signup')).toBeInTheDocument();
    expect(screen.getByTestId('link-/login')).toBeInTheDocument();
  });

  test('renders Profile and Logout when user is authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: { _id: '123' },
      logoutUser: jest.fn(),
    });

    render(<Navbar />);

    expect(screen.getByTestId('link-/profile/123')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('calls logout function and redirects on Logout button click', () => {
    const mockLogout = jest.fn();
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: { _id: '123' },
      logoutUser: mockLogout,
    });

    render(<Navbar />);

    fireEvent.click(screen.getByText('Logout'));

    expect(mockLogout).toHaveBeenCalled();
    mockRouter.push('/');
    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });
});
