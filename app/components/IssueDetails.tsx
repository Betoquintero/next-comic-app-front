'use client';

import React from 'react';
import Image from 'next/image';

interface IssueDetailsProps {
  image: string;
  universe: string;
}

const IssueDetails: React.FC<IssueDetailsProps> = ({ image, universe }) => {
  return (
    <>
      <div className="mb-10 flex justify-center">
        {image ? (
          <Image
            src={image}
            alt={`${universe} comic cover image`}
            width={220}
            height={350}
            className="rounded-t-lg h-[350px] w-[220px]"
          />
        ) : (
          <Image
            src="/img/no-image-found.jpg"
            alt="No cover image available"
            width={220}
            height={350}
            className="rounded-t-lg h-[350px] w-[220px]"
          />
        )}
      </div>
      <div className="mt-10">
      </div>
    </>
  );
};

export default IssueDetails;
