import React from "react";

interface MixedGridProps {
  children: React.ReactNode;
}

const MixedGrid: React.FC<MixedGridProps> = ({ children }) => {
  return (
    <div className="grid min-h-screen grid-cols-[1fr_3fr_1fr] grid-rows-[40vh_auto]">
      <div
        className="col-span-3 row-span-1 bg-cover bg-center bg-no-repeat bg-mixed-background"        
      ></div>

      <div className="row-span-2 bg-dc-blue"></div>

      <div className="row-span-2 bg-white px-6 py-10">
        {children}
      </div>

      <div className="row-span-2 bg-marvel-red"></div>
    </div>
  );
};

export default MixedGrid;
