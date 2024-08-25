import React from 'react';
import CustomGrid from '../../../components/CustomGrid';
import { getPartDetails } from '../../../../lib/api';
import PartDetails from '../../../components/PartDetails';

interface PartDetailsPageProps {
  params: {
    id: string;
    universe: string;
  };
}

export default async function PartDetailsPage({ params }: PartDetailsPageProps) {
  const { id, universe } = params;
  const part = await getPartDetails(universe, id);

  if (!part) {
    return <p className="text-center text-red-500 text-2xl">Part not found</p>;
  }

  return (
    <CustomGrid universe={universe}>
      <div className="bg-gray-100 rounded-xl p-6 mb-6 shadow-lg">
        <h3 className="text-2xl font-bold text-gray-800">{part.name}</h3>
        <p className="mt-4 text-lg text-gray-700">
          <strong>Year published:</strong> {part.years}
        </p>
        <p className="mt-2 text-lg text-gray-700">
          <strong>Description:</strong> {part.description}
        </p>
      </div>
      <div className="text-center mt-10 text-2xl font-bold text-gray-800">
        <strong>Events that belong to this part</strong>
      </div>
      <PartDetails events={part.events} universe={universe} />
    </CustomGrid>
  );
}
