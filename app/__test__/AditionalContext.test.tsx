import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdditionalContext from '../components/AditionalContext';

describe('AdditionalContext Component', () => {
  test('renders nothing when contextComics is empty', () => {
    const { container } = render(<AdditionalContext contextComics={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  test('only renders the "before" section when there are no "after" comics', () => {
    render(
      <AdditionalContext
        contextComics={[
          { title: 'Before Comic', description: 'A comic to read before.', type: 'before' },
        ]}
      />
    );

    expect(screen.getByText('What to Read Before the Event')).toBeInTheDocument();
    expect(screen.queryByText('What to Read After the Event')).not.toBeInTheDocument();
    expect(screen.getByText('Before Comic')).toBeInTheDocument();
  });

  test('only renders the "after" section when there are no "before" comics', () => {
    render(
      <AdditionalContext
        contextComics={[
          { title: 'After Comic', description: 'A comic to read after.', type: 'after' },
        ]}
      />
    );

    expect(screen.getByText('What to Read After the Event')).toBeInTheDocument();
    expect(screen.queryByText('What to Read Before the Event')).not.toBeInTheDocument();
    expect(screen.getByText('After Comic')).toBeInTheDocument();
  });

  test('sorts comics into their respective before/after sections', () => {
    render(
      <AdditionalContext
        contextComics={[
          { title: 'Before Comic', description: 'Before.', type: 'before' },
          { title: 'After Comic', description: 'After.', type: 'after' },
        ]}
      />
    );

    expect(screen.getByText('What to Read Before the Event')).toBeInTheDocument();
    expect(screen.getByText('What to Read After the Event')).toBeInTheDocument();
    expect(screen.getByText('Before Comic')).toBeInTheDocument();
    expect(screen.getByText('After Comic')).toBeInTheDocument();
  });

  test('renders the image only when one is provided', () => {
    render(
      <AdditionalContext
        contextComics={[
          { title: 'With Image', description: 'Has a cover.', type: 'before', image: '/cover.jpg' },
          { title: 'Without Image', description: 'No cover.', type: 'before' },
        ]}
      />
    );

    expect(screen.getByAltText('Cover of With Image')).toHaveAttribute('src', '/cover.jpg');
    expect(screen.queryByAltText('Cover of Without Image')).not.toBeInTheDocument();
  });

  test('renders the relevance to event only when provided', () => {
    render(
      <AdditionalContext
        contextComics={[
          {
            title: 'Relevant Comic',
            description: 'Desc.',
            type: 'before',
            relevanceToEvent: 'Sets up the villain.',
          },
        ]}
      />
    );

    expect(screen.getByText('Relevance to the event')).toBeInTheDocument();
    expect(screen.getByText('Sets up the villain.')).toBeInTheDocument();
  });

  test('does not render the relevance block when not provided', () => {
    render(
      <AdditionalContext
        contextComics={[{ title: 'Plain Comic', description: 'Desc.', type: 'before' }]}
      />
    );

    expect(screen.queryByText('Relevance to the event')).not.toBeInTheDocument();
  });

  test('renders only the buy options that are provided', () => {
    render(
      <AdditionalContext
        contextComics={[
          {
            title: 'Buyable Comic',
            description: 'Desc.',
            type: 'before',
            buyOption1: 'https://amazon.eu/comic',
            buyOption3: 'https://amazon.com/kindle-comic',
          },
        ]}
      />
    );

    const euLink = screen.getByText('Buy on Amazon EU');
    expect(euLink).toHaveAttribute('href', 'https://amazon.eu/comic');
    expect(screen.getByText('Buy for Kindle')).toHaveAttribute('href', 'https://amazon.com/kindle-comic');
    expect(screen.queryByText('Buy on Amazon US')).not.toBeInTheDocument();
  });

  test('renders the "Buy on Amazon US" option when buyOption2 is provided', () => {
    render(
      <AdditionalContext
        contextComics={[
          { title: 'US Buyable Comic', description: 'Desc.', type: 'before', buyOption2: 'https://amazon.com/comic' },
        ]}
      />
    );

    expect(screen.getByText('Buy on Amazon US')).toHaveAttribute('href', 'https://amazon.com/comic');
  });

  test('renders image, relevance, and buy options for "after" comics too', () => {
    render(
      <AdditionalContext
        contextComics={[
          {
            title: 'After Comic',
            description: 'Desc.',
            type: 'after',
            image: '/after-cover.jpg',
            relevanceToEvent: 'Follows up on the fallout.',
            buyOption1: 'https://amazon.eu/after',
            buyOption2: 'https://amazon.com/after',
            buyOption3: 'https://amazon.com/kindle-after',
          },
        ]}
      />
    );

    expect(screen.getByAltText('Cover of After Comic')).toHaveAttribute('src', '/after-cover.jpg');
    expect(screen.getByText('Follows up on the fallout.')).toBeInTheDocument();
    expect(screen.getByText('Buy on Amazon EU')).toHaveAttribute('href', 'https://amazon.eu/after');
    expect(screen.getByText('Buy on Amazon US')).toHaveAttribute('href', 'https://amazon.com/after');
    expect(screen.getByText('Buy for Kindle')).toHaveAttribute('href', 'https://amazon.com/kindle-after');
  });
});
