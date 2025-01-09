import React from "react";

interface MixedGridProps {
  children: React.ReactNode;
}

const MixedGrid: React.FC<MixedGridProps> = ({ children }) => {
  return (
    <div 
      className="grid min-h-screen grid-cols-[0.5fr_2.5fr_0.5fr] md:grid-cols-[0.25fr_3fr_0.25fr] grid-rows-[20vh_auto]"
      role="grid"
    >
      <div
        className="col-span-3 row-span-1 bg-cover bg-[center_top_7%] bg-no-repeat bg-mixed-background"
        data-testid="header"
      ></div>

      {/* Left side */}
      <div className="row-span-2 bg-dc-blue" data-testid="left-side"></div>

      {/* Main content area */}
      <div className="row-span-2 bg-white mx-full px-4 py-10" data-testid="main-content">
        {children}
      </div>

      {/* Right side */}
      <div className="row-span-2 bg-marvel-red" data-testid="right-side"></div>
    </div>
  );
};


export default MixedGrid;
