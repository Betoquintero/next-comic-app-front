import React from 'react';

interface CustomGridProps {
  universe: string;
  children: React.ReactNode;
}

const CustomGrid: React.FC<CustomGridProps> = ({ universe, children }) => {
  return (
    <div className="grid min-h-screen grid-cols-[0.5fr_2.5fr_0.5fr] md:grid-cols-[0.25fr_3fr_0.25fr] grid-rows-[40vh_auto]">
      <div
        className={`col-span-3 row-span-1 ${universe === 'DC' ? 'bg-dc-background' : 'bg-marvel-background'}`}
        style={{
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat', 
          paddingTop: '1000px'
        }}
      ></div>

      {/* Lado izquierdo (color según universo) */}
      <div
        className={`row-span-2 ${universe === 'DC' ? 'bg-dc-blue' : 'bg-marvel-red'}`}
      ></div>

      {/* Contenido principal, con más espacio centrado */}
      <div className="row-span-2 bg-white mx-full px-4 py-10">
        {children}
      </div>

      {/* Lado derecho (color según universo) */}
      <div
        className={`row-span-2 ${universe === 'DC' ? 'bg-dc-blue' : 'bg-marvel-red'}`}
      ></div>
    </div>
  );
};

export default CustomGrid;
