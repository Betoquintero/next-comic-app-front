'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Issue {
  _id: string;
  name: string;
  image: string;
  readStatus: boolean;
}

interface Event {
  _id: string;
  name: string;
  image: string;
  issues: Issue[];
}

interface ProfileEventCollectionProps {
  collection: {
    events: Event[];
  };
  deleteEvent: (eventId: string) => void;
  toggleReadStatus: (issueId: string) => void;
}

const ProfileEventCollection: React.FC<ProfileEventCollectionProps> = ({
  collection,
  deleteEvent,
  toggleReadStatus,
}) => {
  return (
    <div className="cardsContainer">
      {collection?.events.map((event) => (
        <div key={event._id} className="eventIssue flex flex-wrap p-4 border rounded-lg shadow-lg bg-gray-100 mb-6">
          <div className="eventProfileContainer w-full lg:w-1/4">
            <div className="collectionAndEventsProfileTitle text-center mb-4">
              <strong>Event</strong>
            </div>
            <div className="card bg-white rounded-lg shadow-lg">
              <Link href={`/events/${event._id}`} className="block">
                <Image
                  src={event.image}
                  alt={event.name}
                  width={200}
                  height={200}
                  className="rounded-t-lg"
                  objectFit="cover"
                />
                <div className="p-4 text-center">
                  <h4 className="text-gray-800 font-semibold">{event.name}</h4>
                </div>
              </Link>
            </div>
            <div className="deleteCollectionContainer mt-4 text-center">
              <button
                className="deleteEventCollection bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-700"
                onClick={() => deleteEvent(event._id)}
              >
                Delete event
              </button>
            </div>
          </div>
          <div className="profileCardsContainer w-full lg:w-3/4 flex flex-wrap justify-start mt-6 lg:mt-0 lg:pl-6">
            <div className="collectionAndEventsProfileTitle w-full text-center mb-4">
              <strong>Collection of issues</strong>
            </div>
            {event.issues.map((issue) => (
              <div key={issue._id} className="readmarkerAndIssue w-1/2 md:w-1/3 lg:w-1/4 p-2">
                <div className={`card bg-white rounded-lg shadow-lg ${issue.readStatus ? 'opacity-50' : ''}`}>
                  <Link href={`/issues/${issue._id}`} className="block">
                    <Image
                      src={issue.image}
                      alt={issue.name}
                      width={200}
                      height={200}
                      className="rounded-t-lg"
                      objectFit="cover"
                    />
                    <div className="p-4 text-center">
                      <h4 className="text-gray-800 font-semibold">{issue.name}</h4>
                    </div>
                  </Link>
                </div>
                <button
                  className="deleteEventCollection mt-2 bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-700 w-full"
                  onClick={() => toggleReadStatus(issue._id)}
                >
                  {issue.readStatus ? 'Mark as Unread' : 'Mark as Read'}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfileEventCollection;
