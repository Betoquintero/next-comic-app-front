'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MixedGrid from './MixedGrid';
import ProfileEventCollection from './ProfileEventCollection';
import { useAuth } from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export interface Event {
  _id: string;
  universe: string;
  name: string;
  order: string;
  years: string;
  image: string;
  issues: Issue[];
}

export interface Issue {
  _id: string;
  name: string;
  image: string;
  readStatus: boolean;
}

interface UserData {
  _id: string;
  userId: string;
  events: Event[];
  issues: Issue[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const ProfileView: React.FC<{ userData: UserData }> = ({ userData }) => {
  const { user, logoutUser } = useAuth();
  const router = useRouter();

  const [collection, setCollection] = useState({
    events: userData?.events || [],
    issues: userData?.issues || [],
  });

  useEffect(() => {
    if (userData) {
      fetchReadStatuses();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const fetchReadStatuses = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/readStatuses`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${document.cookie.replace('authToken=', '')}`,
        },
      });
  
      if (response.ok) {
        const readStatuses = await response.json();
        const updatedEvents = collection.events.map((event) => ({
          ...event,
          issues: event.issues.map((issue) => {
            const readStatus = readStatuses.find(
              (status: { issueId: { _id: string; } }) => status.issueId._id === issue._id
            );
            return { ...issue, readStatus: readStatus ? readStatus.isRead : false };
          }),
        }));
        setCollection((prevCollection) => ({
          ...prevCollection,
          events: updatedEvents,
        }));
      } else {
        console.error('Failed to fetch read statuses');
      }
    } catch (error) {
      console.error('Error fetching read statuses:', error);
    }
  };

  const deleteAccount = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/delete/${user?._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${document.cookie.replace('authToken=', '')}`,
        },
      });

      if (response.ok) {
        toast.success('Account deleted successfully.', {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        logoutUser();
        router.push('/');
        setTimeout(() => {
          window.location.reload();
        }, 100); 
      } else {
        toast.error('Failed to delete account', {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch {
      toast.error('An error occurred while deleting the account', {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (confirmed) {
      deleteAccount();
    }
  };

  const deleteEventFromCollection = async (eventId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections/delete-event/${eventId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${document.cookie.replace('authToken=', '')}`,
        },
      });

      if (response.ok) {
        setCollection((prevCollection) => ({
          ...prevCollection,
          events: prevCollection.events.filter((event) => event._id !== eventId),
        }));
        toast.success('Event removed from collection.', {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while removing the event from the collection.', {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const toggleReadStatus = async (issueId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/readStatuses/toggle-read/${issueId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${document.cookie.replace('authToken=', '')}`,
        },
      });

      if (response.ok) {
        const updatedStatus = await response.json();
        const updatedEvents = collection.events.map((event) => ({
          ...event,
          issues: event.issues.map((issue) =>
            issue._id === issueId ? { ...issue, readStatus: updatedStatus.isRead } : issue
          ),
        }));
        setCollection((prevCollection) => ({
          ...prevCollection,
          events: updatedEvents,
        }));
      } else {
        console.error('Failed to toggle read status');
      }
    } catch (error) {
      console.error('Error toggling read status:', error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <MixedGrid>
      <div className="flex justify-center items-center gap-4 mt-4">
        <h5 className="text-2xl text-gray-800">Welcome to your profile page, {user.username}!</h5>
        <div className="ml-auto flex items-center gap-4">
          <button
            className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-700"
            onClick={() => router.push(`/profile/edit`)}
          >
            Edit your profile
          </button>
          <button
            className="bg-red-600 text-white rounded-lg px-4 py-2 hover:bg-red-800"
            onClick={handleDeleteAccount}
          >
            Delete account
          </button>
        </div>
      </div>

      {/* New buttons for DC and Marvel sections */}
      <div className="flex justify-center gap-6 mt-8">
        <button
          className="bg-blue-500 text-white rounded-lg px-6 py-3 hover:bg-blue-700 w-48"
          onClick={() => router.push(`/parts/DC`)}
        >
          Go to the DC section
        </button>
        <button
          className="bg-red-600 text-white rounded-lg px-6 py-3 hover:bg-red-800 w-48"
          onClick={() => router.push(`/parts/MARVEL`)}
        >
          Go to the Marvel section
        </button>
      </div>

      <p className="mt-8 text-center text-gray-800">
        <strong>
          Below you will find your saved collections. If you do not have any, visit the events and collections pages to find
          the ones you like the most!
        </strong>
      </p>

      <ProfileEventCollection
        collection={collection}
        deleteEventFromCollection={deleteEventFromCollection}
        toggleReadStatus={toggleReadStatus}
      />

      {!collection.events.length && (
        <p className="text-center mt-8 text-gray-800">
          <strong>No events to show. Visit the events page to start collecting!</strong>
        </p>
      )}
      <ToastContainer />
    </MixedGrid>
  );
};

export default ProfileView;
