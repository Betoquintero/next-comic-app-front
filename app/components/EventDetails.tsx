'use client'
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
}

const EventDetails: React.FC<EventDetailsProps> = ({ image, issues, universe, eventId }) => {
  const { isAuthenticated, user } = useAuth(); // Access auth context
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

      const responseData = await response.json();

      if (responseData.message) {
        // Show toast notification with the message from the server
        toast.info(responseData.message, {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: true,
        });
      } else {
        // Show success toast notification
        toast.success('Successfully added event to collection', {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: true,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to add event to collection', {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      <div className="mb-10">
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
            className={`${
              universe === 'DC' ? 'bg-blue-600' : 'bg-red-600'
            } text-white py-2 px-4 rounded-lg hover:bg-opacity-80 transition duration-300`}
            disabled={isAdding}
          >
            {isAdding ? 'Adding...' : 'Add Event to My Collection'}
          </button>
        </form>
      )}

      <div className="text-center mt-10 text-2xl font-bold text-gray-800">
        <strong>Comics that belong to this event</strong>
      </div>

      <div className="flex flex-wrap justify-around mt-6">
        {issues.map((issue) => (
          <div key={issue._id} className="bg-light-grey rounded-lg shadow-md transition-shadow duration-300 hover:shadow-lg m-4 w-[250px]">
            <Link href={`/issues/${issue._id}`} className="block no-underline text-black">
              <Image
                src={issue.image}
                alt={`${issue.name} image`}
                width={250}
                height={250}
                className="rounded-t-lg"
              />
              <div className="text-center p-4">
                <h4 className="text-sm font-semibold">
                  {issue.name}
                </h4>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <ToastContainer />
    </>
  );
};

export default EventDetails;
