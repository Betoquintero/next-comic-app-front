import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PartDetails from '../components/PartDetails';
import { useRouter } from 'next/navigation';

// Mock useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('PartDetails Component', () => {
  const events = [
    { _id: '1', name: 'Event 1', image: '/event1.jpg' },
    { _id: '2', name: 'Event 2', image: '/event2.jpg' },
  ];

  test('renders the correct number of events', () => {
    render(<PartDetails events={events} universe="DC" />);
    const eventElements = screen.getAllByAltText(/image$/i);
    expect(eventElements.length).toBe(2);
  });

  test('renders event images correctly', () => {
    render(<PartDetails events={events} universe="DC" />);
    events.forEach((event) => {
      const eventImage = screen.getByAltText(`${event.name} image`);
      expect(eventImage).toHaveAttribute('src', event.image);
    });
  });

  test('renders event names correctly', () => {
    render(<PartDetails events={events} universe="DC" />);
    events.forEach((event) => {
      expect(screen.getByText(event.name)).toBeInTheDocument();
    });
  });

  test('links to the correct event pages', () => {
    render(<PartDetails events={events} universe="DC" />);
    events.forEach((event) => {
      const link = screen.getByText(event.name).closest('a');
      expect(link).toHaveAttribute('href', `/events/${event._id}`);
    });
  });
});
