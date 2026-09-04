'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { parseCategorizeResponse, CategorizeResult } from '../../lib/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CategorizeForm: React.FC = () => {
  const { isAuthenticated, authenticatedFetch } = useAuth();
  const [name, setName] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CategorizeResult | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || isLoading) return;

    setIsLoading(true);
    setResult(null);

    try {
      const response = await authenticatedFetch('/categorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, summary, description }),
      });

      const categorization = await parseCategorizeResponse(response);
      setResult(categorization);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to get a categorization suggestion',
        {
          position: 'bottom-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Categorize a New Comic</h2>
        <p className="text-gray-600 mb-4">You need to be logged in to use the categorization assistant.</p>
        <Link
          href="/login"
          className="bg-gray-700 text-white text-center text-lg rounded-lg py-2 px-6 inline-block hover:shadow-lg"
        >
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold mb-5 text-gray-800 text-center">Categorize a New Comic</h2>
      <p className="text-gray-600 mb-6 text-center">
        Describe a comic that isn&apos;t in the catalog yet — the assistant suggests where it fits (universe, event,
        and reading order) based on the closest existing issues. It only suggests, it doesn&apos;t create anything.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-300 rounded-xl shadow-lg p-10">
        <label className="block text-gray-800">
          Name
          <input
            className="formBox block w-full mt-1 border border-gray-300 rounded-md shadow-sm px-3 py-2"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Injustice: Year Zero #2"
            required
            disabled={isLoading}
          />
        </label>
        <label className="block text-gray-800">
          Summary
          <textarea
            className="formBox block w-full mt-1 border border-gray-300 rounded-md shadow-sm px-3 py-2"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={2}
            disabled={isLoading}
          />
        </label>
        <label className="block text-gray-800">
          Description
          <textarea
            className="formBox block w-full mt-1 border border-gray-300 rounded-md shadow-sm px-3 py-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            disabled={isLoading}
          />
        </label>
        <button
          type="submit"
          className={`bg-gray-700 text-white text-center text-lg rounded-lg py-2 w-full hover:shadow-lg ${
            isLoading || !name.trim() ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isLoading || !name.trim()}
        >
          {isLoading ? 'Thinking...' : 'Suggest categorization'}
        </button>
      </form>

      {result && (
        <div className="mt-6 bg-gray-100 rounded-xl shadow-lg p-10" data-testid="categorize-result">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Suggestion</h3>
          <dl className="space-y-2 text-gray-800">
            <div>
              <dt className="inline font-semibold">Universe: </dt>
              <dd className="inline">{result.suggestion.universe}</dd>
            </div>
            <div>
              <dt className="inline font-semibold">Event: </dt>
              <dd className="inline">
                {result.suggestion.event}
                {result.suggestion.isNewEvent && (
                  <span className="ml-2 text-xs bg-blue-600 text-white rounded-full px-2 py-1 align-middle">
                    New event
                  </span>
                )}
              </dd>
            </div>
            <div>
              <dt className="inline font-semibold">Suggested order: </dt>
              <dd className="inline">{result.suggestion.order}</dd>
            </div>
            <div>
              <dt className="font-semibold">Reasoning:</dt>
              <dd>{result.suggestion.reasoning}</dd>
            </div>
          </dl>

          {result.basedOn.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold text-gray-800 mb-2">Based on similar comics:</h4>
              <ul className="list-disc pl-5 text-gray-700">
                {result.basedOn.map((match, index) => (
                  <li key={index}>
                    {match.name || 'Unknown'} {match.universe && `(${match.universe})`}
                    {match.event && ` — ${match.event}`}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default CategorizeForm;
