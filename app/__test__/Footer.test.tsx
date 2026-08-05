import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from '../components/Footer';

// Mockeamos Next.js Link
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href} data-testid={`link-${href}`}>
      {children}
    </a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

describe('Footer Component', () => {
  
  test('renders copyright disclaimer text', () => {
    render(<Footer />);
    
    expect(
      screen.getByText(/all images are owned by their respective copyright owners and are used under fair use./i)
    ).toBeInTheDocument();
  });

  test('renders Privacy Policy link correctly', () => {
    render(<Footer />);

    const privacyLink = screen.getByTestId('link-/privacy-policy');
    expect(privacyLink).toBeInTheDocument();
    expect(privacyLink).toHaveAttribute('href', '/privacy-policy');
  });

  test('renders Terms of Use link correctly', () => {
    render(<Footer />);

    const termsLink = screen.getByTestId('link-/tou');
    expect(termsLink).toBeInTheDocument();
    expect(termsLink).toHaveAttribute('href', '/tou');
  });

});
