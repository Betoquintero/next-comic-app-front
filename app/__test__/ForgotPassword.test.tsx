import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ForgotPasswordPage from '../forgot-password/page';

const mockFetch = (response: Partial<Response>) => {
  global.fetch = jest.fn(() => Promise.resolve(response as Response));
};

const submit = (email = 'user@test.com') => {
  fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: email } });
  fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));
};

describe('ForgotPassword Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows a confirmation message on success', async () => {
    mockFetch({ ok: true, json: () => Promise.resolve({}) });
    render(<ForgotPasswordPage />);

    submit();

    await waitFor(() => {
      expect(screen.getByText('A password reset link has been sent to your email.')).toBeInTheDocument();
    });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/request-password-reset'),
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ email: 'user@test.com' }) })
    );
  });

  test('shows the backend error message on failure', async () => {
    mockFetch({ ok: false, json: () => Promise.resolve({ message: 'No account with that email' }) });
    render(<ForgotPasswordPage />);

    submit();

    await waitFor(() => {
      expect(screen.getByText('No account with that email')).toBeInTheDocument();
    });
  });

  test('shows a fallback error message when the backend gives no message', async () => {
    mockFetch({ ok: false, json: () => Promise.resolve({}) });
    render(<ForgotPasswordPage />);

    submit();

    await waitFor(() => {
      expect(screen.getByText('Failed to send reset link, please try again.')).toBeInTheDocument();
    });
  });

  test('shows a generic error when the request throws', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));
    render(<ForgotPasswordPage />);

    submit();

    await waitFor(() => {
      expect(screen.getByText('An error occurred. Please try again later.')).toBeInTheDocument();
    });
  });

  test('disables the submit button and shows "Sending..." while submitting', async () => {
    let resolvePromise: (value: Partial<Response>) => void = () => {};
    global.fetch = jest.fn(
      () =>
        new Promise((resolve) => {
          resolvePromise = resolve as (value: Partial<Response>) => void;
        }) as Promise<Response>
    );
    render(<ForgotPasswordPage />);

    submit();

    expect(screen.getByRole('button', { name: /sending/i })).toBeDisabled();

    resolvePromise({ ok: true, json: () => Promise.resolve({}) });
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /send reset link/i })).not.toBeDisabled();
    });
  });
});
