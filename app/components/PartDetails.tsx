'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Event {
  _id: string;
  name: string;
  image: string;
}

interface PartDetailsProps {
  events: Event[];
  universe: string;
}

const PartDetails: React.FC<PartDetailsProps> = ({ events, universe }) => {
  return (
    <div className="flex flex-wrap justify-around w-full">
      {events.map((event) => (
        <article
          key={event._id}
          className="bg-light-grey rounded-lg shadow-md transition-shadow duration-300 hover:shadow-lg m-4 w-[150px]"
          aria-labelledby={`event-title-${event._id}`}
        >
          <Link href={`/events/${event._id}`} aria-label={`View details for ${event.name}`} className="block no-underline text-black">
            <Image
              src={event.image}
              alt={`Cover of ${event.name} in the ${universe} universe`}
              width={150}
              height={230}
              className="rounded-t-lg h-[230px] w-[150px]"
            />
            <div className="text-center p-4">
              <h4 id={`event-title-${event._id}`} className="text-sm font-semibold text-black">
                <b>{event.name}</b>
              </h4>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
};

export default PartDetails;
