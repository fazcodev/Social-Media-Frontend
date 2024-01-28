import Modal from "../UI/Modal";
import SearchPeople from "./SearchPeople";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../Helpers/sendRequest";
import {
  Logout,
  PhoneAndroid,
  DevicesOther,
  HomeOutlined,
  Home,
  Search,
  ExploreOutlined,
  Explore,
  NotificationsOutlined,
  PersonOutlineOutlined,
  Person,
  Instagram,
  AddBoxOutlined,
  FastForward,
} from "@mui/icons-material";
import "./SidebarUI.css";
import Notifications from "./Notifications";

const Sidebar = () => {
  const [active, setActive] = useState("Home");
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const [searchBar, setSearchBar] = useState(false);
  const [logoutMenu, setLogoutMenu] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();
  const handleClick = (e) => {
    const innerText = e.currentTarget.id;
    if (!["Create", "Search", "Notifications"].includes(innerText)) {
      if (innerText == "Home") navigate("/home");
      else if (innerText == "Profile") navigate("/profile/posts");
      else navigate("/" + innerText);
    }
    if (innerText == "Create") {
      setOpenCreatePost(true);
      setSearchBar(false);
    } else if (innerText == "Search") setSearchBar((prev) => !prev);
    else {
      setActive(innerText);
      setSearchBar(false);
    }
  };
  const logoutHandler = async () => {
    setLoggingOut(true);
    try {
      await axios.post(
        `${BASE_URL}/users/logout`,
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("name");
      localStorage.removeItem("email");
      localStorage.removeItem("avatarURL");
      navigate("/signin");
    } catch (err) {
      console.log(err);
    }
    setLoggingOut(false);
  };
  const logoutAllHandler = async () => {
    setLoggingOut(true);
    try {
      await axios.post(
        `${BASE_URL}/users/logoutAll`,
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("name");
      localStorage.removeItem("email");
      localStorage.removeItem("avatarURL");
      navigate("/signin");
    } catch (err) {
      console.log(err.response.data.error);
    }
    setLoggingOut(false);
  };

  return (
    <div className="md:w-1/5 w-14">
      {openCreatePost && (
        <Modal title="Create Post" openModalHandler={setOpenCreatePost} />
      )}
      {/* <div className="md:w-1/5 w-12" /> */}
      <div
        className={`${
          !searchBar ? "md:w-full w-14" : "w-14"
        } flex flex-col justify-between h-full overflow-y-auto border-r border-stone-200 transition-all duration-500`}
      >
        <ul className="flex flex-col gap-3">
          {!searchBar ? (
            <li
              id="logo"
              className="border-stone-200 px-2 py-1.5 mmd:hidden text-3xl font-normal cursor-pointer sidebarTitle"
            >
              SnapMedia
            </li>
          ) : (
            ""
          )}

          <li
            id="logo"
            className={`${
              searchBar
                ? "md:block md:opacity-100 opacity-100 block"
                : "md:hidden md:opacity-0 opacity-100 block"
            } transition-all duration-500 ease-in-out mx-2.5 mt-1`}
          >
            <Instagram fontSize="large" />
          </li>
          <li
            id="Home"
            onClick={handleClick}
            className={` border-stone-200 mx-1 p-1 hover:bg-stone-200 transition-all rounded-md flex items-center mmd:justify-center ${
              searchBar ? "justify-center" : ""
            } cursor-pointer sidebarItem`}
          >
            {active == "Home" ? (
              <Home fontSize="large" />
            ) : (
              <HomeOutlined fontSize="large" />
            )}
            <span
              className={`font-medium text-md ml-2 mmd:hidden ${
                searchBar ? "hidden" : ""
              }`}
            >
              Home
            </span>
          </li>
          <li
            id="Search"
            onClick={handleClick}
            className={` border-stone-200 mx-1 p-1 hover:bg-stone-200 transition-all rounded-md flex items-center mmd:justify-center ${
              searchBar ? "justify-center" : ""
            } cursor-pointer sidebarItem`}
          >
            <Search fontSize="large" />
            <span
              className={`font-medium text-md ml-2 mmd:hidden ${
                searchBar ? "hidden" : ""
              }`}
            >
              Search
            </span>
          </li>
          <li
            id="Explore"
            onClick={handleClick}
            className={` border-stone-200 mx-1 p-1 hover:bg-stone-200 transition-all rounded-md flex items-center mmd:justify-center ${
              searchBar ? "justify-center" : ""
            } cursor-pointer sidebarItem`}
          >
            {active == "Explore" ? (
              <Explore fontSize="large" />
            ) : (
              <ExploreOutlined fontSize="large" />
            )}
            <span
              className={`font-medium text-md ml-2 mmd:hidden ${
                searchBar ? "hidden" : ""
              }`}
            >
              Explore
            </span>
          </li>
          {/* <li
            onClick={handleClick}
            className=" border-stone-200 m-1 p-1 hover:bg-stone-200 rounded-md flex items-center cursor-pointer sidebarItem"
          >
            <NotificationsOutlined fontSize="large" />
            <span className={`font-medium text-md ml-2 mmd:hidden ${searchBar ? 'hidden': ''}`}>Notifications</span>
          </li> */}
          <li
            id="Create"
            onClick={handleClick}
            className={` border-stone-200 mx-1 p-1 hover:bg-stone-200 transition-all rounded-md flex items-center mmd:justify-center ${
              searchBar ? "justify-center" : ""
            } cursor-pointer sidebarItem`}
          >
            <AddBoxOutlined fontSize="large" />
            <span
              className={`font-medium text-md ml-2 mmd:hidden ${
                searchBar ? "hidden" : ""
              }`}
            >
              Create
            </span>
          </li>
          <li
            id="Profile"
            onClick={handleClick}
            className={` border-stone-200 mx-1 p-1 hover:bg-stone-200 transition-all rounded-md flex items-center mmd:justify-center ${
              searchBar ? "justify-center" : ""
            } cursor-pointer sidebarItem`}
          >
            {active == "Profile" ? (
              <Person fontSize="large" />
            ) : (
              <PersonOutlineOutlined fontSize="large" />
            )}
            <span
              className={`font-medium text-md ml-2 mmd:hidden ${
                searchBar ? "hidden" : ""
              }`}
            >
              Profile
            </span>
          </li>
        </ul>
        <div className="p-2">
          <button onClick={() => setLogoutMenu((prev) => !prev)}>
            <Logout fontSize="large" />
          </button>
        </div>
      </div>
      <div
        className={`flex flex-col absolute bottom-10 z-30 ${
          logoutMenu ? "left-2 opacity-100" : "-left-44 opacity-0"
        } transition-all duration-300 bg-stone-200 rounded-lg p-2 text-xs text-center`}
      >
        <button
          onClick={logoutHandler}
          disabled={loggingOut}
          className="text-white bg-red-500 hover:bg-red-600 block px-1 py-0.5 rounded-md mb-3"
        >
          <PhoneAndroid />
          {`  Logout`}
        </button>
        <button
          onClick={logoutAllHandler}
          disabled={loggingOut}
          className="text-white bg-red-500 hover:bg-red-600 block px-1 py-0.5 rounded-md"
        >
          <DevicesOther />
          {`  Logout from all Devices`}
        </button>
      </div>
      <SearchPeople active={searchBar} />
      <Notifications active={active} />
    </div>
  );
};

export default Sidebar;
