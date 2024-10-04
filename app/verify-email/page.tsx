'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MixedGrid from '../components/MixedGrid';

export default function VerifyEmailPage() {
  const [statusMessage, setStatusMessage] = useState<string>('Verifying your email...');
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setStatusMessage('Invalid or missing token');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email?token=${token}`);

        if (response.ok) {
          setIsVerified(true);
          setStatusMessage('Your email has been successfully verified!');
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        } else {
          const errorData = await response.json();
          setStatusMessage(errorData.message || 'Verification failed');
        }
      } catch (error) {
        setStatusMessage('An error occurred while verifying your email.');
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <MixedGrid>
      <div className="p-10 bg-gray-300 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-5 text-gray-800">
          {isLoading ? 'Processing...' : isVerified ? 'Email Verified' : 'Verification Failed'}
        </h2>
        <p className="text-gray-800">{statusMessage}</p>
        {!isLoading && !isVerified && (
          <button
            className="mt-4 bg-gray-700 text-white text-center text-lg rounded-lg py-2 w-full hover:shadow-lg"
            onClick={() => router.push('/signup')}
          >
            Try Again
          </button>
        )}
      </div>
    </MixedGrid>
  );
}
