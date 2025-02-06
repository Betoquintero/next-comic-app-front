import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfileEdit from '../components/ProfileEdit';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

// Mockeamos los hooks de autenticación y enrutamiento
jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div />,
}));

describe('ProfileEdit Component', () => {
let mockLogoutUser: jest.Mock;
let mockRouter: { push: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();

    mockLogoutUser = jest.fn();
    mockRouter = { push: jest.fn() };
    
    (useAuth as jest.Mock).mockReturnValue({
      user: { username: 'testuser', email: 'testuser@example.com' },
      logoutUser: mockLogoutUser,
    });

    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  test('renders profile edit form with user data', () => {
    render(<ProfileEdit />);

    expect(screen.getByLabelText(/username/i)).toHaveValue('testuser');
    expect(screen.getByLabelText(/email/i)).toHaveValue('testuser@example.com');
    expect(screen.getByText("Editing testuser's profile")).toBeInTheDocument();
  });

  test('updates input fields on user input', () => {
    render(<ProfileEdit />);

    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);

    fireEvent.change(usernameInput, { target: { value: 'newuser' } });
    fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } });

    expect(usernameInput).toHaveValue('newuser');
    expect(emailInput).toHaveValue('newuser@example.com');
  });

  test('calls API and logs out user on successful form submission', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => ({}),
        headers: new Headers(),
        redirected: false,
        status: 200,
        statusText: 'OK',
        type: 'basic',
        url: '',
        clone: jest.fn(),
        body: null,
        bodyUsed: false,
        arrayBuffer: jest.fn(),
        blob: jest.fn(),
        formData: jest.fn(),
        text: jest.fn(),
        bytes: jest.fn(),
      } as Response)
    );

    render(<ProfileEdit />);

    fireEvent.submit(screen.getByRole('button', { name: /save changes and log out/i }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('User edited successfully. Please log in again.', expect.any(Object));
      expect(mockLogoutUser).toHaveBeenCalled();
      expect(mockRouter.push).toHaveBeenCalledWith('/login');
    });
  });

  test('shows error toast when API call fails', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        headers: new Headers(),
        redirected: false,
        status: 400,
        statusText: 'Bad Request',
        type: 'basic',
        url: '',
        clone: jest.fn(),
        body: null,
        bodyUsed: false,
        arrayBuffer: jest.fn(),
        blob: jest.fn(),
        formData: jest.fn(),
        text: jest.fn(),
        json: jest.fn(),
        bytes: jest.fn(),
      } as Response)
    );

    render(<ProfileEdit />);

    fireEvent.submit(screen.getByRole('button', { name: /save changes and log out/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to update profile. Please try again.', expect.any(Object));
    });
  });

  test('shows error toast when API request throws an error', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network Error')));

    render(<ProfileEdit />);

    fireEvent.submit(screen.getByRole('button', { name: /save changes and log out/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('An error occurred while updating the profile.', expect.any(Object));
    });
  });
});
