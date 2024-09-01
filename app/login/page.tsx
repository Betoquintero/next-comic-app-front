'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import MixedGrid from '../components/MixedGrid';

const LoginPage = () => {
  const { authenticateUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();

      // Pass the token to authenticateUser to store it in the context and cookies
      authenticateUser(data.authToken);

      // Navigate to the user's profile page using their user ID
      router.push(`/profile/${data.userId}`);
    } else {
      console.error('Failed to login');
    }
  };

  return (
    <MixedGrid>
      <div className="p-10 bg-gray-300 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-5 text-gray-800">Login</h2>
        <form className="space-y-4" onSubmit={handleLogin}>
          <label className="block text-gray-800">
            Email
            <input
              className="formBox block w-full mt-1 border border-gray-300 rounded-md shadow-sm px-3 py-2"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
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
      </div>
    </MixedGrid>
  );
};

export default LoginPage;
