import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EventDetails from '../components/EventDetails';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

// Mock useAuth hook
jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
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
  });

  test('renders main event image correctly', () => {
    render(<EventDetails image="/event.jpg" issues={issues} universe="DC" eventId="event1" />);
    const eventImage = screen.getByAltText('Event image');
    expect(eventImage).toHaveAttribute('src', '/event.jpg');
    expect(eventImage).toHaveAttribute('width', '200');
    expect(eventImage).toHaveAttribute('height', '200');
  });

  test('renders the correct number of issues', () => {
    render(<EventDetails image="/event.jpg" issues={issues} universe="DC" eventId="event1" />);
    const issueElements = screen.getAllByAltText(/image$/i);
    expect(issueElements.length).toBe(3);
  });

  test('renders "Add Event to My Collection" button when authenticated', () => {
    render(<EventDetails image="/event.jpg" issues={issues} universe="DC" eventId="event1" />);
    expect(screen.getByText('Add Event to My Collection')).toBeInTheDocument();
  });

// TODO: MAYBE CREATE A DIALOG WITH THE ERROR
  //   test('displays error message if add to collection fails', async () => {
//     jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Failed to add event to collection'));

//     render(<EventDetails image="/event.jpg" issues={issues} universe="DC" eventId="event1" />);

//     fireEvent.click(screen.getByText('Add Event to My Collection'));

//     await waitFor(() => {
//       expect(screen.getByText('Add Event to My Collection')).toBeInTheDocument();
//       expect(window.alert).toHaveBeenCalledWith('Failed to add event to collection');
//     });
//   });
});
