'use client';

import React from 'react';
import Link from 'next/link';

interface PartsListProps {
  parts: any[];
  universe: string;
}

const PartsList: React.FC<PartsListProps> = ({ parts, universe }) => {
  return (
    <div className="p-10 bg-gray-200 rounded-xl shadow-lg">
      <div className="mb-6 text-2xl font-bold text-gray-800">
        <strong>Welcome to the {universe} section!</strong>
      </div>
      <div className="mb-6 text-lg text-gray-700">
        Below you will find all of the {universe} parts. Read them carefully and enter the most interesting ones!
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {parts.map((part) => (
          <div key={part._id} className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition-shadow duration-300">
            <Link href={`/parts/${part.universe}/${part._id}`} className="block text-gray-800">
              <p className="mb-2 text-xl font-semibold">
                <strong>{part.name}</strong>
              </p>
              <p className="mb-2">
                <strong>Years published: </strong>
                {part.years}
              </p>
              <p>{part.description}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartsList;
