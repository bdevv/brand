// Import the functions you need from the SDKs you need
import Home from "./page/Home";
import SignUp from "./page/auth/SignUp";
import Login from "./page/auth/Login";
import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import YouTube from "./page/Youtube";
import TikTok from "./page/TikTok";
import Twitter from "./page/Twitter";
import Meta from "./page/Meta";
import PrivateRoutes from "./provider/PrivateRoutes";
import { useDispatch } from "react-redux";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/Firebase";
import { setAuth, setUnAuth, setUser } from "./redux/authslice";
import Admin from "./page/Admin";
import { useState } from "react";
function App() {
  const [isAdmin, setAdmin] = useState(false);
  const dispatch = useDispatch();
  onAuthStateChanged(auth, (user: User | null) => {
    if (user?.email) {
      dispatch(setAuth());
      dispatch(setUser({ email: user.email }));
      localStorage.setItem("isAuth", "true");
      if (
        user.email == "ryan@brandgain.com" ||
        user.email == "rybread123@hotmail.com" ||
        user.email == "yigitmufata3@gmail.com"
      )
        setAdmin(true);
      else setAdmin(false);
      // ...
    } else {
      dispatch(setUnAuth());
      localStorage.removeItem("isAuth");
    }
  });
  return (
    <Router>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route element={<Home />} path="/" />
          <Route element={<Home />} path="/home" />
          <Route element={<YouTube />} path="/youtube" />
          <Route element={<TikTok />} path="/tiktok" />
          <Route element={<Twitter />} path="/twitter" />
          <Route element={<Meta />} path="/meta" />
          {isAdmin && <Route element={<Admin />} path="/admin" />}
        </Route>
        <Route element={<Login />} path="/login" />
        <Route element={<SignUp />} path="/signup" />
      </Routes>
    </Router>
  );
}

export default App;
