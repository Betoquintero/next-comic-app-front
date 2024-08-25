import React from 'react';
import CustomGrid from '../../components/CustomGrid';
import { getIssueDetails } from '../../../lib/api';
import IssueDetails from '../../components/IssueDetails';

interface IssueDetailsPageProps {
  params: {
    id: string;
  };
}

export default async function IssueDetailsPage({ params }: IssueDetailsPageProps) {
  const { id } = params;
  const issue = await getIssueDetails(id);

  if (!issue) {
    return <p className="text-center text-red-500 text-2xl">Issue not found</p>;
  }

  return (
    <CustomGrid universe={issue.universe}>
      <div className="bg-gray-100 rounded-xl p-6 mb-6 shadow-lg">
        <h3 className="text-2xl font-bold text-gray-800">Issue: {issue.name}</h3>
        <p className="mt-4 text-lg text-gray-700">
          <strong>Year published:</strong> {issue.years}
        </p>
        <p className="mt-2 text-lg text-gray-700">
          <strong>Description:</strong> {issue.description}
        </p>
      </div>
      <div className="text-center mt-10 text-2xl font-bold text-gray-800">
        <strong>Issue Image</strong>
      </div>
      <div className="flex justify-center mt-6">
        <IssueDetails image={issue.image} universe={issue.universe} />
      </div>
    </CustomGrid>
  );
}
