import React from 'react';
import Link from 'next/link';
import MixedGrid from './components/MixedGrid';
import Image from 'next/image';
import Head from 'next/head';  // Importa el componente Head
import dcLogo from '../public/img/DC_Comics_logo.svg.png';
import marvelLogo from '../public/img/Marvel_Logo.svg.png';
import HouseOfHeroesLogo from '../public/img/house-of-heroes-logo.png';
import type { Metadata } from 'next';

// Define la metadata de la página usando el objeto `metadata`
export const metadata: Metadata = {
  title: 'House of Heroes - Your Guide to the Comic Universe',
  description: 'Explore the best comic reading experience at House of Heroes. Find reading orders for DC and Marvel events and more!',
  keywords: 'Comics, DC Comics, Marvel, Reading Order, Events, Issues',
  // Puedes agregar otras propiedades como 'canonical'
  openGraph: {
    title: 'House of Heroes - Your Guide to the Comic Universe',
    description: 'Explore the best comic reading experience at House of Heroes.',
    url: 'https://www.yourdomain.com',
    siteName: 'House of Heroes',
    images: [
      {
        url: '/path-to-image.jpg',
        width: 800,
        height: 600,
        alt: 'House of Heroes',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@houseofheroes',
    title: 'House of Heroes',
    description: 'Explore the best comic reading experience at House of Heroes.',
    images: ['/path-to-image.jpg'],
  },
};

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>House of Heroes - Your Guide to the Comic Universe</title>
        <meta name="description" content="Explore the best comic reading experience at House of Heroes. Find reading orders for DC and Marvel events and more!" />
        <meta name="keywords" content="Comics, DC Comics, Marvel, Reading Order, Events, Issues" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.yoursite.com/" />
      </Head>

      <MixedGrid>
        <div className="flex flex-col items-center justify-center mb-8">
          <Image src={HouseOfHeroesLogo} width={300} height={100} alt="HH logo" />
        </div>

        {/* Sección de texto con ajuste en márgenes y tamaño de fuente */}
        <div className="bg-gray-200 rounded-xl p-6 mb-6 text-justify mx-2 md:mx-6 lg:mx-12 xl:mx-20 shadow-lg">
          <p className="mb-4 text-gray-800 text-sm md:text-base lg:text-lg">
            Welcome to House of heroes, the best page of the comics community. If you are new to this world, here you will find the best way to enjoy the experience of continuity in the comics world. On the other hand, if you have some experience, you will enjoy yourself exploring through the different stages of comics since the beginning and also, contribute to this great community.
          </p>
          <p className="text-gray-800 text-sm md:text-base lg:text-lg">
            People often get very confused when it comes to the reading order of comics. Normally you start reading a comic and start an ongoing story with no context, so that takes the fun out of it or makes you quit since you are in the middle of nowhere.
          </p>
        </div>

        {/* Otra sección de texto */}
        <div className="bg-gray-200 rounded-xl p-6 mb-6 text-justify mx-2 md:mx-6 lg:mx-12 xl:mx-20 shadow-lg">
          <p className="mb-4 text-gray-800 text-sm md:text-base lg:text-lg">
            In House of Heroes, we make it easy for you. Every big brand (DC or Marvel) complete storyline is divided into PARTS. Every part has a number of EVENTS that have a beginning and an end. And finally, every EVENT has ISSUES. Feel free to check out the parts and their descriptions, and hop in the most interesting for you!
          </p>
          <p className="text-gray-800 text-sm md:text-base lg:text-lg">First of all, select your favorite universe and enjoy!</p>
        </div>

        <div className="bg-gray-200 rounded-xl p-6 mb-6 text-justify mx-2 md:mx-6 lg:mx-12 xl:mx-20 shadow-lg">
          <p className="text-gray-800 text-sm md:text-base lg:text-lg">Remember to signup to enjoy all the benefits of the comic community!</p>
        </div>

        {/* Botón de Signup */}
        <Link href="/signup" className="block w-2/3 sm:w-1/2 md:w-1/3 lg:w-1/4 mx-auto bg-gray-700 text-white text-center text-lg rounded-lg py-2 hover:shadow-lg">
          Signup
        </Link>

        {/* Logos de DC y Marvel */}
        <div className="flex flex-col sm:flex-row justify-around mt-10 mb-10 space-y-4 sm:space-y-0">
          <Link href="/parts/DC" className="bg-gray-100 rounded-lg p-6 hover:shadow-lg flex justify-center items-center w-48 h-48">
            <Image src={dcLogo} width={100} height={100} alt="DC logo" />
          </Link>

          <Link href="/parts/MARVEL" className="bg-gray-100 rounded-lg p-6 hover:shadow-lg flex justify-center items-center w-48 h-48">
            <Image src={marvelLogo} width={100} height={100} alt="Marvel logo" />
          </Link>
        </div>
      </MixedGrid>
    </>
  );
};

export default Home;
