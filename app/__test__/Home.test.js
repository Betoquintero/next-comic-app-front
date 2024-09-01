import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../page';

describe('Home Component', () => {
  beforeEach(() => {
    render(<Home />);
  });

  test('displays main content correctly', () => {
    expect(screen.getByText(/Welcome to House of heroes/i)).toBeInTheDocument();
  });

  test('renders Signup link and navigates correctly', () => {
    const link = screen.getByText('Signup');
    expect(link).toHaveAttribute('href', '/signup');
  });

  test('renders all links and images correctly', () => {
    const dcLink = screen.getByAltText(/DC logo/i).closest('a');
    expect(dcLink).toHaveAttribute('href', '/parts/DC');

    const marvelLink = screen.getByAltText(/Marvel logo/i).closest('a');
    expect(marvelLink).toHaveAttribute('href', '/parts/MARVEL');
  });
});
