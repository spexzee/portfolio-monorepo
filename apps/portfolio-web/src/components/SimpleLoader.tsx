import React from "react";

const SimpleLoader: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="flex flex-col items-center">
        <div className="canvas-loader"></div>
      </div>
    </div>
  );
};

export default SimpleLoader;