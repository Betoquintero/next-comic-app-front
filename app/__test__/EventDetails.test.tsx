import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EventDetails from '../components/EventDetails';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

// Mockeamos el hook de autenticación
jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mockeamos useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    refresh: jest.fn(),
  })),
}));

// Mockeamos toast
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div />,
}));

describe('EventDetails Component', () => {
  const mockIssues = [
    { _id: '1', name: 'Issue 1', image: '/issue1.jpg' },
    { _id: '2', name: 'Issue 2', image: '/issue2.jpg' },
  ];

  const mockAlternateVersion = {
    title: 'Alternate Event',
    image: '/alternate.jpg',
    buyOption1: 'https://amazon.com/alternate-eu',
    buyOption2: 'https://amazon.com/alternate-us',
    buyOption3: 'https://amazon.com/alternate-kindle',
  };

  let mockRouter: { refresh: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mockeamos autenticación
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      authenticatedFetch: jest.fn((url: string, init?: RequestInit) => global.fetch(url, init)),
    });

    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    mockRouter = { refresh: jest.fn() };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  test('renders main event image correctly', () => {
    render(<EventDetails image="/event.jpg" issues={mockIssues} universe="Marvel" eventId="event1" />);
    const mainImage = screen.getByAltText('Cover image of Marvel event');
    expect(mainImage).toBeInTheDocument();
  });

  test('renders buy options correctly when provided', () => {
    render(<EventDetails image="/event.jpg" issues={mockIssues} universe="Marvel" eventId="event1" buyOption1="https://amazon.com/event" />);
    
    const buyButton = screen.getByRole('link', { name: /buy event on amazon eu/i });
    expect(buyButton).toBeInTheDocument();
    expect(buyButton).toHaveAttribute('href', 'https://amazon.com/event');
  });

  test('renders alternate version when provided', () => {
    render(<EventDetails image="/event.jpg" issues={mockIssues} universe="Marvel" eventId="event1" alternateVersion={mockAlternateVersion} />);
    
    expect(screen.getByText(/alternate version: alternate event/i)).toBeInTheDocument();
    expect(screen.getByAltText('Cover image of alternate version: Alternate Event')).toBeInTheDocument();
  });

  test('does not render alternate version section if not provided', () => {
    render(<EventDetails image="/event.jpg" issues={mockIssues} universe="Marvel" eventId="event1" />);
    
    expect(screen.queryByText(/alternate version:/i)).not.toBeInTheDocument();
  });

  test('renders issues correctly', () => {
    render(<EventDetails image="/event.jpg" issues={mockIssues} universe="Marvel" eventId="event1" />);
    
    expect(screen.getByText('Comics that belong to this event')).toBeInTheDocument();
    expect(screen.getByText('Issue 1')).toBeInTheDocument();
    expect(screen.getByText('Issue 2')).toBeInTheDocument();
  });

  test('shows "No issues available" message when issues list is empty', () => {
    render(<EventDetails image="/event.jpg" issues={[]} universe="Marvel" eventId="event1" />);
    
    expect(screen.getByText('No issues available')).toBeInTheDocument();
  });

  test('renders add to collection button only if authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true });
    render(<EventDetails image="/event.jpg" issues={mockIssues} universe="Marvel" eventId="event1" />);
    
    expect(screen.getByText('Add Event to My Collection')).toBeInTheDocument();
  });

  test('does not render add to collection button if not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false });
    render(<EventDetails image="/event.jpg" issues={mockIssues} universe="Marvel" eventId="event1" />);
    
    expect(screen.queryByText('Add Event to My Collection')).not.toBeInTheDocument();
  });

  test('calls API and shows success toast on successful add to collection', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
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
      } as unknown as Response)
    );

    render(<EventDetails image="/event.jpg" issues={mockIssues} universe="Marvel" eventId="event1" />);
    
    fireEvent.submit(screen.getByText('Add Event to My Collection'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Successfully added event to collection', expect.any(Object));
      expect(mockRouter.refresh).toHaveBeenCalled();
    });
  });

  test('calls API and shows info toast when event is already in collection', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: "Event is already on user's collection" }),
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
      } as unknown as Response)
    );

    render(<EventDetails image="/event.jpg" issues={mockIssues} universe="Marvel" eventId="event1" />);
    
    fireEvent.submit(screen.getByText('Add Event to My Collection'));

    await waitFor(() => {
      expect(toast.info).toHaveBeenCalledWith("Event is already on user's collection", expect.any(Object));
    });
  });

  test('calls API and shows error toast on API failure', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        headers: new Headers(),
        redirected: false,
        status: 500,
        statusText: 'Internal Server Error',
        type: 'basic',
        url: '',
        clone: jest.fn(),
        body: null,
        bodyUsed: false,
        arrayBuffer: jest.fn(),
        blob: jest.fn(),
        formData: jest.fn(),
        json: jest.fn(),
        text: jest.fn(),
      } as unknown as Response)
    );

    render(<EventDetails image="/event.jpg" issues={mockIssues} universe="Marvel" eventId="event1" />);
    
    fireEvent.submit(screen.getByText('Add Event to My Collection'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to add event to collection', expect.any(Object));
    });
  });

  test('disables button while request is in progress', async () => {
    global.fetch = jest.fn(() => new Promise<Response>((resolve) => setTimeout(() => resolve({
      ok: true,
      json: () => Promise.resolve({}),
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
    } as unknown as Response), 1000)));

    render(<EventDetails image="/event.jpg" issues={mockIssues} universe="Marvel" eventId="event1" />);

    const button = screen.getByText('Add Event to My Collection');
    fireEvent.submit(button);

    expect(button).toBeDisabled();

  });

  test('renders the Amazon US and Kindle buy options for the main event when provided', () => {
    render(
      <EventDetails
        image="/event.jpg"
        issues={mockIssues}
        universe="Marvel"
        eventId="event1"
        buyOption2="https://amazon.com/event-us"
        buyOption3="https://amazon.com/event-kindle"
      />
    );

    expect(screen.getByRole('link', { name: /buy event on amazon us/i })).toHaveAttribute(
      'href',
      'https://amazon.com/event-us'
    );
    expect(screen.getByRole('link', { name: /buy event for kindle/i })).toHaveAttribute(
      'href',
      'https://amazon.com/event-kindle'
    );
  });

  test('shows a fallback message when the alternate version has no buy options', () => {
    render(
      <EventDetails
        image="/event.jpg"
        issues={mockIssues}
        universe="Marvel"
        eventId="event1"
        alternateVersion={{ title: 'Alternate Event', image: '/alternate.jpg', buyOption1: '', buyOption2: '', buyOption3: '' }}
      />
    );

    expect(screen.getByText('No alternate buy options available.')).toBeInTheDocument();
  });

  test('renders a placeholder image when an issue has no cover image', () => {
    render(
      <EventDetails
        image="/event.jpg"
        issues={[{ _id: '1', name: 'Issue 1', image: '' }]}
        universe="Marvel"
        eventId="event1"
      />
    );

    expect(screen.getByAltText('No cover image available')).toHaveAttribute('src', '/img/no-image-found.jpg');
  });

  test('renders only the "before" context comics when no "after" comics are provided', () => {
    render(
      <EventDetails
        image="/event.jpg"
        issues={mockIssues}
        universe="Marvel"
        eventId="event1"
        additionalContextBefore={[
          { type: 'before', title: 'Before Comic', description: 'Read this first.', image: '/before.jpg' },
        ]}
      />
    );

    expect(screen.getByText('Before Comic')).toBeInTheDocument();
  });

  test('renders only the "after" context comics when no "before" comics are provided', () => {
    render(
      <EventDetails
        image="/event.jpg"
        issues={mockIssues}
        universe="Marvel"
        eventId="event1"
        additionalContextAfter={[
          { type: 'after', title: 'After Comic', description: 'Read this after.', image: '/after.jpg' },
        ]}
      />
    );

    expect(screen.getByText('After Comic')).toBeInTheDocument();
  });

  test('renders additional context comics when provided', () => {
    render(
      <EventDetails
        image="/event.jpg"
        issues={mockIssues}
        universe="Marvel"
        eventId="event1"
        additionalContextBefore={[
          { type: 'before', title: 'Before Comic', description: 'Read this first.', image: '/before.jpg' },
        ]}
        additionalContextAfter={[
          { type: 'after', title: 'After Comic', description: 'Read this after.', image: '/after.jpg' },
        ]}
      />
    );

    expect(screen.getByText('Additional Context')).toBeInTheDocument();
    expect(screen.getByText('Before Comic')).toBeInTheDocument();
    expect(screen.getByText('After Comic')).toBeInTheDocument();
  });

  test('does not render additional context when none is provided', () => {
    render(<EventDetails image="/event.jpg" issues={mockIssues} universe="Marvel" eventId="event1" />);

    expect(screen.queryByText('Additional Context')).not.toBeInTheDocument();
  });

  test('all buy links have correct accessibility attributes', () => {
    render(<EventDetails image="/event.jpg" issues={mockIssues} universe="Marvel" eventId="event1" buyOption1="https://amazon.com/event" />);

    const buyButton = screen.getByRole('link', { name: /buy event on amazon eu/i });
    expect(buyButton).toHaveAttribute('target', '_blank');
    expect(buyButton).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
