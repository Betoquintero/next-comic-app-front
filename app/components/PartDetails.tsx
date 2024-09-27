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
        <div key={event._id} className="bg-light-grey rounded-lg shadow-md transition-shadow duration-300 hover:shadow-lg m-4 w-[150px]">
          <Link href={`/events/${event._id}`} className="block no-underline text-black">
              <Image
                src={event.image}
                alt={`${event.name} image`}
                width={150}
                height={230}
                className="rounded-t-lg h-[230px] w-[150px]"
                 />
            <div className="text-center p-4">
              <h4 className="text-sm font-semibold">
                <b>{event.name}</b>
              </h4>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default PartDetails;