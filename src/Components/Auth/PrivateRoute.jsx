import { useEffect, useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { authActions } from "../../Store/Auth";
import { apiUrl } from "../../Config/config";
import { CircularProgress } from "@mui/material";

const PrivateRoute = () => {
  const [authState, setAuthState] = useState("loading"); // 'loading' | 'authenticated' | 'unauthenticated'
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const username = localStorage.getItem("username");

      // No username in localStorage = not logged in
      if (!username) {
        setAuthState("unauthenticated");
        return;
      }

      try {
        // Verify with backend
        const res = await axios.get(`${apiUrl}/users/me`, {
          withCredentials: true,
        });

        // Store user data in Redux
        dispatch(
          authActions.setAuthData({
            name: res.data.name,
            email: res.data.email,
            username: res.data.username,
            avatarURL: res.data.avatarURL,
            id: res.data._id,
            ...(res.data.bio && { bio: res.data.bio }),
            age: res.data.age,
          })
        );

        setAuthState("authenticated");
      } catch (err) {
        console.log("Unauthorized", err.response?.data?.error);
        // Clear invalid localStorage data
        localStorage.removeItem("username");
        localStorage.removeItem("name");
        localStorage.removeItem("id");
        localStorage.removeItem("avatarURL");
        setAuthState("unauthenticated");
      }
    };

    checkAuth();
  }, [dispatch]);

  // Show loading spinner while checking auth
  if (authState === "loading") {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <CircularProgress sx={{ color: "#38bdf8" }} />
      </div>
    );
  }

  // Redirect to signin if not authenticated
  if (authState === "unauthenticated") {
    return <Navigate to="/signin" replace />;
  }

  // Redirect "/" to "/home" for authenticated users
  if (location.pathname === "/") {
    return <Navigate to="/home" replace />;
  }

  // Render protected routes
  return <Outlet />;
};

export default PrivateRoute;

