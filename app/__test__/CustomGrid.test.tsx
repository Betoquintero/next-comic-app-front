import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomGrid from '../components/CustomGrid';

describe('CustomGrid Component Tests', () => {
  it('renders the CustomGrid component correctly', () => {
    render(
      <CustomGrid universe="DC">
        <p>Test content</p>
      </CustomGrid>
    );

    const grid = screen.getByRole('grid');
    expect(grid).toBeInTheDocument();
  });

  it('renders children correctly in the main content area', () => {
    render(
      <CustomGrid universe="Marvel">
        <p>Test content</p>
      </CustomGrid>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies the correct background class based on the universe (DC)', () => {
    render(
      <CustomGrid universe="DC">
        <p>Test content</p>
      </CustomGrid>
    );

    const header = screen.getByTestId('header');
    expect(header).toHaveClass('bg-dc-background');
  });

  it('applies the correct background class based on the universe (Marvel)', () => {
    render(
      <CustomGrid universe="Marvel">
        <p>Test content</p>
      </CustomGrid>
    );

    const header = screen.getByTestId('header');
    expect(header).toHaveClass('bg-marvel-background');
  });

  it('applies the correct side panel colors based on the universe (DC)', () => {
    render(
      <CustomGrid universe="DC">
        <p>Test content</p>
      </CustomGrid>
    );

    const leftSide = screen.getByTestId('left-side');
    const rightSide = screen.getByTestId('right-side');

    expect(leftSide).toHaveClass('bg-dc-blue');
    expect(rightSide).toHaveClass('bg-dc-blue');
  });

  it('applies the correct side panel colors based on the universe (Marvel)', () => {
    render(
      <CustomGrid universe="Marvel">
        <p>Test content</p>
      </CustomGrid>
    );

    const leftSide = screen.getByTestId('left-side');
    const rightSide = screen.getByTestId('right-side');

    expect(leftSide).toHaveClass('bg-marvel-red');
    expect(rightSide).toHaveClass('bg-marvel-red');
  });
});
