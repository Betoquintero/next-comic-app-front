import React from 'react';

interface CustomGridProps {
  universe: string;
  children: React.ReactNode;
}

const CustomGrid: React.FC<CustomGridProps> = ({ universe, children }) => {
  return (
    <div className="grid min-h-screen grid-cols-[0.5fr_2.5fr_0.5fr] md:grid-cols-[0.25fr_3fr_0.25fr] grid-rows-[20vh_auto]">
      <div
        className={`col-span-3 row-span-1 ${universe === 'DC' ? 'bg-dc-background' : 'bg-marvel-background'}`}
        style={{
          backgroundSize: 'cover',
          backgroundPosition: 'center top 6%', // "Drag" the background down by adjusting the position
          backgroundRepeat: 'no-repeat',
        }}
      ></div>

      {/* Left side (color based on universe) */}
      <div
        className={`row-span-2 ${universe === 'DC' ? 'bg-dc-blue' : 'bg-marvel-red'}`}
      ></div>

      {/* Main content area, centered with more space */}
      <div className="row-span-2 bg-white mx-full px-4 py-10">
        {children}
      </div>

      {/* Right side (color based on universe) */}
      <div
        className={`row-span-2 ${universe === 'DC' ? 'bg-dc-blue' : 'bg-marvel-red'}`}
      ></div>
    </div>
  );
};

export default CustomGrid;
