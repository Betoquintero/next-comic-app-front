import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import VerifyEmailPage from '../verify-email/page';
import { useRouter, useSearchParams } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

const mockFetch = (response: Partial<Response>) => {
  global.fetch = jest.fn(() => Promise.resolve(response as Response));
};

describe('VerifyEmail Page', () => {
  let mockRouter: { push: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();
    mockRouter = { push: jest.fn() };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('shows "Invalid or missing token" when there is no token in the URL', async () => {
    (useSearchParams as jest.Mock).mockReturnValue({ get: () => null });
    render(<VerifyEmailPage />);

    await waitFor(() => {
      expect(screen.getByText('Verification Failed')).toBeInTheDocument();
    });
    expect(screen.getByText('Invalid or missing token')).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('shows a processing state before the verification resolves', () => {
    (useSearchParams as jest.Mock).mockReturnValue({ get: () => 'verify-token' });
    global.fetch = jest.fn(() => new Promise(() => {}));
    render(<VerifyEmailPage />);

    expect(screen.getByText('Processing...')).toBeInTheDocument();
    expect(screen.getByText('Verifying your email...')).toBeInTheDocument();
  });

  test('shows success and redirects to login when verification succeeds', async () => {
    jest.useFakeTimers();
    (useSearchParams as jest.Mock).mockReturnValue({ get: () => 'verify-token' });
    mockFetch({ ok: true, json: () => Promise.resolve({}) });

    render(<VerifyEmailPage />);

    await waitFor(() => {
      expect(screen.getByText('Email Verified')).toBeInTheDocument();
    });
    expect(screen.getByText('Your email has been successfully verified!')).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/auth/verify-email?token=verify-token'));

    await act(async () => {
      jest.advanceTimersByTime(3000);
    });
    expect(mockRouter.push).toHaveBeenCalledWith('/login');
  });

  test('shows the backend error message and a retry button when verification fails', async () => {
    (useSearchParams as jest.Mock).mockReturnValue({ get: () => 'verify-token' });
    mockFetch({ ok: false, json: () => Promise.resolve({ message: 'Token expired' }) });

    render(<VerifyEmailPage />);

    await waitFor(() => {
      expect(screen.getByText('Verification Failed')).toBeInTheDocument();
    });
    expect(screen.getByText('Token expired')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(mockRouter.push).toHaveBeenCalledWith('/signup');
  });

  test('shows a fallback error message when the backend gives no message', async () => {
    (useSearchParams as jest.Mock).mockReturnValue({ get: () => 'verify-token' });
    mockFetch({ ok: false, json: () => Promise.resolve({}) });

    render(<VerifyEmailPage />);

    await waitFor(() => {
      expect(screen.getByText('Verification failed')).toBeInTheDocument();
    });
  });

  test('shows a generic error when the request throws', async () => {
    (useSearchParams as jest.Mock).mockReturnValue({ get: () => 'verify-token' });
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

    render(<VerifyEmailPage />);

    await waitFor(() => {
      expect(screen.getByText('An error occurred while verifying your email.')).toBeInTheDocument();
    });
  });
});
