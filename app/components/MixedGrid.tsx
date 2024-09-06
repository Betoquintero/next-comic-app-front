import React from "react";

interface MixedGridProps {
  children: React.ReactNode;
}

const MixedGrid: React.FC<MixedGridProps> = ({ children }) => {
  return (
    <div className="grid min-h-screen grid-cols-[0.5fr_2.5fr_0.5fr] md:grid-cols-[0.25fr_3fr_0.25fr] grid-rows-[40vh_auto]">
      <div
        className="col-span-3 row-span-1 bg-cover bg-center bg-no-repeat bg-mixed-background"        
      ></div>

      {/* Lado izquierdo */}
      <div className="row-span-2 bg-dc-blue"></div>

      {/* Contenido principal, con más espacio */}
      <div className="row-span-2 bg-white mx-auto px-4 py-10">
        {children}
      </div>

      {/* Lado derecho */}
      <div className="row-span-2 bg-marvel-red"></div>
    </div>
  );
};

export default MixedGrid;
