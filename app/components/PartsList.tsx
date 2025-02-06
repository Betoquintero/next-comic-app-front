'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { Part } from '../../lib/api';

interface PartsListProps {
  parts: Part[];
  universe: string;
}

const PartsList: React.FC<PartsListProps> = ({ parts, universe }) => {
  const [expandedPartId, setExpandedPartId] = useState<string | null>(null);

  const toggleExpand = (partId: string) => {
    setExpandedPartId(expandedPartId === partId ? null : partId);
  };

  return (
    <div className="p-5 bg-gray-200 rounded-xl shadow-lg">
      <header className="mb-6 text-2xl font-bold text-gray-800">
        <h1>Explore the {universe} Universe</h1>
      </header>
      <p className="mb-6 text-lg text-gray-700">
        Discover key parts of the {universe} universe. Click on a part to see more information and explore further.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {parts.map((part) => (
          <article
            key={part._id}
            className="bg-white rounded-xl p-3 shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer relative"
            aria-labelledby={`part-title-${part._id}`}
          >
            <Link href={`/parts/${part.universe}/${part._id}`} className="block text-gray-800">
              <h2 id={`part-title-${part._id}`} className="mb-2 text-xl font-semibold text-black">
                {part.name}
              </h2>
              <p className="mb-2 text-black">
                <strong>Years published:</strong> {part.years}
              </p>
            </Link>

            <p className="text-black">
              {expandedPartId === part._id ? (
                <>
                  {part.description}
                  <span onClick={() => toggleExpand(part._id)} className="text-blue-500 cursor-pointer ml-2">
                    Show less
                  </span>
                </>
              ) : (
                <>
                  {part.description ? part.description.slice(0, 100) : ''}...
                  <span onClick={() => toggleExpand(part._id)} className="text-blue-500 cursor-pointer ml-2">
                    Read more about {part.name}
                  </span>
                </>
              )}
            </p>

            <Link
              href={`/parts/${part.universe}/${part._id}`}
              className="mt-3 inline-flex items-center text-blue-600 font-semibold hover:underline"
              aria-label={`View details for ${part.name}`}
            >
              Explore {part.name} <FiArrowRight className="ml-1" />
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
};

export default PartsList;
