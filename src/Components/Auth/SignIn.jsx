import { useState, useRef} from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";
import { useDispatch } from "react-redux";
import { authActions } from "../../Store/Auth";
import { BASE_URL } from "../Helpers/sendRequest";

const SignIn = () => {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  // const {login, googleSignIn} = useContext(AuthContext)
  const navigate = useNavigate();

  const fetchPosts = async (username) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/${username}/posts`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(authActions.setPosts(res.data));
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      const res = await axios.post(
        `${BASE_URL}/users/login`,
        {
          username: usernameRef.current.value,
          password: passwordRef.current.value,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      dispatch(
        authActions.setAuthData({
          token: res.data.token,
          name: res.data.user.name,
          email: res.data.user.email,
          username: res.data.user.username,
          avatarURL: res.data.user.avatarURL,
          id: res.data.user._id,
          ...(res.data.user.bio && { bio: res.data.user.bio }),
          age: res.data.user.age,
        })
      );
      navigate("/");
      const username = res.data.user.username;
      fetchPosts(username);
    } catch (er) {
      console.log(er);
      setError("Failed to Login! Please verify the credentials");
    }
    setLoading(false);
  };
  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      // await googleSignIn()
      // navigate('/')
    } catch (err) {
      setError(err.response.data.error);
    }
  };
  return (
    <div className="flex justify-center items-center">
      <div className="text-center rounded-lg shadow-[0px_3px_6px_6px_rgba(0,_0,_0,_0.16)] p-4 w-1/3 mtiny:w-4/5 my-5">
        <h1 className="text-3xl">Log In</h1>
        {error && <Alert severity="error">{error}</Alert>}
        {/* <button onClick={handleGoogleSignIn} className="border inline-block mx-auto w-fit border-blue-300 bg-gray-200 hover:bg-gray-300 my-3 px-3 py-1 text-sm font-semibold"><img className="w-5 inline-block mr-2" src={googlelogo} alt='Sign in with google' />Log in with google</button> */}
        <div>
          <div className="inline-block w-1/6 h-0.5 border-b border-black" />
          <span className="relative top-1 text-xs">
            {" "}
            or continue with Google{" "}
          </span>
          <div className="inline-block w-1/6 h-0.5 border-b border-black" />
        </div>
        <form className="text-left my-5" onSubmit={handleSubmit}>
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
          <div className="text-center">
            <button
              disabled={loading}
              className="inline-block mx-auto text-white bg-blue-600 hover:bg-blue-700 shadow-[0px_2px_2px_1px_rgba(0,_0,_0,_0.16)] rounded-md py-1 px-2.5"
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
