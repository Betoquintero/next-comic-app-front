/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import MixedGrid from './MixedGrid';
import { useAuth } from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfileEdit: React.FC = () => {
  const { user, logoutUser, authenticatedFetch } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    imageUrl: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await authenticatedFetch('/user/edit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        toast.success('User edited successfully. Please log in again.', {
          position: 'bottom-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        logoutUser();
        router.push('/login');
      } else {
        toast.error('Failed to update profile. Please try again.', {
          position: 'bottom-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while updating the profile.', {
        position: 'bottom-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <MixedGrid>
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-300 rounded-xl shadow-lg p-10">
        <h2 className="text-2xl font-bold mb-5 text-gray-800 text-center">Editing {userData.username}'s profile</h2>
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
          <button
            type="submit"
            className="bg-gray-700 text-white text-center text-lg rounded-lg py-2 w-full hover:shadow-lg"
          >
            Save changes and log out
          </button>
        </form>
      </div>
      <ToastContainer />
    </MixedGrid>
  );
};

export default ProfileEdit;
