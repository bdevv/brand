import React, { PropsWithChildren } from "react";
interface LogoViewProps {
  imageUrl: string;
  logoText: string;
}
const LogoView: React.FC<PropsWithChildren<LogoViewProps>> = ({
  imageUrl,
  logoText,
}) => {
  return (
    <div className="flex flex-col w-[232px] h-[294px] col-span-1 bg-white rounded-[40px] justify-between items-center p-8">
      <div className="flex w-full h-full items-center justify-center">
        <img
          src={"uploads/" + imageUrl}
          style={{ objectFit: "contain", width: "200px", height: "160px" }}
          alt={logoText}
        ></img>
      </div>
      <span className="text-xl font-bold mt-4 text-center">{logoText}</span>
    </div>
  );
};

export default LogoView;
