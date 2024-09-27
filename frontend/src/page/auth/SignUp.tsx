import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/Firebase";
import userService from "../../api/services";
const Signup = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { username, email, password, confirmPassword } = inputValue;
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
      if (password !== confirmPassword) {
        handleError("Please enter password again");
        setInputValue({
          ...inputValue,
          password: "",
          confirmPassword: "",
        });
        return;
      }
      await createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          // Signed in
          const user = userCredential.user;
          await userService.signUp(username, email);
          handleSuccess("SignUp successfully");
          navigate("/login");
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          console.log("🚀 ~ handleSubmit ~ errorCode:", errorCode);
          const errorMessage = error.message;
          console.log("🚀 ~ handleSubmit ~ errorMessage:", errorMessage);
          if (errorCode == "auth/email-already-in-use") {
            handleError("Email already in use");
          } else if (errorCode == "auth/weak-password") {
            handleError("Password should be at least 6 characters");
          } else if (errorCode == "auth/missing-password") {
            handleError("Missing password");
          } else {
            handleError("Failed");
          }
          // ..
        });
    } catch (error) {
      console.log(error);
    }
    setInputValue({
      ...inputValue,
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="flex flex-col w-full h-[100vh] items-center justify-center">
      <img src="brand-gain.png" width={150} alt="logo"></img>
      <div className="form_container mt-2">
        <h2>Signup Account</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="username"
              name="username"
              value={username}
              placeholder="Enter your name"
              onChange={handleOnChange}
            />
          </div>
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
            <label htmlFor="password">Enter Your Password</label>
            <input
              type="password"
              name="password"
              value={password}
              placeholder="Enter your password"
              onChange={handleOnChange}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              placeholder="Confirm password"
              onChange={handleOnChange}
            />
          </div>
          <button type="submit">Submit</button>
          <span>
            Already have an account? <Link to={"/login"}>Login</Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Signup;
