import React from "react";

const Loading = ({ size = 24 }) => (
  <div className="h-full w-full flex items-center justify-center">
    <div
      style={{ width: `${size}px`, height: `${size}px` }}
      className="border-4 border-t-4 border-t-bgPrimary rounded-full animate-spin"
    />
  </div>
);

export default Loading;
