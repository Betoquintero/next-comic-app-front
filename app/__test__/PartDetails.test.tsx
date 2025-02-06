import React from 'react';
import { render, screen } from '@testing-library/react';
import PartDetails from '../components/PartDetails';
import '@testing-library/jest-dom';


const mockEvents = [
  { _id: '1', name: 'Infinity Gauntlet', image: '/images/infinity-gauntlet.jpg' },
  { _id: '2', name: 'Secret Wars', image: '/images/secret-wars.jpg' },
];

test('renders event names', () => {
  render(<PartDetails events={mockEvents} universe="Marvel" />);

  mockEvents.forEach((event) => {
    const eventName = screen.getByText(event.name);
    expect(eventName).toBeInTheDocument();
  });
});

test('renders event images with correct attributes', () => {
  render(<PartDetails events={mockEvents} universe="Marvel" />);

  mockEvents.forEach((event) => {
    const eventImage = screen.getByAltText(`Cover of ${event.name} in the Marvel universe`);
    expect(eventImage).toBeInTheDocument();
    expect(eventImage).toHaveAttribute('src', event.image);
  });
});

test('renders event links with correct href', () => {
  render(<PartDetails events={mockEvents} universe="Marvel" />);

  mockEvents.forEach((event) => {
    const eventLink = screen.getByText(event.name).closest('a'); // Obtener el enlace más cercano al texto
    expect(eventLink).toBeInTheDocument();
    expect(eventLink).toHaveAttribute('href', `/events/${event._id}`);
  });
});



