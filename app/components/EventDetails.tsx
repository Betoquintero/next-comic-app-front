'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Issue {
  _id: string;
  name: string;
  image: string;
}

interface EventDetailsProps {
  image: string;
  issues: Issue[];
  universe: string;
  eventId: string;
  buyOption1?: string;
  buyOption2?: string;
  buyOption3?: string;
  alternateVersion?: {
    title: string;
    image: string;
    buyOption1: string;
    buyOption2: string;
    buyOption3: string;
  };
}

const EventDetails: React.FC<EventDetailsProps> = ({ image, issues, universe, eventId, buyOption1, buyOption2, buyOption3, alternateVersion }) => {
  const { isAuthenticated } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();

  const handleAddToCollection = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsAdding(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections/${eventId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${document.cookie.replace('authToken=', '')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to add event to collection');
      }

      toast.success('Successfully added event to collection');
      router.refresh();
    } catch (error) {
      toast.error('Failed to add event to collection');
    } finally {
      setIsAdding(false);
    }
  };


  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <div className="flex flex-col items-center mb-10">
        <Image
          src={image}
          alt="Event image"
          width={200}
          height={200}
          className="rounded-lg"
        />
      </div>

      {isAuthenticated && (
        <form onSubmit={handleAddToCollection} className="text-center mb-10">
          <button
            type="submit"
            className={`${universe === 'DC' ? 'bg-blue-600' : 'bg-red-600'} text-white py-2 px-4 rounded-lg hover:bg-opacity-80 transition duration-300`}
            disabled={isAdding}
          >
            {isAdding ? 'Adding...' : 'Add Event to My Collection'}
          </button>
        </form>
      )}

      {/* Sección de issues */}
      <div className="text-center mt-10 text-2xl font-bold text-gray-800">
        <strong>Comics that belong to this event</strong>
      </div>

      <div className="flex flex-wrap justify-center mt-6">
  {issues.length > 0 ? (
    issues.map((issue) => (
      <div
        key={issue._id}
        className="bg-light-grey rounded-lg shadow-md transition-shadow duration-300 hover:shadow-lg m-4 w-[150px]"
      >
        <Link
          href={`/issues/${issue._id}`}
          className="block no-underline text-black"
        >
          {issue.image ? (
            <Image
              src={issue.image}
              alt={`${issue.name} image`}
              width={150}
              height={150}
              className="rounded-t-lg"
            />
          ) : (
            <Image
              src="/img/no-image-found.jpg"
              alt={`${issue.name} image`}
              width={150}
              height={150}
              className="rounded-t-lg"
            />
          )}
          <div className="text-center p-4">
            <h4 className="text-sm font-semibold">{issue.name}</h4>
          </div>
        </Link>
      </div>
    ))
  ) : (
    <div className="flex items-center justify-center w-full h-48 bg-gray-200 rounded-lg">
      <p className="text-gray-600">No issues available</p>
    </div>
  )}
</div>

      {/* Opciones de compra */}
      <div className="text-center mt-10 text-2xl font-bold text-gray-800">
        <strong>Buy Options</strong>
      </div>
      <div className="flex flex-wrap justify-center mt-6">
        {buyOption1 && <a href={buyOption1} className="bg-blue-500 text-white px-4 py-2 m-2 rounded">Buy Option 1</a>}
        {buyOption2 && <a href={buyOption2} className="bg-blue-500 text-white px-4 py-2 m-2 rounded">Buy Option 2</a>}
        {buyOption3 && <a href={buyOption3} className="bg-blue-500 text-white px-4 py-2 m-2 rounded">Buy Option 3</a>}
        {!buyOption1 && !buyOption2 && !buyOption3 && <p>No buy options for this event, issues must be purchased separately</p>}
      </div>

      {/* Versión alternativa */}
      {alternateVersion && (
        <div className="mt-10 text-center">
          <h2 className="text-2xl font-bold text-gray-800">{alternateVersion.title}</h2>
          <div className="flex flex-col items-center mt-4">
            <Image src={alternateVersion.image} alt="Alternate version image" width={200} height={200} className="rounded-lg" />
          </div>
          <div className="flex flex-wrap justify-center mt-6">
            {alternateVersion.buyOption1 && <a href={alternateVersion.buyOption1} className="bg-green-500 text-white px-4 py-2 m-2 rounded">Alternate Buy Option 1</a>}
            {alternateVersion.buyOption2 && <a href={alternateVersion.buyOption2} className="bg-green-500 text-white px-4 py-2 m-2 rounded">Alternate Buy Option 2</a>}
            {alternateVersion.buyOption3 && <a href={alternateVersion.buyOption3} className="bg-green-500 text-white px-4 py-2 m-2 rounded">Alternate Buy Option 3</a>}
            {!alternateVersion.buyOption1 && !alternateVersion.buyOption2 && !alternateVersion.buyOption3 && <p>No alternate buy options for this event.</p>}
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default EventDetails;
