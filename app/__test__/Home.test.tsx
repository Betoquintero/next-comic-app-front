import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../page';

describe('Home Component Tests', () => {
  beforeEach(() => {
    render(<Home />);
  });

  describe('Header Section', () => {
    it('renders the main heading', () => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Super Heroes Legacy - Your Ultimate Guide to Marvel & DC Comics'
      );
    });

    it('renders the universe section heading', () => {
      expect(
        screen.getByRole('heading', { level: 2, name: /click on one of the universes/i })
      ).toBeInTheDocument();
    });

    it('renders the welcome heading', () => {
      expect(
        screen.getByRole('heading', { level: 2, name: /welcome to super heroes legacy/i })
      ).toBeInTheDocument();
    });
  });

  describe('Navigation Links', () => {
    it('navigates to DC Comics page', () => {
      expect(screen.getByRole('link', { name: /explore dc comics reading order/i })).toHaveAttribute(
        'href',
        '/parts/DC'
      );
    });

    it('navigates to Marvel Comics page', () => {
      expect(screen.getByRole('link', { name: /explore marvel comics reading order/i })).toHaveAttribute(
        'href',
        '/parts/MARVEL'
      );
    });

    it('navigates to signup page', () => {
      expect(screen.getByRole('link', { name: /join the comic community today/i })).toHaveAttribute(
        'href',
        '/signup'
      );
    });

    it('contains a link to Instagram', () => {
      expect(screen.getByRole('link', { name: /instagram/i })).toHaveAttribute(
        'href',
        'https://www.instagram.com/super.heroes.legacy'
      );
    });
  });

  describe('Image Accessibility', () => {
    it('renders Super Heroes Legacy logo with correct alt text', () => {
      expect(screen.getByAltText('Super Heroes Legacy Logo')).toBeInTheDocument();
    });

    it('renders DC Comics logo with correct alt text', () => {
      expect(screen.getByAltText('Explore DC Comics Reading Order')).toBeInTheDocument();
    });

    it('renders Marvel Comics logo with correct alt text', () => {
      expect(screen.getByAltText('Explore Marvel Comics Reading Order')).toBeInTheDocument();
    });
  });

  describe('Call-to-Action Section', () => {
    it('renders community signup section', () => {
      expect(screen.getByText(/join the super heroes community/i)).toBeInTheDocument();
      expect(
        screen.getByText(/sign up to access your personal comic collections/i)
      ).toBeInTheDocument();
    });
  });
});
