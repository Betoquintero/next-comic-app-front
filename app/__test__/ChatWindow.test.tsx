import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatWindow from '../components/ChatWindow';
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

const encoder = new TextEncoder();

type SseEvent = { type: string; [key: string]: unknown };

const buildSse = (events: SseEvent[]) => events.map((event) => `data: ${JSON.stringify(event)}\n\n`).join('');

const fakeStreamResponse = (events: SseEvent[]): Response => {
  const chunk = encoder.encode(buildSse(events));
  let delivered = false;
  const reader = {
    read: jest.fn(() => {
      if (!delivered) {
        delivered = true;
        return Promise.resolve({ done: false, value: chunk });
      }
      return Promise.resolve({ done: true, value: undefined });
    }),
  };
  return { ok: true, status: 200, body: { getReader: () => reader } } as unknown as Response;
};

const createControlledStreamResponse = () => {
  const queue: { done: boolean; value?: Uint8Array }[] = [];
  const waiters: Array<(item: { done: boolean; value?: Uint8Array }) => void> = [];

  const push = (events: SseEvent[]) => {
    const item = { done: false, value: encoder.encode(buildSse(events)) };
    const waiter = waiters.shift();
    if (waiter) waiter(item);
    else queue.push(item);
  };

  const finish = () => {
    const item = { done: true, value: undefined };
    const waiter = waiters.shift();
    if (waiter) waiter(item);
    else queue.push(item);
  };

  const reader = {
    read: jest.fn(
      () =>
        new Promise<{ done: boolean; value?: Uint8Array }>((resolve) => {
          const next = queue.shift();
          if (next) resolve(next);
          else waiters.push(resolve);
        })
    ),
  };

  const response = { ok: true, status: 200, body: { getReader: () => reader } } as unknown as Response;
  return { response, push, finish };
};

const sendMessage = (text: string) => {
  const input = screen.getByPlaceholderText(/ask about what to read next/i);
  fireEvent.change(input, { target: { value: text } });
  fireEvent.submit(input.closest('form') as HTMLFormElement);
};

describe('ChatWindow Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows a login prompt when the user is not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false });

    render(<ChatWindow />);

    expect(screen.getByText(/you need to be logged in/i)).toBeInTheDocument();
    expect(screen.getByTestId('link-/login')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/ask about what to read next/i)).not.toBeInTheDocument();
  });

  test('renders the welcome message when there are no messages yet', () => {
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true, authenticatedFetch: jest.fn() });

    render(<ChatWindow />);

    expect(screen.getByText(/ask me what to read next/i)).toBeInTheDocument();
  });

  test('sends the user message to /chat via authenticatedFetch', async () => {
    const authenticatedFetch = jest.fn().mockResolvedValue(fakeStreamResponse([{ type: 'done', sources: [] }]));
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true, authenticatedFetch });

    render(<ChatWindow />);
    sendMessage('What should I read after Infinity Gauntlet?');

    expect(screen.getByText('What should I read after Infinity Gauntlet?')).toBeInTheDocument();

    await waitFor(() => {
      expect(authenticatedFetch).toHaveBeenCalledWith('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: 'What should I read after Infinity Gauntlet?' }] }),
      });
    });
  });

  test('trims the history to the last 20 messages before sending', async () => {
    const authenticatedFetch = jest
      .fn()
      .mockImplementation(() => Promise.resolve(fakeStreamResponse([{ type: 'done', sources: [] }])));
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true, authenticatedFetch });

    render(<ChatWindow />);

    for (let i = 0; i < 21; i += 1) {
      sendMessage(`message ${i}`);
      // eslint-disable-next-line no-await-in-loop
      await waitFor(() => expect(authenticatedFetch).toHaveBeenCalledTimes(i + 1));
    }

    const lastCallBody = JSON.parse(authenticatedFetch.mock.calls[20][1].body);
    expect(lastCallBody.messages).toHaveLength(20);
    expect(lastCallBody.messages[19]).toEqual({ role: 'user', content: 'message 20' });
  });

  test('shows a loading state until the first delta arrives, then renders it as it streams', async () => {
    const controlled = createControlledStreamResponse();
    const authenticatedFetch = jest.fn().mockResolvedValue(controlled.response);
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true, authenticatedFetch });

    render(<ChatWindow />);
    sendMessage('Hello');

    expect(screen.getByText(/thinking/i)).toBeInTheDocument();

    controlled.push([{ type: 'delta', text: 'Hi there' }]);

    await waitFor(() => {
      expect(screen.queryByText(/thinking/i)).not.toBeInTheDocument();
      expect(screen.getByText('Hi there')).toBeInTheDocument();
    });

    controlled.push([{ type: 'done', sources: [] }]);
    controlled.finish();

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/ask about what to read next/i)).not.toBeDisabled();
    });
  });

  test('renders the assistant reply built from multiple deltas, and its sources', async () => {
    const authenticatedFetch = jest.fn().mockResolvedValue(
      fakeStreamResponse([
        { type: 'delta', text: 'Read ' },
        { type: 'delta', text: 'Secret Wars next.' },
        { type: 'done', sources: [{ type: 'Event', name: 'Secret Wars' }] },
      ])
    );
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true, authenticatedFetch });

    render(<ChatWindow />);
    sendMessage('What next?');

    await waitFor(() => {
      expect(screen.getByText('Read Secret Wars next.')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/based on: secret wars/i)).toBeInTheDocument();
    });
  });

  test('shows an error toast when the request fails before streaming starts', async () => {
    const authenticatedFetch = jest.fn().mockResolvedValue({ ok: false, status: 500 } as unknown as Response);
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true, authenticatedFetch });

    render(<ChatWindow />);
    sendMessage('What next?');

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Failed to get a response from the chat assistant',
        expect.any(Object)
      );
    });
  });

  test('shows an error toast when the stream itself emits an error event', async () => {
    const authenticatedFetch = jest
      .fn()
      .mockResolvedValue(fakeStreamResponse([{ type: 'error', message: 'Something went wrong' }]));
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true, authenticatedFetch });

    render(<ChatWindow />);
    sendMessage('What next?');

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Something went wrong', expect.any(Object));
    });
  });
});
