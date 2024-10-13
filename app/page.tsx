/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Link from 'next/link';
import MixedGrid from './components/MixedGrid';
import Image from 'next/image';
import dcLogo from '../public/img/DC_Comics_logo.svg.png';
import marvelLogo from '../public/img/Marvel_Logo.svg.png';
import SuperHeroesLegacyLogo from '../public/img/super-heroes-legacy-logo.png';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Super Heroes Legacy - Discover the World of Comics',
  description: 'Explore DC and Marvel reading orders, events, and issues. Super Heroes Legacy is the ultimate guide for comic lovers—whether new to the scene or seasoned enthusiasts.',
  keywords: 'Comics, DC Comics, Marvel, Comic Reading Order, Comic Events, Comic Issues, Superheroes',
  openGraph: {
    title: 'Super Heroes Legacy - Your Ultimate Comic Guide',
    description: 'Find reading orders, events, and comic guides for DC, Marvel, and more at Super Heroes Legacy.',
    url: 'https://www.superheroeslegacy.com',
    siteName: 'Super Heroes Legacy',
    images: [
      {
        url: '/img/super-heroes-legacy-logo.png',
        width: 800,
        height: 600,
        alt: 'Super Heroes Legacy Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

const Home: React.FC = () => {
  return (
    <MixedGrid>
      <div className="flex flex-col items-center justify-center mb-8">
        <Image src={SuperHeroesLegacyLogo} width={300} height={300}  alt="Super Heroes Legacy Logo"  className="h-[300px] w-[300px]"/>
      </div>

      <div className="bg-gray-200 rounded-xl p-4 mb-6 text-justify mx-auto w-full shadow-lg">
        <p className="mb-4 text-gray-800 text-md md:text-base lg:text-lg">
          Welcome to <strong>Super Heroes Legacy</strong>—your ultimate guide to the comic universe. Whether you're new to the world of comics or already have some knowledge, we have got you covered! Explore the entire continuity of major comic brands like <strong>DC</strong> and <strong>Marvel</strong> through easy-to-follow reading orders and timelines.
        </p>
        <p className="text-gray-800 text-md md:text-base lg:text-lg">
          Many people struggle to find the right reading order for comic events. Here at Super Heroes Legacy, we make it easy. Let us help you dive into the most exciting comic events, or take your time and enjoy each issue at your own pace.
        </p>
      </div>

      <div className="text-center my-8">
        <p className="text-lg font-semibold text-gray-700 mb-4">Click on one of the universes to start exploring:</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-around items-center mt-6 mb-10 space-y-4 sm:space-y-0">
        <Link href="/parts/DC" className="bg-gray-100 rounded-lg p-6 hover:shadow-xl transition-shadow duration-300 flex justify-center items-center w-48 h-48 border border-gray-300 hover:border-gray-400">
          <Image src={dcLogo} width={100} height={100} alt="DC logo" className="h-[100px] w-[100px]" />
        </Link>

        <Link href="/parts/MARVEL" className="bg-gray-100 rounded-lg p-6 hover:shadow-xl transition-shadow duration-300 flex justify-center items-center w-48 h-48 border border-gray-300 hover:border-gray-400">
          <Image src={marvelLogo} width={60} height={100} alt="Marvel logo" className="h-[60px] w-[150px]" />
        </Link>
      </div>

      <div className="bg-gray-200 rounded-xl p-4 mb-6 text-justify mx-auto w-full shadow-lg">
        <p className="text-gray-800 text-md md:text-base lg:text-lg">
          Sign up to access your personal comic collections and track your reading progress. Become part of a growing community of comic fans!
        </p>
      </div>

      <Link href="/signup" className="block w-2/3 sm:w-1/2 md:w-1/3 lg:w-1/4 mx-auto bg-gray-700 text-white text-center text-lg rounded-lg py-2 hover:shadow-lg">
        Join the Comic Community Today
      </Link>

      <div className="text-center mt-6">
        <p className="text-gray-800 text-md">
          Follow us on <a href="https://www.instagram.com/super.heroes.legacy" className="text-blue-600 hover:underline">Instagram</a> for the latest updates!
        </p>
      </div>
    </MixedGrid>
  );
};

export default Home;
