import React from "react";
import { MainLayout } from "../layout/MainLayout";
import { LogoView, SummaryView } from "../components/home";

const SUMMARY_ARRAY = [
  { title: "TCI Copyright Infringements", value: "531" },
  { title: "Percentage Removed", value: "98%" },
  { title: "Total Views Removed", value: "2.4M" },
];
const Twitter = () => {
  return (
    <MainLayout>
      <div className="flex flex-col w-full h-full bg-[#F3F1F2] p-16 font-bold font-[InstagramSansBold]">
        <div className="flex w-full">
          <span className="text-5xl font-bold">Trial only</span>
        </div>
        {/* <div className="flex w-full h-[150px] mt-8 justify-between ">
          {SUMMARY_ARRAY.map((item, itemIndex) => (
            <SummaryView key={itemIndex} {...item} />
          ))}
        </div> */}
      </div>
    </MainLayout>
  );
};

export default Twitter;
