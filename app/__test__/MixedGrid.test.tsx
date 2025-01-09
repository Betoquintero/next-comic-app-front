import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MixedGrid from '../components/MixedGrid';

describe('MixedGrid Component Tests', () => {
  it('renders the MixedGrid component correctly', () => {
    render(
      <MixedGrid>
        <p>Test content</p>
      </MixedGrid>
    );
    const grid = screen.getByRole('grid');
    expect(grid).toBeInTheDocument();
  });

  it('renders children correctly in the main content area', () => {
    render(
      <MixedGrid>
        <p>Test content</p>
      </MixedGrid>
    );
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies the correct CSS classes to the grid container', () => {
    render(<MixedGrid><p>Test content</p></MixedGrid>);
    const grid = screen.getByRole('grid');
    expect(grid).toHaveClass('grid min-h-screen');
  });

  it('renders all grid sections', () => {
    render(
      <MixedGrid>
        <p>Test content</p>
      </MixedGrid>
    );
    const leftSide = screen.getByTestId('left-side');
    const mainContent = screen.getByTestId('main-content');
    const rightSide = screen.getByTestId('right-side');

    expect(leftSide).toBeInTheDocument();
    expect(mainContent).toBeInTheDocument();
    expect(rightSide).toBeInTheDocument();
  });
});
