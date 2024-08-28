/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import MixedGrid from './MixedGrid';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProfileEdit: React.FC = () => {
  const { user, logoutUser } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    imageUrl: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadData = new FormData();
    if (e.target.files) {
      uploadData.append('imageUrl', e.target.files[0]);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/upload`, {
          method: 'POST',
          body: uploadData,
        });

        const data = await response.json();
        setUserData(prev => ({
          ...prev,
          imageUrl: data.fileUrl,
        }));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${document.cookie.replace('authToken=', '')}`,
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        toast.success('User edited successfully. Please log in again.');
        logoutUser();
        router.push('/login');
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <MixedGrid>
      <h2 className="text-2xl font-bold mb-5 text-gray-800">Editing {userData.username}'s profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-800">
            Username
            <input
              className="formBox block w-full mt-1 border border-gray-300 rounded-md shadow-sm px-3 py-2"
              required
              type="text"
              name="username"
              value={userData.username}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label className="block text-gray-800">
            Email
            <input
              className="formBox block w-full mt-1 border border-gray-300 rounded-md shadow-sm px-3 py-2"
              required
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label className="block text-gray-800">
            Profile Image
            <input
              className="formBox block w-full mt-1 border border-gray-300 rounded-md shadow-sm px-3 py-2"
              type="file"
              onChange={handleFileUpload}
            />
          </label>
        </div>
        <button
          type="submit"
          className="bg-gray-700 text-white text-center text-lg rounded-lg py-2 w-full hover:shadow-lg"
        >
          Save changes and log out
        </button>
      </form>
    </MixedGrid>
  );
};

export default ProfileEdit;
