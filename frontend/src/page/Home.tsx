import React, { ChangeEvent, useEffect, useState } from "react";
import { MainLayout } from "../layout/MainLayout";
import { LogoView, SummaryView } from "../components/home";
import userService from "../api/services";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { toast } from "react-toastify";
import { setGUserName } from "../redux/authslice";
const Home = () => {
  const dispatch = useDispatch();
  const [trademarkArray, setTrademarkArray] = useState([]);
  const user = useSelector((state: RootState) => state.authReducer.user);
  const username = useSelector(
    (state: RootState) => state.authReducer.username
  );
  const [summaryArray, setSummaryArray] = useState<
    Array<{ title: string; value: string }>
  >([
    { title: "TCI Copyright Infringements", value: "" },
    { title: "Percentage Removed", value: "" },
    { title: "Total Views Removed", value: "" },
  ]);
  const getSummaryAll = async () => {
    const results = await userService.getSummaryAll();
    if (results?.data.data) {
      setSummaryArray(results?.data.data);
    } else {
      toast.error("Fetching Data is not finished yet, please try again", {
        position: "bottom-left",
      });
    }
  };
  const getTrademarks = async () => {
    const results = await userService.getTrademarks();
    if (results.status == 200) {
      const trademarks = results.data.map((item: any) => ({
        imageUrl: item.url,
        logoText: item.title,
      }));
      setTrademarkArray(trademarks);
    }
  };
  const getUserInfo = async () => {
    const userInfo = await userService.getUserInfo(user.email);
    if (userInfo.status == 200) {
      dispatch(setGUserName(userInfo.data?.username));
    }
  };
  useEffect(() => {
    getUserInfo();
  }, [user.email]);
  useEffect(() => {
    getTrademarks();
    getSummaryAll();
  }, []);
  return (
    <MainLayout>
      <div className="flex flex-col w-full h-full bg-[#F3F1F2] p-16 font-bold font-[InstagramSansBold]">
        <div className="flex w-full">
          <span className="text-5xl font-bold">{username}</span>
        </div>

        <div className="flex w-full h-[150px] mt-8 justify-between ">
          {summaryArray.map((item, itemIndex) => (
            <SummaryView key={itemIndex} {...item} />
          ))}
        </div>
        <div className="flex w-full">
          <span className="text-5xl font-bold mt-4">Trademarks</span>
        </div>
        <div className="grid lg:grid-cols-3 xl:grid-cols-6 gap-4 mt-4">
          {trademarkArray.map(
            (item: { imageUrl: string; logoText: string }, itemIndex) => (
              <LogoView key={itemIndex} {...item} />
            )
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
