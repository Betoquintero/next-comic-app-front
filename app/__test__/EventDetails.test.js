import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EventDetails from '../components/EventDetails';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

// Mock useAuth hook
jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock toast
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div />,
}));

describe('EventDetails Component', () => {
  const issues = [
    { _id: '1', name: 'Issue 1', image: '/issue1.jpg' },
    { _id: '2', name: 'Issue 2', image: '/issue2.jpg' },
  ];

  beforeEach(() => {
    // Mock return value for useAuth
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { _id: '123' },
    });

    // Mock return value for useRouter
    useRouter.mockReturnValue({
      push: jest.fn(),
    });

    // Clear all mock calls
    jest.clearAllMocks();
  });

  test('shows success toast when event is successfully added to collection', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );

    render(<EventDetails image="/event.jpg" issues={issues} universe="DC" eventId="event1" />);
    
    fireEvent.submit(screen.getByText('Add Event to My Collection'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Successfully added event to collection', {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    });
  });

  test('shows info toast when event is already in collection', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: "Event is already on user's collection" }),
      })
    );

    render(<EventDetails image="/event.jpg" issues={issues} universe="DC" eventId="event1" />);
    
    fireEvent.submit(screen.getByText('Add Event to My Collection'));

    await waitFor(() => {
      expect(toast.info).toHaveBeenCalledWith("Event is already on user's collection", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    });
  });

  test('shows error toast when adding event to collection fails', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
      })
    );

    render(<EventDetails image="/event.jpg" issues={issues} universe="DC" eventId="event1" />);
    
    fireEvent.submit(screen.getByText('Add Event to My Collection'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to add event to collection', {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    });
  });
});
