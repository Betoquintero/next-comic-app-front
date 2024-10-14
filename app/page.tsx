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
  title: 'Super Heroes Legacy - Discover Marvel & DC Comics',
  description: 'Explore DC and Marvel reading orders, comic events, and issues. Super Heroes Legacy is the ultimate guide for comic lovers—newbies and veterans alike.',
  keywords: 'Comics, DC Comics, Marvel Comics, Comic Reading Guide, Comic Events, Comic Issues, Superheroes Legacy, Marvel Reading Order, DC Reading Order',
  openGraph: {
    title: 'Super Heroes Legacy - Your Ultimate Comic Guide',
    description: 'Discover Marvel and DC reading orders, events, and issues at Super Heroes Legacy.',
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
        <Image src={SuperHeroesLegacyLogo} width={300} height={300} alt="Super Heroes Legacy Logo" className="h-[300px] w-[300px]" />
      </div>

      {/* Main Heading */}
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
        Super Heroes Legacy - Your Ultimate Guide to Marvel & DC Comics
      </h1>

      {/* Universe Section Heading */}
      <h2 className="text-center my-8 text-lg font-semibold text-gray-700">
        Click on one of the universes to start exploring:
      </h2>

      <div className="flex flex-col sm:flex-row justify-around items-center mt-6 mb-10 space-y-4 sm:space-y-0">
        <Link href="/parts/DC" className="bg-gray-100 rounded-lg p-6 hover:shadow-xl transition-shadow duration-300 flex justify-center items-center w-48 h-48 border border-gray-300 hover:border-gray-400">
          <Image src={dcLogo} width={100} height={100} alt="Explore DC Comics Reading Order" className="h-[100px] w-[100px]" />
        </Link>

        <Link href="/parts/MARVEL" className="bg-gray-100 rounded-lg p-6 hover:shadow-xl transition-shadow duration-300 flex justify-center items-center w-48 h-48 border border-gray-300 hover:border-gray-400">
          <Image src={marvelLogo} width={60} height={100} alt="Explore Marvel Comics Reading Order" className="h-[60px] w-[150px]" />
        </Link>
      </div>

      {/* Comic Universe Introduction */}
      <div className="bg-gray-200 rounded-xl p-4 mb-6 text-justify mx-auto w-full shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Welcome to Super Heroes Legacy</h2>
        <p className="text-gray-800 text-md md:text-base lg:text-lg">
          Super Heroes Legacy is your go-to resource for navigating the worlds of <strong>Marvel</strong> and <strong>DC Comics</strong>. Whether you're a new fan looking for the right starting point or a seasoned reader seeking a complete reading order, we have you covered with curated lists and timelines.
        </p>
        <p className="text-gray-800 text-md md:text-base lg:text-lg">
          Discover comprehensive reading orders, including major comic events and individual issues, that allow you to dive into the thrilling universes of iconic heroes and villains. Follow along with the classic stories of <strong>Spider-Man</strong>, <strong>Batman</strong>, <strong>Wonder Woman</strong>, and <strong>Iron Man</strong> as they unfold across universes.
        </p>
      </div>

      {/* Collections and Account Prompt */}
      <div className="bg-gray-200 rounded-xl p-4 mb-6 text-justify mx-auto w-full shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Join the Super Heroes Community</h3>
        <p className="text-gray-800 text-md md:text-base lg:text-lg">
          Sign up to access your personal comic collections and track your reading progress across both Marvel and DC Comics. Become a part of our growing community and share your favorite reading orders with other fans.
        </p>
      </div>

      {/* Signup CTA */}
      <Link href="/signup" className="block w-2/3 sm:w-1/2 md:w-1/3 lg:w-1/4 mx-auto bg-gray-700 text-white text-center text-lg rounded-lg py-2 hover:shadow-lg">
        Join the Comic Community Today
      </Link>

      {/* Social Media Links */}
      <div className="text-center mt-6">
        <p className="text-gray-800 text-md">
          Follow us on <a href="https://www.instagram.com/super.heroes.legacy" className="text-blue-600 hover:underline">Instagram</a> for the latest updates on Marvel and DC Comics!
        </p>
      </div>
    </MixedGrid>
  );
};

export default Home;
