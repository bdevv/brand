import React, { PropsWithChildren } from "react";
interface SummaryProps {
  title: string;
  value: string;
}
const SummaryView: React.FC<PropsWithChildren<SummaryProps>> = ({
  title,
  value,
}) => {
  return (
    <div className="flex flex-col w-1/4 bg-white rounded-3xl p-4 ">
      <span className="text-xl ">{title}</span>
      <div className="flex justify-center items-center mt-4">
        <span className="text-7xl font-bold">{value}</span>
      </div>
    </div>
  );
};

export default SummaryView;
