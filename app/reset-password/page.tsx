// pages/reset-password.tsx

'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MixedGrid from '../components/MixedGrid';

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      if (response.ok) {
        setSuccess('Password reset successfully! Redirecting to login...');
        setTimeout(() => router.push('/login'), 3000);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to reset password.');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <MixedGrid>
      <div className="p-10 bg-gray-300 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-5 text-gray-800">Reset Your Password</h2>

        {error && <div className="bg-red-100 text-red-800 p-3 rounded-lg mb-5">{error}</div>}
        {success && <div className="bg-green-100 text-green-800 p-3 rounded-lg mb-5">{success}</div>}

        <form onSubmit={handleResetPassword} className="space-y-4">
          <label className="block text-gray-800">
            New Password
            <input
              type="password"
              className="formBox block w-full mt-1 border border-gray-300 rounded-md shadow-sm px-3 py-2"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </label>
          <label className="block text-gray-800">
            Confirm New Password
            <input
              type="password"
              className="formBox block w-full mt-1 border border-gray-300 rounded-md shadow-sm px-3 py-2"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="bg-gray-700 text-white text-lg rounded-lg py-2 w-full hover:shadow-lg">
            Reset Password
          </button>
        </form>
      </div>
    </MixedGrid>
  );
};

export default ResetPasswordPage;
