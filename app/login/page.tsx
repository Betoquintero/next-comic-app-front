'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import MixedGrid from '../components/MixedGrid';

const LoginPage = () => {
  const { authenticateUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        authenticateUser(data.authToken);
        router.push(`/profile/${data.userId}`);
      } else if (response.status === 401) {
        setError('Wrong password');
      } else if (response.status === 404) {
        setError('User not found');
      } else if (response.status === 403) {
        setError('Please verify your email before logging in');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'An error occurred, please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <MixedGrid>
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-300 rounded-xl shadow-lg p-10">
        <h2 className="text-2xl font-bold mb-5 text-gray-800 text-center">Login</h2>

        {error && (
          <div className="bg-red-100 text-red-800 p-3 rounded-lg mb-5">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <label className="block text-gray-800">
            Email
            <input
              className="formBox block w-full mt-1 border border-gray-300 rounded-md shadow-sm px-3 py-2"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              placeholder="Email"
              required
            />
          </label>
          <label className="block text-gray-800">
            Password
            <input
              className="formBox block w-full mt-1 border border-gray-300 rounded-md shadow-sm px-3 py-2"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              placeholder="Password"
              required
            />
          </label>
          <button
            type="submit"
            className="bg-gray-700 text-white text-center text-lg rounded-lg py-2 w-full hover:shadow-lg"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/forgot-password" className="text-blue-600 hover:underline">
            Forgot your password?
          </Link>
        </div>
      </div>
    </MixedGrid>
  );
};

export default LoginPage;
