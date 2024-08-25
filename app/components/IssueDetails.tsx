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
        <Image
          src={image}
          alt="Issue image"
          width={200}
          height={200}
          className="rounded-lg"
        />
      </div>
      <div className="mt-10">

      </div>
    </>
  );
};

export default IssueDetails;
