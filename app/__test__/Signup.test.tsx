import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Signup from '../signup/page';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockFetch = (response: Partial<Response>) => {
  global.fetch = jest.fn(() => Promise.resolve(response as Response));
};

const fillAndSubmit = (password: string, passwordControl: string) => {
  fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'newuser', name: 'username' } });
  fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: 'new@user.com', name: 'email' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: password } });
  fireEvent.change(screen.getByLabelText(/repeat the password/i), { target: { value: passwordControl } });
  fireEvent.click(screen.getByRole('button', { name: /register/i }));
};

describe('Signup Page', () => {
  let mockRouter: { push: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();
    mockRouter = { push: jest.fn() };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('disables submit and shows an error when passwords do not match', async () => {
    render(<Signup />);

    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'abc123' } });
    fireEvent.change(screen.getByLabelText(/repeat the password/i), { target: { value: 'different' } });

    await waitFor(() => {
      expect(screen.getByText("Passwords don't match")).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /register/i })).toBeDisabled();
  });

  test('submits the form and shows a success message, then redirects to login', async () => {
    jest.useFakeTimers();
    mockFetch({ ok: true, json: () => Promise.resolve({}) });
    render(<Signup />);

    await act(async () => {
      fillAndSubmit('abc123', 'abc123');
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/signup'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ username: 'newuser', email: 'new@user.com', password: 'abc123' }),
      })
    );
    expect(
      screen.getByText('Signup successful! Please check your email to verify your account.')
    ).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(3000);
    });
    expect(mockRouter.push).toHaveBeenCalledWith('/login');
  });

  test('shows the backend error message when signup fails', async () => {
    mockFetch({ ok: false, json: () => Promise.resolve({ error: 'Email already in use' }) });
    render(<Signup />);

    await act(async () => {
      fillAndSubmit('abc123', 'abc123');
    });

    expect(screen.getByText('Email already in use')).toBeInTheDocument();
  });

  test('shows a fallback message when the backend gives no error field', async () => {
    mockFetch({ ok: false, json: () => Promise.resolve({}) });
    render(<Signup />);

    await act(async () => {
      fillAndSubmit('abc123', 'abc123');
    });

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  test('shows the error message when the request throws', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));
    render(<Signup />);

    await act(async () => {
      fillAndSubmit('abc123', 'abc123');
    });

    expect(screen.getByText('Network error')).toBeInTheDocument();
  });

  test('shows a fallback message when a non-Error value is thrown', async () => {
    global.fetch = jest.fn(() => Promise.reject('some non-Error rejection'));
    render(<Signup />);

    await act(async () => {
      fillAndSubmit('abc123', 'abc123');
    });

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});
