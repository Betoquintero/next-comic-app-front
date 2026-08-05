import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfileView from '../components/ProfileView';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

// Mock de hooks y funciones externas
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

// Exposes the props ProfileView passes down so tests can exercise
// deleteEventFromCollection / toggleReadStatus and inspect the resulting collection.
// eslint-disable-next-line react/display-name
jest.mock('../components/ProfileEventCollection', () => (props: {
  collection: { events: { _id: string; issues: { _id: string; readStatus: boolean }[] }[] };
  deleteEventFromCollection: (eventId: string) => void;
  toggleReadStatus: (issueId: string) => void;
}) => (
  <div data-testid="profile-event-collection">
    {props.collection.events.map((event) => (
      <div key={event._id} data-testid={`event-${event._id}`}>
        {event.issues.map((issue) => (
          <span key={issue._id} data-testid={`read-status-${issue._id}`}>
            {issue.readStatus ? 'read' : 'unread'}
          </span>
        ))}
      </div>
    ))}
    <button onClick={() => props.deleteEventFromCollection('event1')}>Delete Event</button>
    <button onClick={() => props.toggleReadStatus('issue1')}>Toggle Read</button>
  </div>
));

const mockFetch = (response: Partial<Response>) => {
  global.fetch = jest.fn(() => Promise.resolve(response as Response));
};

describe('ProfileView Component', () => {
  let mockRouter: { push: jest.Mock };
  let mockLogoutUser: jest.Mock;

  const mockUserData = {
    _id: '123',
    userId: 'user123',
    events: [
      {
        _id: 'event1',
        universe: 'Marvel',
        name: 'Avengers Event',
        order: '1',
        years: '2022',
        image: '/avengers.jpg',
        issues: [
          { _id: 'issue1', name: 'Issue 1', image: '/issue1.jpg', readStatus: false },
        ],
      },
    ],
    issues: [],
    createdAt: '2023-01-01',
    updatedAt: '2023-01-02',
    __v: 0,
  };

  // Waits for the mount-time GET /readStatuses call (triggered by useEffect) to settle,
  // so it doesn't interfere with the fetch mock a test sets up for its own action.
  const renderAndWaitForMount = async () => {
    render(<ProfileView userData={mockUserData} />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockLogoutUser = jest.fn();
    mockRouter = { push: jest.fn() };

    (useAuth as jest.Mock).mockReturnValue({
      user: { _id: '123', username: 'testuser' },
      logoutUser: mockLogoutUser,
    });

    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    // Default mount-time response: no read statuses yet, matches a fresh collection.
    mockFetch({ ok: true, json: () => Promise.resolve([]) });
  });

  test('renders welcome message with username', async () => {
    await renderAndWaitForMount();

    expect(screen.getByText(/Welcome to your profile page, testuser!/i)).toBeInTheDocument();
  });

  test('renders profile event collection component', async () => {
    await renderAndWaitForMount();

    expect(screen.getByTestId('profile-event-collection')).toBeInTheDocument();
  });

  test('navigates to profile edit page when clicking "Edit your profile"', async () => {
    await renderAndWaitForMount();

    fireEvent.click(screen.getByText(/Edit your profile/i));
    expect(mockRouter.push).toHaveBeenCalledWith('/profile/edit');
  });

  test('navigates to DC section when clicking "Go to the DC section"', async () => {
    await renderAndWaitForMount();

    fireEvent.click(screen.getByText(/Go to the DC section/i));
    expect(mockRouter.push).toHaveBeenCalledWith('/parts/DC');
  });

  test('navigates to Marvel section when clicking "Go to the Marvel section"', async () => {
    await renderAndWaitForMount();

    fireEvent.click(screen.getByText(/Go to the Marvel section/i));
    expect(mockRouter.push).toHaveBeenCalledWith('/parts/MARVEL');
  });

  test('shows loading message when user is not available', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null });

    await renderAndWaitForMount();

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  describe('fetching read statuses on mount', () => {
    test('applies the read status returned for a matching issue', async () => {
      mockFetch({ ok: true, json: () => Promise.resolve([{ issueId: { _id: 'issue1' }, isRead: true }]) });

      render(<ProfileView userData={mockUserData} />);

      await waitFor(() => {
        expect(screen.getByTestId('read-status-issue1')).toHaveTextContent('read');
      });
    });

    test('defaults to unread when no matching status is returned', async () => {
      mockFetch({ ok: true, json: () => Promise.resolve([]) });

      render(<ProfileView userData={mockUserData} />);

      await waitFor(() => {
        expect(screen.getByTestId('read-status-issue1')).toHaveTextContent('unread');
      });
    });

    test('logs an error when the read statuses request is not ok', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockFetch({ ok: false });

      render(<ProfileView userData={mockUserData} />);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch read statuses');
      });
      consoleSpy.mockRestore();
    });

    test('logs an error when the read statuses request throws', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

      render(<ProfileView userData={mockUserData} />);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error fetching read statuses:', expect.any(Error));
      });
      consoleSpy.mockRestore();
    });
  });

  describe('deleting the account', () => {
    test('confirms and deletes account', async () => {
      await renderAndWaitForMount();
      global.confirm = jest.fn(() => true);
      mockFetch({ ok: true, json: () => Promise.resolve({}) });

      fireEvent.click(screen.getByText(/Delete account/i));

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Account deleted successfully.', expect.any(Object));
        expect(mockLogoutUser).toHaveBeenCalled();
        expect(mockRouter.push).toHaveBeenCalledWith('/');
      });
    });

    test('does not delete the account when the confirmation is dismissed', async () => {
      await renderAndWaitForMount();
      global.confirm = jest.fn(() => false);
      const fetchSpy = jest.fn();
      global.fetch = fetchSpy;

      fireEvent.click(screen.getByText(/Delete account/i));

      expect(fetchSpy).not.toHaveBeenCalled();
    });

    test('shows error toast when account deletion fails', async () => {
      await renderAndWaitForMount();
      global.confirm = jest.fn(() => true);
      mockFetch({ ok: false });

      fireEvent.click(screen.getByText(/Delete account/i));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to delete account', expect.any(Object));
      });
    });

    test('shows error toast when the delete request throws', async () => {
      await renderAndWaitForMount();
      global.confirm = jest.fn(() => true);
      global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

      fireEvent.click(screen.getByText(/Delete account/i));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('An error occurred while deleting the account', expect.any(Object));
      });
    });
  });

  describe('deleting an event from the collection', () => {
    test('removes the event and shows a success toast', async () => {
      await renderAndWaitForMount();
      mockFetch({ ok: true, json: () => Promise.resolve({}) });

      fireEvent.click(screen.getByText('Delete Event'));

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Event removed from collection.', expect.any(Object));
        expect(screen.queryByTestId('event-event1')).not.toBeInTheDocument();
      });
    });

    test('does nothing when the request is not ok', async () => {
      await renderAndWaitForMount();
      mockFetch({ ok: false });

      fireEvent.click(screen.getByText('Delete Event'));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });
      expect(toast.success).not.toHaveBeenCalled();
      expect(screen.getByTestId('event-event1')).toBeInTheDocument();
    });

    test('shows an error toast when the request throws', async () => {
      await renderAndWaitForMount();
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

      fireEvent.click(screen.getByText('Delete Event'));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'An error occurred while removing the event from the collection.',
          expect.any(Object)
        );
      });
      consoleSpy.mockRestore();
    });
  });

  describe('toggling an issue read status', () => {
    test('updates the issue when the request succeeds', async () => {
      await renderAndWaitForMount();
      mockFetch({ ok: true, json: () => Promise.resolve({ isRead: true }) });

      fireEvent.click(screen.getByText('Toggle Read'));

      await waitFor(() => {
        expect(screen.getByTestId('read-status-issue1')).toHaveTextContent('read');
      });
    });

    test('logs an error when the request is not ok', async () => {
      await renderAndWaitForMount();
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockFetch({ ok: false });

      fireEvent.click(screen.getByText('Toggle Read'));

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to toggle read status');
      });
      consoleSpy.mockRestore();
    });

    test('logs an error when the request throws', async () => {
      await renderAndWaitForMount();
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

      fireEvent.click(screen.getByText('Toggle Read'));

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error toggling read status:', expect.any(Error));
      });
      consoleSpy.mockRestore();
    });

    test('leaves other issues untouched when toggling one issue', async () => {
      const userDataWithTwoIssues = {
        ...mockUserData,
        events: [
          {
            ...mockUserData.events[0],
            issues: [
              { _id: 'issue1', name: 'Issue 1', image: '/issue1.jpg', readStatus: false },
              { _id: 'issue2', name: 'Issue 2', image: '/issue2.jpg', readStatus: false },
            ],
          },
        ],
      };
      render(<ProfileView userData={userDataWithTwoIssues} />);
      await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
      mockFetch({ ok: true, json: () => Promise.resolve({ isRead: true }) });

      fireEvent.click(screen.getByText('Toggle Read'));

      await waitFor(() => {
        expect(screen.getByTestId('read-status-issue1')).toHaveTextContent('read');
      });
      expect(screen.getByTestId('read-status-issue2')).toHaveTextContent('unread');
    });
  });

  test('falls back to empty events and issues when userData is not provided', async () => {
    render(<ProfileView userData={undefined as unknown as typeof mockUserData} />);
    await waitFor(() => expect(global.fetch).not.toHaveBeenCalled());

    expect(screen.queryByTestId('profile-event-collection')).toBeInTheDocument();
    expect(screen.getByText('No events to show. Visit the events page to start collecting!')).toBeInTheDocument();
  });
});
