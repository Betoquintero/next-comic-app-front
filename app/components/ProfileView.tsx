'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MixedGrid from './MixedGrid';
import ProfileEventCollection from './ProfileEventCollection';
import { useAuth } from '../context/AuthContext';

export interface Event {
  _id: string;
  universe: string;
  name: string;
  order: string;
  years: string;
  image: string;
  issues: Issue[];  // Assuming events have a collection of issues
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
  const { user } = useAuth();
  const router = useRouter();

  const [collection, setCollection] = useState({
    events: userData?.events || [],
    issues: userData?.issues || [],
  });

  useEffect(() => {
    if (userData) {
      setCollection({
        events: userData.events || [],
        issues: userData.issues || [],
      });
    }
  }, [userData]);

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
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteIssue = async (issueId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections/delete-issue/${issueId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${document.cookie.replace('authToken=', '')}`,
        },
      });

      if (response.ok) {
        setCollection((prevCollection) => ({
          ...prevCollection,
          issues: prevCollection.issues.filter((issue) => issue._id !== issueId),
        }));
      }
    } catch (error) {
      console.error(error);
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
        setCollection((prevCollection) => ({
          ...prevCollection,
          issues: prevCollection.issues.map((issue) =>
            issue._id === issueId ? { ...issue, readStatus: updatedStatus.isRead } : issue
          ),
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <MixedGrid>
      <div className="text-center">
        <div className="mx-auto" style={{ width: '100px', height: '100px' }}>
          <Image
            className="rounded-full"
            src={user.imageUrl}
            alt="User Profile"
            width={100}
            height={100}
            objectFit="cover"
          />
        </div>
        <h5 className="text-2xl mt-4 text-gray-800">Welcome to your profile page, {user.username}!</h5>
        <button
          className="mt-4 bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-700"
          onClick={() => router.push(`/profile/edit`)}
        >
          Edit your profile
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
    </MixedGrid>
  );
};

export default ProfileView;
