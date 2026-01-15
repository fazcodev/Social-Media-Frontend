import "./App.css";
import Home from "./Components/Home/Home";
import Profile from "./Components/Profile/Profile";
import SignUp from "./Components/Auth/SignUp";
import SignIn from "./Components/Auth/SignIn";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./Components/Auth/PrivateRoute";
import EditProfile from "./Components/Profile/EditProfile/EditProfile";
import PeopleProfile from "./Components/Profile/PeopleProfile";
import Explore from "./Components/Explore/Explore";
import MainLayout from "./Components/UI/MainLayout";

function App() {
  return (
    <Router>
      <Routes>
        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            {/* "/" redirect is handled in PrivateRoute */}
            <Route path="/" element={null} />
            <Route path="home" element={<Home />} />
            <Route path="explore" element={<Explore />} />

            {/* Profile Routes */}
            <Route path="profile">
              <Route path="posts" element={<Profile />} />
              <Route path="saved" element={<Profile />} />
              <Route path="edit" element={<EditProfile />} />
              <Route path="users/:username" element={<PeopleProfile />} />
            </Route>
          </Route>
        </Route>

        {/* Public Routes */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-white mb-4">404</h1>
                <p className="text-slate-400 text-lg">Page Not Found</p>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
