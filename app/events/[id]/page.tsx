import React from 'react';
import CustomGrid from '../../components/CustomGrid';
import { getEventDetails } from '../../../lib/api';
import EventDetails from '../../components/EventDetails';

interface EventDetailsPageProps {
  params: {
    id: string;
  };
}

export default async function EventDetailsPage({ params }: EventDetailsPageProps) {
  const { id } = params;
  const event = await getEventDetails(id);

  console.log('event', event.additionalContext);

  if (!event) {
    return <p className="text-center text-red-500 text-2xl">Event not found</p>;
  }

  return (
    <CustomGrid universe={event.universe}>
      <div className="bg-gray-100 rounded-xl p-6 mb-6 shadow-lg">
        <h3 className="text-2xl font-bold text-gray-800">Event: {event.name}</h3>
        <p className="mt-4 text-lg text-gray-700">
          <strong>Year published:</strong> {event.years}
        </p>
        <p className="mt-2 text-lg text-gray-700">
          <strong>Description:</strong> {event.description}
        </p>
        <p className="mt-2 text-lg text-gray-700">
          <strong>Previous Event:</strong> {event.previousEvent}
        </p>
        <p className="mt-2 text-lg text-gray-700">
          <strong>Next Event:</strong> {event.nextEvent}
        </p>
      </div>
      <div className="flex justify-center mt-6">
        <EventDetails image={event.image} issues={event.issues} universe={event.universe} eventId={event._id} buyOption1={event.buyOption1} buyOption2={event.buyOption2} buyOption3={event.buyOption3} alternateVersion={event.alternateVersion} additionalContext={event.additionalContext} />
      </div>
    </CustomGrid>
  );
}
