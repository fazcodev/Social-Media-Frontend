import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Alert } from "@mui/material";
import { useDispatch } from "react-redux";
import { authActions } from "../../Store/Auth";
import { BASE_URL } from "../Helpers/sendRequest";


const SignUp = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const nameRef = useRef();
  const usernameRef = useRef();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
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
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      setError("Passwords do not match");
      return;
    }
    try {
      setError("");
      setLoading(true);
      const res = await axios.post(
        `${BASE_URL}/users`,
        {
          name: nameRef.current.value,
          username: usernameRef.current.value,
          email: emailRef.current.value,
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
          email: res.data.user.email,
          name: res.data.user.name,
          username: res.data.user.username,
          avatarURL: res.data.user.avatarURL,
          id: res.data.user._id,
          ...(res.data.user.bio && { bio: res.data.user.bio }),
          age: res.data.user.age,
        })
      );
      navigate("/home");
      const username = res.data.user.username;
      fetchPosts(username);
    } catch (er) {
      console.log(er);
      setError(er.response.data.error);
    }
    setLoading(false);

  };
  return (
    <div className="flex justify-center items-center">
      <div className="text-center rounded-lg shadow-[0px_3px_6px_6px_rgba(0,_0,_0,_0.16)] p-4 w-1/3 mtiny:w-4/5 my-5">
        <h1 className="text-3xl">SignUp</h1>
        <form className="text-left my-5" onSubmit={handleSubmit}>
          {error && <Alert severity="error">{error}</Alert>}
          <label htmlFor="username">
            <b>Email</b>
          </label>
          <input
            ref={emailRef}
            id = 'email'
            className="inline-block mb-3 w-full px-2 py-1 border-solid border"
            name="email"
            placeholder="Email"
            type="email"
            required
          ></input>
          <label htmlFor="username">
            <b>Name</b>
          </label>
          <input
            ref={nameRef}
            id = 'name'
            className="inline-block mb-3 w-full px-2 py-1 border-solid border"
            name="name"
            placeholder="Name"
            type="text"
            required
          ></input>
          <label htmlFor="username">
            <b>Username</b>
          </label>
          <input
            id = 'username'
            ref={usernameRef}
            className="inline-block mb-3 w-full px-2 py-1 border-solid border"
            name="username"
            placeholder="Username"
            type="text"
            required
          ></input>
          <label htmlFor="password">
            <b>Password</b>
          </label>
          <input
            id = 'password'
            ref={passwordRef}
            className="inline-block mb-4 w-full px-2 py-1 border-solid border"
            name="password"
            placeholder="Password"
            type="password"
            required
          ></input>
          <label htmlFor="confirm-password">
            <b>Confirm Password</b>
          </label>
          <input
            id = 'confirm-password'
            ref={passwordConfirmRef}
            className="inline-block mb-4 w-full px-2 py-1 border-solid border"
            name="confirm-password"
            placeholder="Retype-Password"
            type="password"
            required
          ></input>
          <div className="text-center">
            <button
              disabled={loading}
              className="inline-block mx-auto text-white bg-blue-600 hover:bg-blue-700 shadow-[0px_2px_2px_1px_rgba(0,_0,_0,_0.16)] rounded-md py-1 px-2.5"
              type="submit"
            >
              Sign Up
            </button>
          </div>
        </form>
        <div className="text-blue-600">
          Already have an account ?{" "}
          <Link to="/signin" className="font-bold hover:text-blue-700">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
