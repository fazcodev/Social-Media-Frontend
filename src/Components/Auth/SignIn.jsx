import { useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";
import { useDispatch } from "react-redux";
import { authActions } from "../../Store/Auth";
import { apiUrl } from "../../Config/config";
import { googleSignIn } from "./O-Auth_SignIn";
import { googleProvider, auth } from "../../Config/firebase-config";
import AuthBg from "../Assets/AuthBg.jpg";

const SignIn = () => {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  // const {login, googleSignIn} = useContext(AuthContext)
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      const res = await axios.post(
        `${apiUrl}/users/login`,
        {
          username: usernameRef.current.value,
          password: passwordRef.current.value,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      navigate("/home");
      dispatch(
        authActions.setAuthData({
          // token: res.data.token,
          name: res.data.user.name,
          email: res.data.user.email,
          username: res.data.user.username,
          avatarURL: res.data.user.avatarURL,
          id: res.data.user._id,
          bio: res.data.user.bio,
          age: res.data.user.age,
        })
      );
    } catch (er) {
      console.log(er);
      if(er?.response)setError(er.response.data.error);
      else setError(er.message)
    }
    setLoading(false);
  };
  const handleGoogleSignIn = async (e) => {
    try {
      setLoading(true);
      setError("");
      const data = await googleSignIn(auth, googleProvider);
      const res = await axios.post(
        `${apiUrl}/users/oauth-login`,
        {
          user: {
            username: data.user.username,
            password: data.token,
            name: data.user.name,
            email: data.user.email,
            avatarURL: data.user.avatarURL,
          },
          OAuth: data.provider,
          token: data.token,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      navigate("/home");
      dispatch(
        authActions.setAuthData({
          // token: res.data.token,
          name: res.data.user.name,
          email: res.data.user.email,
          username: res.data.user.username,
          avatarURL: res.data.user.avatarURL,
          id: res.data.user._id,
          bio: res.data.user.bio,
          age: res.data.user.age,
        })
      );
    } catch (er) {
      console.error(er);
      if(er?.response)setError(er.response.data.error);
      else if(typeof(er.message) === string) setError(er.message)
    }
    setLoading(false);
  };
  return (
    <div
      className="flex justify-center items-center h-screen bg-cover bg-no-repeat bg-center"
      style={{ backgroundImage: `url(${AuthBg})` }}
    >
      <div className="text-center border-neutral-500 border-2 rounded-xl bg-gray-100 bg-opacity-90 shadow-[0px_3px_6px_6px_rgba(0,_0,_0,_0.16)] px-4 py-8 w-1/3 mlg:w-1/2 mtiny:w-11/12 my-5">
        <h1 className="xl:text-4xl text-3xl font-semibold">Log In</h1>
        {error && <Alert severity="error">{error}</Alert>}
        {/* <button onClick={handleGoogleSignIn} className="border inline-block mx-auto w-fit border-blue-300 bg-gray-200 hover:bg-gray-300 my-3 px-3 py-1 text-sm font-semibold"><img className="w-5 inline-block mr-2" src={googlelogo} alt='Sign in with google' />Log in with google</button> */}
        <div>
          <div className="inline-block w-1/6 h-0.5 border-b border-black" />
          <span className="relative top-1 text-xs font-medium">
            {" "}
            or continue with Google{" "}
          </span>
          <div className="inline-block w-1/6 h-0.5 border-b border-black" />
          <button
            onClick={handleGoogleSignIn}
            className={`block bg-neutral-200 hover:bg-neutral-300 border-neutral-400 transition-all border-2 w-3/4 mtiny:w-full mx-auto my-4 py-2 px-2 rounded`}
          >
            <img
              className="w-6 inline-block"
              src="https://img.icons8.com/color/48/000000/google-logo.png"
              alt="google"
            />
            <span className="text-black font-semibold ml-4">
              Sign in with Google
            </span>
          </button>
        </div>
        <form className="text-left my-5 xl:text-xl text-md" onSubmit={handleSubmit}>
          <label htmlFor="username">
            <b>Username</b>
          </label>
          <input
            ref={usernameRef}
            id="username"
            className="inline-block mb-3 w-full px-2 py-1 border-solid border"
            name="username"
            placeholder="Username"
            type="username"
            required
          ></input>
          <label htmlFor="password">
            <b>Password</b>
          </label>
          <input
            ref={passwordRef}
            id="password"
            className="inline-block mb-4 w-full px-2 py-1 border-solid border"
            name="password"
            placeholder="Password"
            type="password"
            required
          ></input>
          <div className="text-center font-medium">
            <button
              disabled={loading}
              className={`inline-block mx-auto text-white ${
                loading
                  ? "bg-blue-300 cursor-wait"
                  : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
              } shadow-[0px_2px_2px_1px_rgba(0,_0,_0,_0.16)] rounded-md py-1 px-2.5`}
              type="submit"
            >
              Log In
            </button>
          </div>
        </form>
        <button className="font-bold text-blue-600 cursor-pointer hover:text-blue-800">
          <Link to="/signup">Create an account</Link>
        </button>
      </div>
    </div>
  );
};

export default SignIn;
