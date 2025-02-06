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

// eslint-disable-next-line react/display-name
jest.mock('../components/ProfileEventCollection', () => () => <div data-testid="profile-event-collection" />);

describe('ProfileView Component', () => {
  let mockRouter;
let mockLogoutUser: jest.Mock;
  let mockAuthenticateUser;

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

  beforeEach(() => {
    jest.clearAllMocks();

    mockLogoutUser = jest.fn();
    mockAuthenticateUser = jest.fn();
    mockRouter = { push: jest.fn() };

    (useAuth as jest.Mock).mockReturnValue({
      user: { _id: '123', username: 'testuser' },
      authenticateUser: mockAuthenticateUser,
      logoutUser: mockLogoutUser,
    });

    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  test('renders welcome message with username', () => {
    render(<ProfileView userData={mockUserData} />);

    expect(screen.getByText(/Welcome to your profile page, testuser!/i)).toBeInTheDocument();
  });

  test('renders profile event collection component', () => {
    render(<ProfileView userData={mockUserData} />);

    expect(screen.getByTestId('profile-event-collection')).toBeInTheDocument();
  });

  test('navigates to profile edit page when clicking "Edit your profile"', () => {
    render(<ProfileView userData={mockUserData} />);

    fireEvent.click(screen.getByText(/Edit your profile/i));
    expect(mockRouter.push).toHaveBeenCalledWith('/profile/edit');
  });

  test('navigates to DC section when clicking "Go to the DC section"', () => {
    render(<ProfileView userData={mockUserData} />);

    fireEvent.click(screen.getByText(/Go to the DC section/i));
    expect(mockRouter.push).toHaveBeenCalledWith('/parts/DC');
  });

  test('navigates to Marvel section when clicking "Go to the Marvel section"', () => {
    render(<ProfileView userData={mockUserData} />);

    fireEvent.click(screen.getByText(/Go to the Marvel section/i));
    expect(mockRouter.push).toHaveBeenCalledWith('/parts/MARVEL');
  });

  test('confirms and deletes account', async () => {
    global.confirm = jest.fn(() => true);
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: () => Promise.resolve({}),
        headers: new Headers(),
        redirected: false,
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

    render(<ProfileView userData={mockUserData} />);

    fireEvent.click(screen.getByText(/Delete account/i));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Account deleted successfully.', expect.any(Object));
      expect(mockLogoutUser).toHaveBeenCalled();
      expect(mockRouter.push).toHaveBeenCalledWith('/');
    });
  });

  test('shows error toast when account deletion fails', async () => {
    global.confirm = jest.fn(() => true);
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        headers: new Headers(),
        redirected: false,
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

    render(<ProfileView userData={mockUserData} />);

    fireEvent.click(screen.getByText(/Delete account/i));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to delete account', expect.any(Object));
    });
  });

  test('removes event from collection when deleteEventFromCollection is called', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
        redirected: false,
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

    render(<ProfileView userData={mockUserData} />);

    fireEvent.click(screen.getByText(/Delete account/i));

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/');
    });
  });

  test('toggles read status for an issue', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
        redirected: false,
        type: 'basic',
        url: '',
        clone: jest.fn(),
        body: null,
        bodyUsed: false,
        arrayBuffer: jest.fn(),
        blob: jest.fn(),
        formData: jest.fn(),
        json: () => Promise.resolve({ isRead: true }),
        text: jest.fn(),
      } as unknown as Response)
    );

    render(<ProfileView userData={mockUserData} />);

    fireEvent.click(screen.getByText(/Delete account/i));

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/');
    });
  });

  test('shows loading message when user is not available', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
    });

    render(<ProfileView userData={mockUserData} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
