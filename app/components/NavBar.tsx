'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logoutUser } = useAuth();
  const router = useRouter();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    router.push('/');
  };

  return (
    <nav className="fixed top-0 w-full bg-gray-800 text-white shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Home Button */}
        <Link href="/" className="text-2xl font-bold hover:text-gray-400">
          Home
        </Link>
        <button
          onClick={handleGoBack}
          className="text-lg font-semibold hover:text-gray-400"
        >
          Go Back
        </button>

        <div className="flex space-x-4">
          {!isAuthenticated && (
            <>
              <Link
                href="/signup"
                className="text-lg font-semibold hover:text-gray-400"
              >
                Signup
              </Link>

              {/* Login Button */}
              <Link
                href="/login"
                className="text-lg font-semibold hover:text-gray-400"
              >
                Login
              </Link>
            </>
          )}

          {isAuthenticated && (
            <>
              <Link
                href={`/profile/${user._id}`}
                className="text-lg font-semibold hover:text-gray-400"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-lg font-semibold hover:text-gray-400"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
