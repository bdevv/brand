// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setAuth } from "../redux/authslice";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration

const firebaseConfig =
  process.env.NODE_ENV === "development"
    ? {
        apiKey: "AIzaSyCvvBAVnjf5ObTVo_yubD6IOy4ENvHDKvw",
        authDomain: "brand-gain.firebaseapp.com",
        projectId: "brand-gain",
        storageBucket: "brand-gain.appspot.com",
        messagingSenderId: "265521405229",
        appId: "1:265521405229:web:66c33a458e3c492f2fc7a4",
        measurementId: "G-M7ZCNE54EX",
      }
    : {
        apiKey: "AIzaSyAPOrjc5zWPa_IrrU6aK-rWJHWx78hklp0",
        authDomain: "brandgain-e327c.firebaseapp.com",
        projectId: "brandgain-e327c",
        storageBucket: "brandgain-e327c.appspot.com",
        messagingSenderId: "940208453981",
        appId: "1:940208453981:web:ec1f702d93913f9f15d0b4",
        measurementId: "G-VN050FS46J",
      };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
