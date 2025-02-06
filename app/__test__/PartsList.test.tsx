import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PartsList from '../components/PartsList';
import { Part } from '../../lib/api';

const mockParts: Part[] = [
  {
    _id: '1',
    universe: 'Marvel',
    name: 'Part 1',
    years: '1991-1992',
    description: 'The Infinity Saga is one of the most epic storylines in Marvel history.',
    events: [],
    issues: [],
  },
  {
    _id: '2',
    universe: 'Marvel',
    name: 'Part 2',
    years: '1984-1985',
    description: 'The Secret Wars event changed the Marvel universe forever.',
    events: [],
    issues: [],
  },
];

describe('PartsList Component', () => {
  test('renders parts correctly', () => {
    render(<PartsList parts={mockParts} universe="Marvel" />);

    // Check that the header and description are rendered
    expect(screen.getByText('Explore the Marvel Universe')).toBeInTheDocument();
    expect(screen.getByText(/Discover key parts of the Marvel universe/i)).toBeInTheDocument();

    // Verify parts names
    mockParts.forEach((part) => {
      expect(screen.getByText(part.name)).toBeInTheDocument();
      expect(screen.getByText(part.years as string)).toBeInTheDocument();
    });
  });
  test('expands description on "Read more" click', () => {
    render(<PartsList parts={mockParts} universe="Marvel" />);
  
    const readMoreLink = screen.getByText(/Read more about Part 1/i);
    expect(readMoreLink).toBeInTheDocument();
  
    fireEvent.click(readMoreLink);
    expect(screen.getByText('The Infinity Saga is one of the most epic storylines in Marvel history.')).toBeInTheDocument();
  });
  
  test('collapses description on "Show less" click', () => {
    render(<PartsList parts={mockParts} universe="Marvel" />);
  
    const readMoreLink = screen.getByText(/Read more about Part 1/i);
    fireEvent.click(readMoreLink);
  
    const showLessLink = screen.getByText(/Show less/i);
    expect(showLessLink).toBeInTheDocument();
  
    fireEvent.click(showLessLink);
    expect(screen.queryByText('The Infinity Saga is one of the most epic storylines in Marvel history.')).not.toBeInTheDocument();
  });

  test('renders links for each part', () => {
    render(<PartsList parts={mockParts} universe="Marvel" />);
  
    mockParts.forEach((part) => {
      const link = screen.getByText(`Explore ${part.name}`);
      expect(link.closest('a')).toHaveAttribute('href', `/parts/${part.universe}/${part._id}`);
    });
  });
});
