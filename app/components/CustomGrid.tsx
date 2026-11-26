import React from 'react';

interface CustomGridProps {
  universe: string;
  children: React.ReactNode;
}

const CustomGrid: React.FC<CustomGridProps> = ({ universe, children }) => {
  return (
    <div
      className="grid min-h-screen grid-cols-[0.5fr_2.5fr_0.5fr] md:grid-cols-[0.25fr_3fr_0.25fr] grid-rows-[20vh_auto]"
      role="grid"
    >
      <div
        className={`col-span-3 row-span-1 ${universe === 'DC' ? 'bg-dc-background' : 'bg-marvel-background'}`}
        data-testid="header"
        style={{
          backgroundSize: 'cover',
          backgroundPosition: 'center top 6%',
          backgroundRepeat: 'no-repeat',
        }}
      ></div>

      <div
        className={`row-span-2 ${universe === 'DC' ? 'bg-dc-blue' : 'bg-marvel-red'}`}
        data-testid="left-side"
      ></div>

      <div className="row-span-2 bg-white mx-full px-4 py-10" data-testid="main-content">
        {children}
      </div>

      <div
        className={`row-span-2 ${universe === 'DC' ? 'bg-dc-blue' : 'bg-marvel-red'}`}
        data-testid="right-side"
      ></div>
    </div>
  );
};

export default CustomGrid;
