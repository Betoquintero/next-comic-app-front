import React from 'react';
import Link from 'next/link';
import MixedGrid from './components/MixedGrid';
import Image from 'next/image';
import dcLogo from '../public/img/DC_Comics_logo.svg.png';
import marvelLogo from '../public/img/Marvel_Logo.svg.png';
import HouseOfHeroesLogo from '../public/img/house-of-heroes-logo.png';

const Home: React.FC = () => {
  return (
    <MixedGrid>
      <div className="flex flex-col items-center justify-center mb-8">
        <Image src={HouseOfHeroesLogo} width={300} height={100} alt="HH logo" />
      </div>

      <div className="bg-gray-200 rounded-xl p-6 mb-6 text-justify mx-10 shadow-lg">
  <p className="mb-4 text-gray-800">
    Welcome to House of heroes, the best page of the comics community. If you
    are new to this world, here you will find the best way to enjoy the experience
    of continuity in the comics world. On the other hand, if you have some
    experience, you will enjoy yourself exploring through the different stages of
    comics since the beginning and also, contribute to this great community.
  </p>
  <p className="text-gray-800">
    People often get very confused when it comes to the reading order of comics,
    normally you start reading a comic and start an ongoing story with no context,
    so that takes the fun out of it or makes you quit since you are in the middle
    of nowhere.
  </p>
</div>

<div className="bg-gray-200 rounded-xl p-6 mb-6 text-justify mx-10 shadow-lg">
  <p className="mb-4 text-gray-800">
    In House of Heroes we make it easy for you. Every big brand (DC or Marvel)
    complete storyline is divided into PARTS. Every part has a number of EVENTS
    that have a beginning and an end. And finally, every EVENT has ISSUES. Feel free
    to check out the parts and their descriptions, and hop in the most interesting
    for you!
  </p>
  <p className="text-gray-800">First of all, select your favorite universe and enjoy!</p>
</div>

      
      <div className="bg-gray-200 rounded-xl p-6 mb-6 text-justify mx-10 shadow-lg">
        <p className="text-gray-800">Remember to signup to enjoy all the benefits of the comic community!</p>
      </div>

      <Link
        href="/signup"
        className="block w-1/4 mx-auto bg-gray-700 text-white text-center text-lg rounded-lg py-2 hover:shadow-lg"
      >
        Signup
      </Link>
      
      <div className="flex justify-around mt-10 mb-10">
        <Link
          href="/parts/DC"
          className="bg-gray-100 rounded-lg p-6 hover:shadow-lg flex justify-center"
        >
          <Image src={dcLogo} width={100} height={100} alt="DC logo" />
        </Link>

        <Link
          href="/parts/MARVEL"
          className="bg-gray-100 rounded-lg p-6 hover:shadow-lg flex justify-center"
        >
          <Image src={marvelLogo} width={100} height={100} alt="Marvel logo" />
        </Link>
      </div>

      <div className="bg-gray-200 rounded-xl p-6 mb-6 text-justify mx-10 shadow-lg">
        <p className="text-gray-800">If you wish...take a look at all the comics and find yourself in this infinite world!</p>
      </div>

      <Link
        href="/issues"
        className="block w-1/4 mx-auto bg-gray-700 text-white text-center text-lg rounded-lg py-2 hover:shadow-lg"
      >
        Check all issues
      </Link>
    </MixedGrid>
  );
};

export default Home;
