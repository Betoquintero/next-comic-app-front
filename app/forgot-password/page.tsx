'use client';
import React, { useState } from 'react';
import MixedGrid from '../components/MixedGrid';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/request-password-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('A password reset link has been sent to your email.');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to send reset link, please try again.');
      }
    } catch {
      setError('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MixedGrid>
      <div className="p-10 bg-gray-300 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-5 text-gray-800">Forgot Your Password?</h2>
        
        {message && <div className="bg-green-100 text-green-800 p-3 rounded-lg mb-5">{message}</div>}
        {error && <div className="bg-red-100 text-red-800 p-3 rounded-lg mb-5">{error}</div>}

        <form className="space-y-4" onSubmit={handleForgotPassword}>
          <label className="block text-gray-800">
            Enter your email
            <input
              className="formBox block w-full mt-1 border border-gray-300 rounded-md shadow-sm px-3 py-2"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </label>
          <button
            type="submit"
            className={`bg-gray-700 text-white text-center text-lg rounded-lg py-2 w-full hover:shadow-lg ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </MixedGrid>
  );
};

export default ForgotPasswordPage;
