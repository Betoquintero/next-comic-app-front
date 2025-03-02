"use client";
import React, { useState } from "react";
import AdditionalContext from "./AditionalContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Issue {
  _id: string;
  name: string;
  image: string;
}

interface AdditionalContextComic {
  type: "before" | "after";
  title: string;
  description: string;
  image: string;
  buyOption1?: string;
  buyOption2?: string;
  buyOption3?: string;
}

interface EventDetailsProps {
  image: string;
  issues: Issue[];
  universe: string;
  eventId: string;
  buyOption1?: string;
  buyOption2?: string;
  buyOption3?: string;
  alternateVersion?: {
    title: string;
    image: string;
    buyOption1: string;
    buyOption2: string;
    buyOption3: string;
  };
  additionalContextBefore?: AdditionalContextComic[];
  additionalContextAfter?: AdditionalContextComic[];
}

const EventDetails: React.FC<EventDetailsProps> = ({
  image,
  issues,
  universe,
  eventId,
  buyOption1,
  buyOption2,
  buyOption3,
  alternateVersion,
  additionalContextBefore = [],
  additionalContextAfter = [],
}) => {
  const { isAuthenticated } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();

  const handleAddToCollection = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsAdding(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/collections/${eventId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${document.cookie.replace(
              "authToken=",
              ""
            )}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add event to collection");
      }

      const data = await response.json();

      if (data.message === "Event is already on user's collection") {
        toast.info(data.message, {
          position: "bottom-center",
          autoClose: 3000,
        });
      } else {
        toast.success("Successfully added event to collection", {
          position: "bottom-center",
          autoClose: 3000,
        });
      }

      router.refresh();
    } catch (error) {
      toast.error("Failed to add event to collection", {
        position: "bottom-center",
        autoClose: 3000,
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen p-4 pt-20">
      {isAuthenticated && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
          <form onSubmit={handleAddToCollection}>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-opacity-80 transition duration-300"
              disabled={isAdding}
            >
              {isAdding ? "Adding..." : "Add Event to My Collection"}
            </button>
          </form>
        </div>
      )}

      <div className="flex flex-col lg:flex-row items-start justify-center mb-10 lg:space-x-10 w-full max-w-5xl mt-10">
        <div className="flex flex-col items-center flex-1 text-center">
          <Image
            src={image}
            alt={`Cover image of ${universe} event`}
            width={200}
            height={300}
            className="rounded-t-lg h-[300px] w-[200px]"
          />
          <h2 className="text-3xl font-bold text-gray-800 mt-4">Main Event</h2>
          <div className="flex flex-col items-center mt-2 space-y-2">
            {buyOption1 && (
              <a
                href={buyOption1}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 text-white px-4 py-2 rounded"
                aria-label="Buy event on Amazon EU"
              >
                Buy on Amazon EU
              </a>
            )}
            {buyOption2 && (
              <a
                href={buyOption2}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 text-white px-4 py-2 rounded"
                aria-label="Buy event on Amazon US"
              >
                Buy on Amazon US
              </a>
            )}
            {buyOption3 && (
              <a
                href={buyOption3}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 text-white px-4 py-2 rounded"
                aria-label="Buy event for Kindle"
              >
                Buy for Kindle
              </a>
            )}
            {!buyOption1 && !buyOption2 && !buyOption3 && (
              <p>No buy options available for this event.</p>
            )}
          </div>
        </div>

        {alternateVersion && (
          <div className="flex flex-col items-center flex-1 text-center mt-8 lg:mt-0">
            <Image
              src={alternateVersion.image}
              alt={`Cover image of alternate version: ${alternateVersion.title}`}
              width={200}
              height={300}
              className="rounded-t-lg h-[300px] w-[200px]"
            />
            <h2 className="text-3xl font-bold text-gray-800 mt-4">
              Alternate Version: {alternateVersion.title}
            </h2>
            <div className="flex flex-col items-center mt-2 space-y-2">
              {alternateVersion.buyOption1 && (
                <a
                  href={alternateVersion.buyOption1}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  aria-label="Buy alternate version on Amazon EU"
                >
                  Buy on Amazon EU
                </a>
              )}
              {alternateVersion.buyOption2 && (
                <a
                  href={alternateVersion.buyOption2}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  aria-label="Buy alternate version on Amazon US"
                >
                  Buy on Amazon US
                </a>
              )}
              {alternateVersion.buyOption3 && (
                <a
                  href={alternateVersion.buyOption3}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  aria-label="Buy alternate version for Kindle"
                >
                  Buy for Kindle
                </a>
              )}
              {!alternateVersion.buyOption1 &&
                !alternateVersion.buyOption2 &&
                !alternateVersion.buyOption3 && (
                  <p>No alternate buy options available.</p>
                )}
            </div>
          </div>
        )}
      </div>
      {(additionalContextBefore?.length > 0 ||
        additionalContextAfter?.length > 0) && (
        <AdditionalContext
          contextComics={[
            ...(additionalContextBefore?.map((comic) => ({
              ...comic,
              type: "before" as "before",
            })) || []),
            ...(additionalContextAfter?.map((comic) => ({
              ...comic,
              type: "after" as "after",
            })) || []),
          ]}
        />
      )}

      <div className="text-center mt-10 text-2xl font-bold text-gray-800">
        <strong>Comics that belong to this event</strong>
      </div>

      <div className="flex flex-wrap justify-center mt-6 w-full max-w-5xl">
        {issues.length > 0 ? (
          issues.map((issue) => (
            <article
              key={issue._id}
              className="bg-light-grey rounded-lg shadow-md transition-shadow duration-300 hover:shadow-lg m-4 w-[150px]"
            >
              <Link
                href={`/issues/${issue._id}`}
                aria-label={`View details for ${issue.name}`}
                className="block no-underline text-black"
              >
                {issue.image ? (
                  <Image
                    src={issue.image}
                    alt={`Cover of ${issue.name}`}
                    width={150}
                    height={230}
                    className="rounded-t-lg h-[230px] w-[150px]"
                  />
                ) : (
                  <Image
                    src="/img/no-image-found.jpg"
                    alt="No cover image available"
                    width={150}
                    height={230}
                    className="rounded-t-lg h-[230px] w-[150px]"
                  />
                )}
                <div className="text-center p-4">
                  <h4 className="text-sm font-semibold text-black">
                    {issue.name}
                  </h4>
                </div>
              </Link>
            </article>
          ))
        ) : (
          <div className="flex items-center justify-center w-full h-48 bg-gray-200 rounded-lg">
            <p className="text-gray-600">No issues available</p>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default EventDetails;
