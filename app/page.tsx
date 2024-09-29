/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Link from 'next/link';
import MixedGrid from './components/MixedGrid';
import Image from 'next/image';
import Head from 'next/head';
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
  instagram: {
    url: 'https://www.instagram.com/super.heroes.legacy',
  },
};

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>Super Heroes Legacy - Discover the World of Comics</title>
        <meta name="description" content="Explore DC and Marvel reading orders, events, and issues. Super Heroes Legacy is the ultimate guide for comic lovers—whether new to the scene or seasoned enthusiasts." />
        <meta name="keywords" content="Comics, DC Comics, Marvel, Comic Reading Order, Comic Events, Comic Issues, Superheroes" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.superheroeslegacy.com/" />
      </Head>

      <MixedGrid>
        <div className="flex flex-col items-center justify-center mb-8">
          <Image src={SuperHeroesLegacyLogo} width={300} height={100} alt="Super Heroes Legacy Logo" />
        </div>

        <div className="bg-gray-200 rounded-xl p-4 mb-6 text-justify mx-auto w-full shadow-lg">
          <p className="mb-4 text-gray-800 text-md md:text-base lg:text-lg">
            Welcome to <strong>Super Heroes Legacy</strong>—your ultimate guide to the comic universe. Whether you're new to the world of comics or already have some knowledge, we have got you covered! Explore the entire continuity of major comic brands like <strong>DC</strong> and <strong>Marvel</strong> through easy-to-follow reading orders and timelines.
          </p>
          <p className="text-gray-800 text-md md:text-base lg:text-lg">
            Many people struggle to find the right reading order for comic events. Here at Super Heroes Legacy, we make it easy. Let us help you dive into the most exciting comic events, or take your time and enjoy each issue at your own pace.
          </p>
        </div>

        <div className="bg-gray-200 rounded-xl p-4 mb-6 text-justify mx-auto w-full shadow-lg">
          <p className="mb-4 text-gray-800 text-md md:text-base lg:text-lg">
            At Super Heroes Legacy, we’ve simplified everything. Each major storyline is broken into <strong>Parts</strong>, which consist of several <strong>Events</strong>, and each Event contains individual <strong>Issues</strong>. Choose your favorite universe—DC or Marvel—and start exploring their epic sagas.
          </p>
          <p className="text-gray-800 text-md md:text-base lg:text-lg">
            Ready to begin your adventure? Choose your universe and discover new stories!
          </p>
        </div>

        <div className="bg-gray-200 rounded-xl p-4 mb-6 text-justify mx-auto w-full shadow-lg">
          <p className="text-gray-800 text-md md:text-base lg:text-lg">
            Sign up to access your personal comic collections and track your reading progress. Become part of a growing community of comic fans!
          </p>
        </div>

        <Link href="/signup" className="block w-2/3 sm:w-1/2 md:w-1/3 lg:w-1/4 mx-auto bg-gray-700 text-white text-center text-lg rounded-lg py-2 hover:shadow-lg">
          Join the Comic Community Today
        </Link>

        <div className="flex flex-col sm:flex-row justify-around items-center mt-10 mb-10 space-y-4 sm:space-y-0">
          <Link href="/parts/DC" className="bg-gray-100 rounded-lg p-6 hover:shadow-lg flex justify-center items-center w-48 h-48">
            <Image src={dcLogo} width={100} height={100} alt="DC logo" className="h-[100px] w-[100px]" />
          </Link>

          <Link href="/parts/MARVEL" className="bg-gray-100 rounded-lg p-6 hover:shadow-lg flex justify-center items-center w-48 h-48">
            <Image src={marvelLogo} width={60} height={100} alt="Marvel logo" className="h-[60px] w-[150px]" />
          </Link>
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-800 text-md">
            Follow us on <a href="https://www.instagram.com/super.heroes.legacy" className="text-blue-600 hover:underline">Instagram</a> for the latest updates!
          </p>
        </div>
      </MixedGrid>
    </>
  );
};

export default Home;
