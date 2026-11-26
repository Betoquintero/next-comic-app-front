/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Link from 'next/link';
import MixedGrid from './components/MixedGrid';
import Image from 'next/image';
import dcLogo from '../public/img/DC_Comics_logo.svg.png';
import marvelLogo from '../public/img/Marvel_Logo.svg.png';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'House of Heroes - Discover Marvel & DC Comics',
  description: 'Explore DC and Marvel reading orders, comic events, and issues. House of Heroes is the ultimate guide for comic lovers—newbies and veterans alike.',
  keywords: 'Comics, DC Comics, Marvel Comics, Comic Reading Guide, Comic Events, Comic Issues, House of Heroes, Marvel Reading Order, DC Reading Order',
  openGraph: {
    title: 'House of Heroes - Your Ultimate Comic Guide',
    description: 'Discover Marvel and DC reading orders, events, and issues at House of Heroes.',
    url: 'https://houseofheroes.dev',
    siteName: 'House of Heroes',
    images: [
      {
        url: '/img/marvel-dc-home.png',
        width: 1798,
        height: 291,
        alt: 'House of Heroes - DC and Marvel reading orders',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

const Home: React.FC = () => {
  return (
    <MixedGrid>
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
        House of Heroes - Your Ultimate Guide to Marvel & DC Comics
      </h1>

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

      <div className="bg-gray-200 rounded-xl p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14 mb-6 text-justify mx-auto w-full max-w-5xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Welcome to House of Heroes</h2>
        <p className="text-gray-800 text-md md:text-base lg:text-lg">
          House of Heroes is your go-to resource for navigating the worlds of <strong>Marvel</strong> and <strong>DC Comics</strong>. Whether you're a new fan looking for the right starting point or a seasoned reader seeking a complete reading order, we have you covered with curated lists and timelines.
        </p>
        <p className="text-gray-800 text-md md:text-base lg:text-lg">
          Discover comprehensive reading orders, including major comic events and individual issues, that allow you to dive into the thrilling universes of iconic heroes and villains. Follow along with the classic stories of <strong>Spider-Man</strong>, <strong>Batman</strong>, <strong>Wonder Woman</strong>, and <strong>Iron Man</strong> as they unfold across universes.
        </p>
      </div>

      <div className="bg-gray-200 rounded-xl p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14 mb-6 text-justify mx-auto w-full max-w-5xl shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Join the Super Heroes Community</h3>
        <p className="text-gray-800 text-md md:text-base lg:text-lg">
          Sign up to access your personal comic collections and track your reading progress across both Marvel and DC Comics. Become a part of our growing community and share your favorite reading orders with other fans.
        </p>
      </div>

      <Link href="/signup" className="block w-2/3 sm:w-1/2 md:w-1/3 lg:w-1/4 mx-auto bg-gray-700 text-white text-center text-lg rounded-lg py-2 hover:shadow-lg">
        Join the Comic Community Today
      </Link>

      <div className="text-center mt-6">
        <p className="text-gray-800 text-md">
          Follow us on <a href="https://www.instagram.com/super.heroes.legacy" className="text-blue-600 hover:underline">Instagram</a> for the latest updates on Marvel and DC Comics!
        </p>
      </div>
    </MixedGrid>
  );
};

export default Home;
