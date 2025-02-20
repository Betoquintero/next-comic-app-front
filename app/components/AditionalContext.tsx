import React from 'react';
import Image from 'next/image';

interface AdditionalContextComic {
  title: string;
  description: string;
  image: string;
  buyOption1?: string;
  buyOption2?: string;
  buyOption3?: string;
}

interface AdditionalContextProps {
  contextComics: AdditionalContextComic[];
}

const AdditionalContext: React.FC<AdditionalContextProps> = ({ contextComics }) => {
  if (!contextComics) {
    return null;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mt-10 w-full max-w-5xl">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Additional Context
      </h2>
      <div className="flex flex-row flex-wrap justify-center gap-6 w-full">
        {contextComics.map((comic, index) => (
          <div
            key={index}
            className="bg-gray-100 rounded-lg p-4 shadow hover:shadow-lg transition duration-300 max-w-45"
          >
            <Image
              src={comic.image}
              alt={`Cover of ${comic.title}`}
              width={150}
              height={230}
              className="rounded-lg mx-auto h-[230px] w-[150px]"
            />
            <h3 className="text-lg font-semibold text-center mt-4 text-gray-700">{comic.title}</h3>
            <p className="text-sm text-gray-600 mt-2">{comic.description}</p>
            <div className="flex flex-col items-center mt-4 space-y-2">
              {comic.buyOption1 && (
                <a
                  href={comic.buyOption1}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Buy on Amazon EU
                </a>
              )}
              {comic.buyOption2 && (
                <a
                  href={comic.buyOption2}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Buy on Amazon US
                </a>
              )}
              {comic.buyOption3 && (
                <a
                  href={comic.buyOption3}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Buy for Kindle
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdditionalContext;
