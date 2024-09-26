import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-start h-screen bg-gray-100 pt-16 px-6">
      <Image
        src="/img/error-image.png"
        alt="Spiderman hanging"
        width={450}
        height={300}
        className="rounded-lg h-[450px] w-[300px]"
        priority={true}
      />
      <h1 className="text-4xl font-bold text-gray-800 mt-6">Oops! Page Not Found</h1>
      <p className="text-lg text-gray-600 mt-4 text-center max-w-xl">
        Looks like Spiderman got tangled in the web! The page you are looking for might have been moved,
        deleted, or perhaps it never existed.
      </p>
      <Link href="/" className="mt-6 bg-dark-grey hover:bg-gray-700 text-white text-lg font-semibold px-6 py-3 rounded-lg transition duration-300">
        Swing Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
