import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfileEventCollection from '../components/ProfileEventCollection';

describe('ProfileEventCollection Component', () => {
  const mockDeleteEventFromCollection = jest.fn();
  const mockToggleReadStatus = jest.fn();

  const collection = {
    events: [
      {
        _id: 'event1',
        name: 'Event 1',
        image: '/event1.jpg',
        issues: [
          { _id: 'issue1', name: 'Issue 1', image: '/issue1.jpg', readStatus: false },
          { _id: 'issue2', name: 'Issue 2', image: '/issue2.jpg', readStatus: true },
        ],
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders events and issues correctly', () => {
    render(
      <ProfileEventCollection
        collection={collection}
        deleteEventFromCollection={mockDeleteEventFromCollection}
        toggleReadStatus={mockToggleReadStatus}
      />
    );

    // Check if event is rendered
    const eventName = screen.getByText('Event 1');
    expect(eventName).toBeInTheDocument();

    // Check if issues are rendered
    const issueName1 = screen.getByText('Issue 1');
    const issueName2 = screen.getByText('Issue 2');
    expect(issueName1).toBeInTheDocument();
    expect(issueName2).toBeInTheDocument();
  });

  test('calls deleteEventFromCollection when delete button is clicked', () => {
    render(
      <ProfileEventCollection
        collection={collection}
        deleteEventFromCollection={mockDeleteEventFromCollection}
        toggleReadStatus={mockToggleReadStatus}
      />
    );

    const deleteButton = screen.getByText('Delete event');
    fireEvent.click(deleteButton);

    expect(mockDeleteEventFromCollection).toHaveBeenCalledWith('event1');
  });

  test('calls toggleReadStatus when Mark as Read/Unread button is clicked', () => {
    render(
      <ProfileEventCollection
        collection={collection}
        deleteEventFromCollection={mockDeleteEventFromCollection}
        toggleReadStatus={mockToggleReadStatus}
      />
    );

    const toggleButton = screen.getByText('Mark as Read');
    fireEvent.click(toggleButton);

    expect(mockToggleReadStatus).toHaveBeenCalledWith('issue1');
  });

  test('renders correct button text based on read status', () => {
    render(
      <ProfileEventCollection
        collection={collection}
        deleteEventFromCollection={mockDeleteEventFromCollection}
        toggleReadStatus={mockToggleReadStatus}
      />
    );

    // Check button text for unread issue
    const unreadButton = screen.getByText('Mark as Read');
    expect(unreadButton).toBeInTheDocument();

    // Check button text for read issue
    const readButton = screen.getByText('Mark as Unread');
    expect(readButton).toBeInTheDocument();
  });

  test('applies correct class for read issue', () => {
    render(
      <ProfileEventCollection
        collection={collection}
        deleteEventFromCollection={mockDeleteEventFromCollection}
        toggleReadStatus={mockToggleReadStatus}
      />
    );

    const readIssueCard = screen.getByText('Issue 2').closest('.card');
    expect(readIssueCard).toHaveClass('opacity-50');
  });
});
