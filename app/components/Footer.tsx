import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-6 mt-auto w-full">
      <div className="container mx-auto px-4 text-center">
        <div className="text-sm mb-4 space-y-2">
          <p>
            All images are owned by their respective copyright owners and are used under fair use.
          </p>
        </div>
        <div className="flex justify-center space-x-6 text-sm">
          <Link href="/privacy-policy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link href="/tou" className="hover:text-white transition-colors">
            Terms of Use
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
