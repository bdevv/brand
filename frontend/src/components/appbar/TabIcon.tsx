import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { PropsWithChildren } from "react";

interface TabIconProps {
  name: string;
  onClick: (name: string) => void;
  icon: any;
  isSelected: boolean;
}
const TabIcon: React.FC<PropsWithChildren<TabIconProps>> = ({
  name,
  onClick,
  icon,
  isSelected,
}) => {
  return (
    <div
      className={`flex w-16 h-16 items-center justify-center mt-4 border-black text-4xl cursor-pointer hover:text-white ${
        isSelected ? "text-white" : ""
      }`}
      onClick={() => {
        onClick(name);
      }}
    >
      <FontAwesomeIcon icon={icon} mask={"circle"} />
    </div>
  );
};

export default TabIcon;
