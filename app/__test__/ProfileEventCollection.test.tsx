import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfileEventCollection from '../components/ProfileEventCollection';
import { useRouter } from 'next/navigation';

// Mockeamos useRouter de Next.js
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('ProfileEventCollection Component', () => {
  let mockRouter: { refresh: jest.Mock };
  let mockDeleteEventFromCollection: jest.Mock;
  let mockToggleReadStatus: jest.Mock;

  const mockCollection = {
    events: [
      {
        _id: 'event1',
        universe: 'Marvel',
        name: 'Avengers Event',
        order: '1',
        years: '2022',
        image: '/avengers.jpg',
        issues: [
          { _id: 'issue1', name: 'Issue 1', image: '/issue1.jpg', readStatus: false },
          { _id: 'issue2', name: 'Issue 2', image: '/issue2.jpg', readStatus: true },
        ],
      },
    ],
    issues: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockRouter = { refresh: jest.fn() };
    mockDeleteEventFromCollection = jest.fn();
    mockToggleReadStatus = jest.fn();

    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  test('renders event and issues correctly', () => {
    render(
      <ProfileEventCollection
        collection={mockCollection}
        deleteEventFromCollection={mockDeleteEventFromCollection}
        toggleReadStatus={mockToggleReadStatus}
      />
    );

    expect(screen.getByText('Avengers Event')).toBeInTheDocument();
    expect(screen.getByText('Issue 1')).toBeInTheDocument();
    expect(screen.getByText('Issue 2')).toBeInTheDocument();
  });

  test('expands and collapses event collection', () => {
    render(
      <ProfileEventCollection
        collection={mockCollection}
        deleteEventFromCollection={mockDeleteEventFromCollection}
        toggleReadStatus={mockToggleReadStatus}
      />
    );

    const expandButton = screen.getByText(/Expand collection/i);
    fireEvent.click(expandButton);
    expect(screen.getByText(/Collapse collection/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Collapse collection/i));
    expect(screen.getByText(/Expand collection/i)).toBeInTheDocument();
  });

  test('calls delete event function when delete button is clicked', async () => {
    render(
      <ProfileEventCollection
        collection={mockCollection}
        deleteEventFromCollection={mockDeleteEventFromCollection}
        toggleReadStatus={mockToggleReadStatus}
      />
    );

    fireEvent.click(screen.getByText(/Delete event/i));

    await waitFor(() => {
      expect(mockDeleteEventFromCollection).toHaveBeenCalledWith('event1');
      expect(mockRouter.refresh).toHaveBeenCalled();
    });
  });

  test('toggles read status when clicking read button', async () => {
    render(
      <ProfileEventCollection
        collection={mockCollection}
        deleteEventFromCollection={mockDeleteEventFromCollection}
        toggleReadStatus={mockToggleReadStatus}
      />
    );

    fireEvent.click(screen.getByText(/Mark as Read/i));

    await waitFor(() => {
      expect(mockToggleReadStatus).toHaveBeenCalledWith('issue1');
    });

    fireEvent.click(screen.getByText(/Mark as Unread/i));

    await waitFor(() => {
      expect(mockToggleReadStatus).toHaveBeenCalledWith('issue2');
    });
  });
});
