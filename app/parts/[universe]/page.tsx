import React from 'react';
import CustomGrid from '../../components/CustomGrid';
import { getPartsByUniverse } from '../../../lib/api';
import PartsList from '../../components/PartsList';

export default async function PartsPage({ params }: { params: { universe: string } }) {
  const parts = await getPartsByUniverse(params.universe);

  return (
    <CustomGrid universe={params.universe}>
      <PartsList parts={parts} universe={params.universe} />
    </CustomGrid>
  );
}
