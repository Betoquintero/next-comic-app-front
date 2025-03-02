import React from 'react';
import Image from 'next/image';

interface AdditionalContextComic {
  title: string;
  description: string;
  relevanceToEvent?: string;
  image?: string;
  type: 'before' | 'after';
  buyOption1?: string;
  buyOption2?: string;
  buyOption3?: string;
}

interface AdditionalContextProps {
  contextComics: AdditionalContextComic[];
}

const AdditionalContext: React.FC<AdditionalContextProps> = ({ contextComics }) => {
  if (!contextComics || contextComics.length === 0) {
    return null;
  }

  // Separate comics into "before" and "after" sections
  const beforeComics = contextComics.filter((comic) => comic.type === 'before');
  const afterComics = contextComics.filter((comic) => comic.type === 'after');

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mt-10 w-full max-w-5xl">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Additional Context
      </h2>
      {beforeComics.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 text-center mb-4">
            What to Read Before the Event
          </h3>
          <div className="flex flex-row flex-wrap justify-center gap-6 w-full">
            {beforeComics.map((comic, index) => (
              <div
                key={index}
                className="bg-gray-100 rounded-lg p-4 shadow hover:shadow-lg transition duration-300 max-w-45"
              >
                {comic.image && (
                  <Image
                    src={comic.image}
                    alt={`Cover of ${comic.title}`}
                    width={150}
                    height={230}
                    className="rounded-lg mx-auto h-[230px] w-[150px]"
                  />
                )}
                <h3 className="text-lg font-semibold text-center mt-4 text-gray-700">{comic.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{comic.description}</p>
                {comic.relevanceToEvent && (
                  <div className="mt-3">
                    <h4 className="text-md font-semibold text-gray-700">Relevance to the event</h4>
                    <p className="text-sm text-gray-600">{comic.relevanceToEvent}</p>
                  </div>
                )}
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
      )}
      {afterComics.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-800 text-center mb-4">
            What to Read After the Event
          </h3>
          <div className="flex flex-row flex-wrap justify-center gap-6 w-full">
            {afterComics.map((comic, index) => (
              <div
                key={index}
                className="bg-gray-100 rounded-lg p-4 shadow hover:shadow-lg transition duration-300 max-w-45"
              >
                {comic.image && (
                  <Image
                    src={comic.image}
                    alt={`Cover of ${comic.title}`}
                    width={150}
                    height={230}
                    className="rounded-lg mx-auto h-[230px] w-[150px]"
                  />
                )}
                <h3 className="text-lg font-semibold text-center mt-4 text-gray-700">{comic.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{comic.description}</p>
                {comic.relevanceToEvent && (
                  <div className="mt-3">
                    <h4 className="text-md font-semibold text-gray-700">Relevance to the event</h4>
                    <p className="text-sm text-gray-600">{comic.relevanceToEvent}</p>
                  </div>
                )}
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
      )}
    </div>
  );
};

export default AdditionalContext;
