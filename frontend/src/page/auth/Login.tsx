import { signInWithEmailAndPassword } from "firebase/auth";
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth } from "../../config/Firebase";
import { setAuth } from "../../redux/authslice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const Login = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.authReducer.user);
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });
  const { email, password } = inputValue;
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleError = (err: string) =>
    toast.error(err, {
      position: "top-right",
    });
  const handleSuccess = (msg: string) =>
    toast.success(msg, {
      position: "top-right",
    });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          navigate("/home");
          handleSuccess("Logged in successfully");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorMessage);
          if (errorCode) {
            handleError("Email or Password incorrect");
            setInputValue({
              ...inputValue,
              password: "",
            });
          }
        });
    } catch (error) {
      handleError("Failed");
      setInputValue({
        ...inputValue,
        password: "",
      });
    }
  };
  useEffect(() => {
    if (user?.email) {
      dispatch(setAuth());
      navigate("/home");
    }
  }, [user]);
  return (
    <div className="flex flex-col w-full h-[100vh] items-center justify-center">
      <img src="brand-gain.png" width={150}></img>
      <div className="form_container mt-2">
        <h2>Login Account</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={handleOnChange}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              placeholder="Enter your password"
              onChange={handleOnChange}
            />
          </div>
          <button type="submit">Submit</button>
          {/* <span>
            Create a new account? <Link to={"/signup"}>Signup</Link>
          </span> */}
        </form>
      </div>
    </div>
  );
};

export default Login;
