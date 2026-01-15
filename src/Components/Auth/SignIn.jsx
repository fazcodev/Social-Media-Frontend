import { useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";
import { useDispatch } from "react-redux";
import { authActions } from "../../Store/Auth";
import { apiUrl } from "../../Config/config";
import { googleSignIn } from "./O-Auth_SignIn";
import { googleProvider, auth } from "../../Config/firebase-config";

const SignIn = () => {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
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
      if (er?.response) setError(er.response.data.error);
      else setError(er.message)
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async (e) => {
    setError("");
    setLoading(true);
    try {
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
      if (er.response) setError(er.response.data.error);
      setError(er.message)
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen w-full bg-transparent text-slate-900 dark:text-white transition-colors duration-300 relative overflow-hidden">
      <div className="relative z-10 w-full max-w-md p-8 bg-white/20 dark:bg-slate-900/40 backdrop-blur-2xl border-2 border-white/50 dark:border-white/10 rounded-3xl shadow-2xl animate-fade-in shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">

        <div className="text-center mb-6">
          <h1 className="text-3xl font-heading font-bold text-slate-800 dark:text-white mb-2">Welcome Back</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Sign in to continue to your account</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          disabled={loading}
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-sm mb-5 backdrop-blur-md"
        >
          <img
            className="w-5 h-5"
            src="https://img.icons8.com/color/48/000000/google-logo.png"
            alt="google"
          />
          <span>Sign in with Google</span>
        </button>

        <div className="flex items-center gap-4 mb-5">
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></div>
          <span className="text-xs font-medium text-slate-400 dark:text-slate-400 uppercase tracking-wider">Or</span>
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
              Username
            </label>
            <input
              ref={usernameRef}
              id="username"
              name="username"
              type="username"
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all duration-200 text-slate-900 dark:text-white placeholder-slate-400"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
              Password
            </label>
            <input
              ref={passwordRef}
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all duration-200 text-slate-900 dark:text-white placeholder-slate-400"
              placeholder="Enter your password"
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            className={`w-full py-3 px-4 rounded-xl text-white font-semibold text-center transition-all duration-200 shadow-lg shadow-accent/25 mt-2 ${loading
              ? "bg-slate-400 cursor-not-allowed"
              : "bg-gradient-to-r from-accent to-accent-dark hover:shadow-accent/40 hover:scale-[1.02] active:scale-[0.98]"
              }`}
          >
            {loading ? "Signing in..." : "Log In"}
          </button>
        </form>

        <div className="mt-6 text-center text-slate-500 dark:text-slate-400 text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="font-semibold text-accent hover:text-accent-dark transition-colors">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
