import React from 'react';

interface CustomGridProps {
  universe: string;
  children: React.ReactNode;
}

const CustomGrid: React.FC<CustomGridProps> = ({ universe, children }) => {
  return (
    <div className="grid min-h-screen grid-cols-[1fr_3fr_1fr] grid-rows-[40vh_auto]">
      <div
        className={`col-span-3 row-span-1 bg-cover bg-center bg-no-repeat ${universe === 'DC' ? 'bg-dc-background' : 'bg-marvel-background'}`}
      ></div>
      <div
        className={`bg-${universe === 'DC' ? 'dc-blue' : 'marvel-red'}`}
      ></div>
      <div className="p-10 bg-white">{children}</div>
      <div
        className={`bg-${universe === 'DC' ? 'dc-blue' : 'marvel-red'}`}
      ></div>
    </div>
  );
};

export default CustomGrid;
