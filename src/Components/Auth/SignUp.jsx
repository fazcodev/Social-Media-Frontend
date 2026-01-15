import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { authActions } from "../../Store/Auth";
import { apiUrl } from "../../Config/config";

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
        `${apiUrl}/users`,
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
          withCredentials: true,
        }
      );

      dispatch(
        authActions.setAuthData({
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
    } catch (er) {
      console.log(er);
      setError(er.response?.data?.error || er.message);
    }
    setLoading(false);

  };
  return (
    <div className="flex justify-center items-center h-screen w-full bg-transparent text-slate-900 dark:text-white transition-colors duration-300">
      <div className="relative z-10 w-full max-w-4xl p-6 bg-white/20 dark:bg-slate-900/40 backdrop-blur-2xl border-2 border-white/50 dark:border-white/10 rounded-3xl shadow-2xl animate-fade-in flex flex-col md:flex-row shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">

        {/* Header Section for Desktop - Left Side */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/3 p-4 border-r border-slate-200 dark:border-slate-700 text-center">
          <h1 className="text-3xl font-heading font-bold text-slate-800 dark:text-white mb-2">Join Us</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Create an account to connect with friends.</p>
        </div>

        {/* Form Section */}
        <div className="flex-1 p-2 md:pl-6">
          <div className="md:hidden text-center mb-4">
            <h1 className="text-2xl font-heading font-bold text-slate-800 dark:text-white">Create Account</h1>
          </div>

          {error && (
            <div className="mb-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-lg text-xs text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  ref={nameRef}
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-accent focus:ring-1 focus:ring-accent/50 outline-none transition-all duration-200 text-slate-900 dark:text-white placeholder-slate-400 text-sm"
                  placeholder="Full Name"
                />
              </div>
              <div>
                <input
                  ref={usernameRef}
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-accent focus:ring-1 focus:ring-accent/50 outline-none transition-all duration-200 text-slate-900 dark:text-white placeholder-slate-400 text-sm"
                  placeholder="Username"
                />
              </div>
            </div>

            <div>
              <input
                ref={emailRef}
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-accent focus:ring-1 focus:ring-accent/50 outline-none transition-all duration-200 text-slate-900 dark:text-white placeholder-slate-400 text-sm"
                placeholder="Email Address"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  ref={passwordRef}
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-accent focus:ring-1 focus:ring-accent/50 outline-none transition-all duration-200 text-slate-900 dark:text-white placeholder-slate-400 text-sm"
                  placeholder="Password"
                />
              </div>
              <div>
                <input
                  ref={passwordConfirmRef}
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  required
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-accent focus:ring-1 focus:ring-accent/50 outline-none transition-all duration-200 text-slate-900 dark:text-white placeholder-slate-400 text-sm"
                  placeholder="Confirm Password"
                />
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className={`w-full py-2.5 px-4 mt-2 rounded-xl text-white font-semibold text-center transition-all duration-200 shadow-lg shadow-accent/25 text-sm ${loading
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-accent to-accent-dark hover:shadow-accent/40 hover:scale-[1.01] active:scale-[0.99]"
                }`}
            >
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-4 text-center text-slate-500 dark:text-slate-400 text-xs">
            Already have an account?{" "}
            <Link to="/signin" className="font-semibold text-accent hover:text-accent-dark transition-colors">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
