import React from "react";

const LoadingCircle = () => {
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-[#00000099] z-[9999] flex justify-center items-center">
      <div
        style={{
          border: "5px solid #f3f3f3",
          borderTop: "5px solid #36d7b7",
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          animation: "spin 1s linear infinite",
        }}
      ></div>
    </div>
  );
};

export default LoadingCircle;
