'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Event, Issue } from './ProfileView';
import { useRouter } from 'next/navigation';

interface ProfileEventCollectionProps {
  collection: {
    events: Event[];
    issues: Issue[];
  };
  deleteEventFromCollection: (eventId: string) => void;
  toggleReadStatus: (issueId: string) => void;
}

const ProfileEventCollection: React.FC<ProfileEventCollectionProps> = ({
  collection,
  deleteEventFromCollection,
  toggleReadStatus,
}) => {
  const [events, setEvents] = useState(collection.events);
  const router = useRouter();


  const handleDeleteEvent = async (eventId: string) => {
    await deleteEventFromCollection(eventId);
    setEvents(events.filter(event => event._id !== eventId));
    router.refresh()

  };

  return (
    <div>
      {events.map((event) => (
        <div
          key={event._id}
          className="flex flex-wrap p-4 border rounded-lg shadow-lg bg-gray-100 mb-6"
        >
          <div className="flex flex-col items-center w-full lg:w-1/4">
            <div className="text-center mb-4 text-gray-600">
              <strong>Event</strong>
            </div>
            <div className="bg-white rounded-lg shadow-lg w-[150px]">
              <Link href={`/events/${event._id}`} className="block">
                <Image
                  src={event.image}
                  alt={event.name}
                  width={150}
                  height={150}
                  className="rounded-t-lg object-cover"
                />
                <div className="p-3 text-center">
                  <h4 className="text-gray-800 font-semibold text-sm">
                    {event.name}
                  </h4>
                </div>
              </Link>
            </div>
            <div className="mt-4 text-center">
              <button
                className="bg-red-500 text-white rounded-lg px-3 py-1 hover:bg-red-700 text-sm"
                onClick={() => handleDeleteEvent(event._id)}
              >
                Delete event
              </button>
            </div>
          </div>
          <div className="w-full lg:w-3/4 flex flex-wrap justify-start mt-6 lg:mt-0 lg:pl-6">
            <div className="text-gray-600 w-full text-center mb-4">
              <strong>Collection of issues</strong>
            </div>
            {event.issues.map((issue) => (
              <div
                key={issue._id}
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2"
              >
                <div className="flex flex-col h-full bg-white rounded-lg shadow-lg w-[150px]">
                  <Link href={`/issues/${issue._id}`} className="block flex-1">
                    <Image
                      src={issue.image}
                      alt={issue.name}
                      width={150}
                      height={150}
                      className={`rounded-t-lg ${issue.readStatus ? 'opacity-50' : 'opacity-100'}`}
                    />
                    <div className="p-3 text-center flex-1 flex flex-col justify-between">
                      <h4 className="text-gray-800 font-semibold text-sm">
                        {issue.name}
                      </h4>
                    </div>
                  </Link>
                  <button
                    className="mt-2 bg-blue-500 text-white rounded-lg px-3 py-1 hover:bg-blue-700 w-full text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleReadStatus(issue._id);
                    }}
                  >
                    {issue.readStatus ? 'Mark as Unread' : 'Mark as Read'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfileEventCollection;
