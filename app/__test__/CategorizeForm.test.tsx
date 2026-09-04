import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CategorizeForm from '../components/CategorizeForm';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div />,
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

const fillAndSubmit = (name: string) => {
  fireEvent.change(screen.getByPlaceholderText(/e\.g\. injustice/i), { target: { value: name } });
  fireEvent.click(screen.getByRole('button', { name: /suggest categorization/i }));
};

const fakeJsonResponse = (data: unknown): Response => ({ ok: true, json: () => Promise.resolve({ data }) } as unknown as Response);

describe('CategorizeForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows a login prompt when the user is not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false });

    render(<CategorizeForm />);

    expect(screen.getByText(/you need to be logged in/i)).toBeInTheDocument();
    expect(screen.getByTestId('link-/login')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/e\.g\. injustice/i)).not.toBeInTheDocument();
  });

  test('submits the form and renders the suggestion with its sources', async () => {
    const authenticatedFetch = jest.fn().mockResolvedValue(
      fakeJsonResponse({
        suggestion: {
          universe: 'DC',
          event: 'Injustice',
          isNewEvent: false,
          order: '2',
          reasoning: 'It follows #1 in the same event.',
        },
        basedOn: [{ name: 'Injustice: Year Zero #1', universe: 'DC', event: 'Injustice' }],
      })
    );
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true, authenticatedFetch });

    render(<CategorizeForm />);
    fillAndSubmit('Injustice: Year Zero #2');

    await waitFor(() => {
      expect(authenticatedFetch).toHaveBeenCalledWith('/categorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Injustice: Year Zero #2', summary: '', description: '' }),
      });
    });

    const resultPanel = await screen.findByTestId('categorize-result');
    expect(resultPanel).toHaveTextContent('DC');
    expect(resultPanel).toHaveTextContent('Injustice');
    expect(resultPanel).toHaveTextContent('2');
    expect(resultPanel).toHaveTextContent('It follows #1 in the same event.');
    expect(resultPanel).toHaveTextContent('Injustice: Year Zero #1');
    expect(screen.queryByText(/new event/i)).not.toBeInTheDocument();
  });

  test('shows a "New event" badge when the suggestion is a new event', async () => {
    const authenticatedFetch = jest.fn().mockResolvedValue(
      fakeJsonResponse({
        suggestion: { universe: 'MARVEL', event: 'Some New Saga', isNewEvent: true, order: '1', reasoning: 'No close matches.' },
        basedOn: [],
      })
    );
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true, authenticatedFetch });

    render(<CategorizeForm />);
    fillAndSubmit('Brand New Comic #1');

    expect(await screen.findByText(/new event/i)).toBeInTheDocument();
  });

  test('shows an error toast when the request fails', async () => {
    const authenticatedFetch = jest.fn().mockResolvedValue({ ok: false, status: 401 } as unknown as Response);
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true, authenticatedFetch });

    render(<CategorizeForm />);
    fillAndSubmit('Injustice: Year Zero #2');

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Your session has expired. Please log in again.', expect.any(Object));
    });
    expect(screen.queryByTestId('categorize-result')).not.toBeInTheDocument();
  });
});
