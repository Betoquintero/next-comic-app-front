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

    // Find and click "Mark as Read" button for unread issue
    const toggleButton = screen.getByText('Mark as Read');
    fireEvent.click(toggleButton);
    expect(mockToggleReadStatus).toHaveBeenCalledWith('issue1');

    // Find and click "Mark as Unread" button for read issue
    const toggleUnreadButton = screen.getByText('Mark as Unread');
    fireEvent.click(toggleUnreadButton);
    expect(mockToggleReadStatus).toHaveBeenCalledWith('issue2');
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

 
 //TODO
  // test('applies correct styles for read and unread issues', () => {
  //   render(
  //     <ProfileEventCollection
  //       collection={collection}
  //       deleteEventFromCollection={mockDeleteEventFromCollection}
  //       toggleReadStatus={mockToggleReadStatus}
  //     />
  //   );
  
  //   // Check that Issue 2 (read issue) has 'opacity-50' (which means opacity is 0.5)
  //   const readIssueImage = screen.getByAltText('Issue 2');
  //   const readIssueContainer = readIssueImage.closest('div'); // Get the closest wrapping div
  //   console.log(window.getComputedStyle(readIssueContainer).opacity); // Log the opacity value
  //   expect(window.getComputedStyle(readIssueContainer).opacity).toBe('0.5'); // Assert opacity is 0.5
  
  //   // Check that Issue 1 (unread issue) has 'opacity-100' (which means opacity is 1)
  //   const unreadIssueImage = screen.getByAltText('Issue 1');
  //   const unreadIssueContainer = unreadIssueImage.closest('div'); // Get the closest wrapping div
  //   console.log(window.getComputedStyle(unreadIssueContainer).opacity); // Log the opacity value
  //   expect(window.getComputedStyle(unreadIssueContainer).opacity).toBe('1'); // Assert opacity is 1
  // });
  
  
});
