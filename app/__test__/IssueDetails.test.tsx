import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import IssueDetails from '../components/IssueDetails';

describe('IssueDetails Component', () => {
  
  test('renders the provided issue image correctly', () => {
    render(<IssueDetails image="/comic-cover.jpg" universe="Marvel" />);

    const comicImage = screen.getByAltText('Marvel comic cover image');
    expect(comicImage).toBeInTheDocument();
    expect(comicImage).toHaveAttribute('src', '/comic-cover.jpg');
  });

  test('renders the fallback image when no image is provided', () => {
    render(<IssueDetails image="" universe="DC" />);

    const fallbackImage = screen.getByAltText('No cover image available');
    expect(fallbackImage).toBeInTheDocument();
    expect(fallbackImage).toHaveAttribute('src', '/img/no-image-found.jpg');
  });

  test('renders different alt text based on the universe prop', () => {
    render(<IssueDetails image="/dc-comic.jpg" universe="DC" />);

    const comicImage = screen.getByAltText('DC comic cover image');
    expect(comicImage).toBeInTheDocument();
  });

});
