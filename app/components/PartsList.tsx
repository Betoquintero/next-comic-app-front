'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

interface PartsListProps {
  parts: any[];
  universe: string;
}

const PartsList: React.FC<PartsListProps> = ({ parts, universe }) => {
  const [expandedPartId, setExpandedPartId] = useState<string | null>(null);

  const toggleExpand = (partId: string) => {
    setExpandedPartId(expandedPartId === partId ? null : partId);
  };

  return (
    <div className="p-5 bg-gray-200 rounded-xl shadow-lg">
      <div className="mb-6 text-2xl font-bold text-gray-800">
        <strong>Welcome to the {universe} section!</strong>
      </div>
      <div className="mb-6 text-lg text-gray-700">
        Below you will find all of the {universe} parts. Tap on a part to see more details!
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {parts.map((part) => (
          <div
            key={part._id}
            className="bg-white rounded-xl p-3 shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer relative"
          >
            <Link href={`/parts/${part.universe}/${part._id}`} className="block text-gray-800">
              <p className="mb-2 text-xl font-semibold text-black">
                <strong>{part.name}</strong>
              </p>
              <p className="mb-2 text-black">
                <strong>Years published: </strong>
                {part.years}
              </p>
            </Link>
            <p className="text-black">
              {expandedPartId === part._id ? (
                <>
                  {part.description}
                  <span
                    onClick={() => toggleExpand(part._id)}
                    className="text-blue-500 cursor-pointer ml-2"
                  >
                    Show less
                  </span>
                </>
              ) : (
                <>
                  {part.description.slice(0, 100)}...
                  <span
                    onClick={() => toggleExpand(part._id)}
                    className="text-blue-500 cursor-pointer ml-2"
                  >
                    Read more
                  </span>
                </>
              )}
            </p>

            <Link
              href={`/parts/${part.universe}/${part._id}`}
              className="mt-3 inline-flex items-center text-blue-600 font-semibold hover:underline"
            >
              View Details <FiArrowRight className="ml-1" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartsList;
