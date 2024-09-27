import React from "react";
import AppBar from "./AppBar";
interface Props {
  children: JSX.Element;
}

export const MainLayout: React.FC<Props> = ({ children }) => {
  return (
    <div
      className="flex w-full h-full min-h-[100vh]"
      style={{
        background:
          "radial-gradient(circle at 50% 100%, #FFF0EF,#FEF0F6,#E5F4FF )",
      }}
    >
      <div className="w-[70px]">
        <AppBar />
      </div>
      <div
        className="flex flex-1 w-full h-full max-h-[100vh] overflow-x-hidden overflow-y-auto"
        // style={{ display: "contents" }}
      >
        {children}
      </div>
    </div>
  );
};
