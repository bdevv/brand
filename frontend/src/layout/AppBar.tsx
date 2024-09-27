import React, { useEffect, useState } from "react";
import { faGear, faHome, faSignOut } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import {
  faMeta,
  faTiktok,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { TabIcon } from "../components/appbar";
import { useSelector, useDispatch } from "react-redux";
import { setGUserName, setTab, setUnAuth, setUser } from "../redux/authslice";
import { RootState } from "../redux/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { User, signOut } from "firebase/auth";
import { auth } from "../config/Firebase";
import userService from "../api/services";
const TAB_ICON_ARRAY = [
  {
    name: "home",
    icon: faHome,
  },
  {
    name: "youtube",
    icon: faYoutube,
  },
  {
    name: "tiktok",
    icon: faTiktok,
  },
  {
    name: "twitter",
    icon: faTwitter,
  },
  {
    name: "meta",
    icon: faMeta,
  },
  {
    name: "admin",
    icon: faGear,
  },
];
const AppBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state: RootState) => state.authReducer.user);

  const dispatch = useDispatch();
  const activeTab = useSelector((state: RootState) => state.authReducer.tab);
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        dispatch(setUnAuth());
        dispatch(setUser({ email: "" }));
        navigate("/login");

        console.log("Signed out successfully");
      })
      .catch((error) => {
        // An error happened.
      });
  };
  const handleIconClick = (name: string) => {
    navigate("/" + name);
    dispatch(setTab(name));
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
    const path = location.pathname;
    const tab = path.substring(1); // Remove the leading '/'
    dispatch(setTab(tab));
  }, [location.pathname, dispatch]);
  return (
    <div className="flex flex-col w-full h-screen bg-[#F3F1F2]">
      <div className="flex flex-col w-full h-full items-center justify-start bg-gradient-to-b from-[#F5BD7E] via-[#C57297] to-[#525CB6]">
        <div
          className="flex w-[70px] items-center justify-center mt-4 border-black cursor-pointer"
          onClick={() => {
            navigate("/home");
            dispatch(setTab("home"));
          }}
        >
          <img src="logo.png" style={{ width: 40 }}></img>
        </div>
        {TAB_ICON_ARRAY.map((item, itemIndex) => {
          if (item.name == "admin") {
            if (
              user.email != "ryan@brandgain.com" &&
              user.email != "rybread123@hotmail.com" &&
              user.email != "yigitmufata3@gmail.com"
            ) {
              return null;
            }
          }
          return (
            <TabIcon
              key={itemIndex}
              name={item.name}
              onClick={() => handleIconClick(item.name)}
              icon={item.icon}
              isSelected={activeTab == item.name}
            />
          );
        })}
        <div className="flex-grow"></div>

        <div
          className={`flex w-16 h-16 items-center justify-center mt-8 border-black text-4xl cursor-pointer hover:text-white`}
          onClick={handleLogout}
        >
          <FontAwesomeIcon icon={faSignOut} mask={"circle"} />
        </div>
      </div>
    </div>
  );
};

export default AppBar;
