import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatWindow from '../components/ChatWindow';
import { useAuth } from '../context/AuthContext';
import { sendChatMessage } from '../../lib/api';
import { toast } from 'react-toastify';

jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../lib/api', () => ({
  sendChatMessage: jest.fn(),
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

const sendMessage = (text: string) => {
  const input = screen.getByPlaceholderText(/ask about what to read next/i);
  fireEvent.change(input, { target: { value: text } });
  fireEvent.submit(input.closest('form') as HTMLFormElement);
};

describe('ChatWindow Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.cookie = 'authToken=test-token';
  });

  test('shows a login prompt when the user is not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false });

    render(<ChatWindow />);

    expect(screen.getByText(/you need to be logged in/i)).toBeInTheDocument();
    expect(screen.getByTestId('link-/login')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/ask about what to read next/i)).not.toBeInTheDocument();
  });

  test('renders the welcome message when there are no messages yet', () => {
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true });

    render(<ChatWindow />);

    expect(screen.getByText(/ask me what to read next/i)).toBeInTheDocument();
  });

  test('sends the user message and calls sendChatMessage with the token', async () => {
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true });
    (sendChatMessage as jest.Mock).mockResolvedValue({ reply: 'Try Secret Wars.', sources: [] });

    render(<ChatWindow />);
    sendMessage('What should I read after Infinity Gauntlet?');

    expect(screen.getByText('What should I read after Infinity Gauntlet?')).toBeInTheDocument();

    await waitFor(() => {
      expect(sendChatMessage).toHaveBeenCalledWith(
        [{ role: 'user', content: 'What should I read after Infinity Gauntlet?' }],
        'test-token'
      );
    });
  });

  test('trims the history to the last 20 messages before sending', async () => {
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true });
    (sendChatMessage as jest.Mock).mockResolvedValue({ reply: 'Reply', sources: [] });

    render(<ChatWindow />);

    for (let i = 0; i < 21; i += 1) {
      sendMessage(`message ${i}`);
      // eslint-disable-next-line no-await-in-loop
      await waitFor(() => expect(sendChatMessage).toHaveBeenCalledTimes(i + 1));
    }

    const lastCallMessages = (sendChatMessage as jest.Mock).mock.calls[20][0];
    expect(lastCallMessages).toHaveLength(20);
    expect(lastCallMessages[19]).toEqual({ role: 'user', content: 'message 20' });
  });

  test('shows a loading state while waiting for the response', async () => {
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true });
    let resolvePromise: (value: { reply: string; sources: never[] }) => void = () => {};
    (sendChatMessage as jest.Mock).mockReturnValue(
      new Promise((resolve) => {
        resolvePromise = resolve;
      })
    );

    render(<ChatWindow />);
    sendMessage('Hello');

    expect(screen.getByText(/thinking/i)).toBeInTheDocument();

    resolvePromise({ reply: 'Hi there', sources: [] });

    await waitFor(() => {
      expect(screen.queryByText(/thinking/i)).not.toBeInTheDocument();
    });
  });

  test('renders the assistant reply and its sources', async () => {
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true });
    (sendChatMessage as jest.Mock).mockResolvedValue({
      reply: 'Read Secret Wars next.',
      sources: [{ type: 'Event', name: 'Secret Wars' }],
    });

    render(<ChatWindow />);
    sendMessage('What next?');

    await waitFor(() => {
      expect(screen.getByText('Read Secret Wars next.')).toBeInTheDocument();
    });
    expect(screen.getByText(/based on: secret wars/i)).toBeInTheDocument();
  });

  test('shows an error toast when sendChatMessage rejects', async () => {
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true });
    (sendChatMessage as jest.Mock).mockRejectedValue(new Error('Failed to get a response from the chat assistant'));

    render(<ChatWindow />);
    sendMessage('What next?');

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Failed to get a response from the chat assistant',
        expect.any(Object)
      );
    });
  });
});
