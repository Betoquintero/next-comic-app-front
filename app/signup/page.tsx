'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MixedGrid from '../components/MixedGrid';

export default function Signup() {
  const [user, setUser] = useState({
    username: '',
    email: '',
  });
  const [password, setPassword] = useState('');
  const [passwordControl, setPasswordControl] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    if (password !== passwordControl) {
      setErrorMessage("Passwords don't match");
    } else {
      setErrorMessage(undefined);
    }
  }, [passwordControl, password]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user.username,
          email: user.email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      setSuccessMessage('Signup successful! Please check your email to verify your account.');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MixedGrid>
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-300 rounded-xl shadow-lg p-10">
        <h2 className="text-2xl font-bold mb-5 text-gray-800 text-center">Sign Up</h2>

        {successMessage && <p className="text-green-500">{successMessage}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block text-gray-800">
            Username
            <input
              className="formBox block w-full mt-1 border border-gray-300 rounded-md shadow-sm px-3 py-2"
              required
              type="text"
              name="username"
              value={user.username}
              onChange={handleChange}
            />
          </label>
          <label className="block text-gray-800">
            Email
            <input
              className="formBox block w-full mt-1 border border-gray-300 rounded-md shadow-sm px-3 py-2"
              required
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
            />
          </label>
          <label className="block text-gray-800">
            Password
            <input
              className="formBox block w-full mt-1 border border-gray-300 rounded-md shadow-sm px-3 py-2"
              required
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <label className="block text-gray-800">
            Repeat the password
            <input
              className="formBox block w-full mt-1 border border-gray-300 rounded-md shadow-sm px-3 py-2"
              required
              type="password"
              name="passwordControl"
              value={passwordControl}
              onChange={(e) => setPasswordControl(e.target.value)}
            />
          </label>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <button
            className="bg-gray-700 text-white text-center text-lg rounded-lg py-2 w-full hover:shadow-lg"
            type="submit"
            disabled={isSubmitting || !!errorMessage}
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </MixedGrid>
  );
}
