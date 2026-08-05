import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResetPasswordPage from '../reset-password/page';
import { useRouter, useSearchParams } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

const mockFetch = (response: Partial<Response>) => {
  global.fetch = jest.fn(() => Promise.resolve(response as Response));
};

const submit = (newPassword = 'newpass123', confirmPassword = 'newpass123') => {
  fireEvent.change(screen.getByLabelText(/^new password$/i), { target: { value: newPassword } });
  fireEvent.change(screen.getByLabelText(/confirm new password/i), { target: { value: confirmPassword } });
  fireEvent.click(screen.getByRole('button', { name: /reset password/i }));
};

describe('ResetPassword Page', () => {
  let mockRouter: { push: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();
    mockRouter = { push: jest.fn() };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSearchParams as jest.Mock).mockReturnValue({ get: () => 'reset-token-123' });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('shows an error and does not call the API when passwords do not match', () => {
    render(<ResetPasswordPage />);

    submit('newpass123', 'different');

    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('resets the password and redirects to login on success', async () => {
    jest.useFakeTimers();
    mockFetch({ ok: true, json: () => Promise.resolve({}) });
    render(<ResetPasswordPage />);

    await act(async () => {
      submit();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/reset-password'),
      expect.objectContaining({ body: JSON.stringify({ token: 'reset-token-123', newPassword: 'newpass123' }) })
    );
    expect(screen.getByText('Password reset successfully! Redirecting to login...')).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(3000);
    });
    expect(mockRouter.push).toHaveBeenCalledWith('/login');
  });

  test('shows the backend error message on failure', async () => {
    mockFetch({ ok: false, json: () => Promise.resolve({ message: 'Reset token expired' }) });
    render(<ResetPasswordPage />);

    await act(async () => {
      submit();
    });

    expect(screen.getByText('Reset token expired')).toBeInTheDocument();
  });

  test('shows a fallback error message when the backend gives no message', async () => {
    mockFetch({ ok: false, json: () => Promise.resolve({}) });
    render(<ResetPasswordPage />);

    await act(async () => {
      submit();
    });

    expect(screen.getByText('Failed to reset password.')).toBeInTheDocument();
  });

  test('shows a generic error when the request throws', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));
    render(<ResetPasswordPage />);

    await act(async () => {
      submit();
    });

    expect(screen.getByText('An error occurred. Please try again later.')).toBeInTheDocument();
  });
});
