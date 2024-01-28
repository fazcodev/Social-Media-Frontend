import "./App.css";
import Sidebar from "./Components/Sidebar/Sidebar";
import Home from "./Components/Home/Home";
import Profile from "./Components/Profile/Profile";
import SignUp from "./Components/Auth/SignUp";
import SignIn from "./Components/Auth/SignIn";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import PrivateRoute from "./Components/Auth/PrivateRoute";
import EditProfile from "./Components/Profile/EditProfile";
import PeopleProfile from "./Components/Profile/PeopleProfile";
import Explore from "./Components/Explore/Explore";
function App() {
  return (
    <Router>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route
            path="/"
            element={
              <div className="flex justify-start h-screen">
                <Sidebar />
                <Outlet />
              </div>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
          </Route>
          <Route
            path="/profile"
            element={
              <div className="flex justify-start h-screen">
                <Sidebar />
                <Outlet />
              </div>
            }
          >
            <Route path="posts" element={<Profile />} />
            <Route path="saved" element={<Profile />} />
            <Route path="edit" element={<EditProfile />} />
            <Route path="users/:username" element={<PeopleProfile />} />
            <Route path="*" element="404 Page Not Found !!" />
          </Route>
        </Route>

        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="*" element="404 Page Not Found!!" />
      </Routes>
    </Router>
  );
}

export default App;

/*
return (
            <div
              key={index}
              onClick={() => setActivePost(post)}
              className={`shrink-0 basis-[32%] ${
                post.aspectRatio > 1.5 ? "row-span-2" : "aspect-square"
              } relative overflow-hidden bg-black items-center flex cursor-pointer img-overlay`}
              ref={posts.length === index + 1 ? lastPostElementRef : null}
            >
              <img className="w-full bg-cover" src={post.imageUrl} alt="post" />
              <div className="middle text-white z-10">
                <button>
                  <FavoriteOutlined />
                  {post.likesCount}
                </button>
                <button className="ml-5">
                  <MapsUgc />
                  {post.commentsCount}
                </button>
              </div>
              <div className="overlay w-full h-full" />
            </div>
          );

*/
