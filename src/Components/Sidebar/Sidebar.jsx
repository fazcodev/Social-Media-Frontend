import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Modal from "../UI/Modal";
import SearchPeople from "./SearchPeople";
import Notifications from "./Notifications";

import {
  Logout,
  HomeOutlined,
  Home,
  Search,
  ExploreOutlined,
  Explore,
  PersonOutlineOutlined,
  Person,
  Instagram,
  AddBoxOutlined,
} from "@mui/icons-material";
import "./SidebarUI.css";
import LogoutMenu from "./LogoutMenu";
import { useQueryClient } from "@tanstack/react-query";
import { prefetchProfile } from "../../Utils/FetchUtils";



const Sidebar = () => {
  const [active, setActive] = useState("Home");
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const [searchBar, setSearchBar] = useState(false);
  const [logoutMenu, setLogoutMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const queryClient = useQueryClient();
  const handleClick = (e) => {
    const innerText = e.currentTarget.id;
    if (!["Create", "Search", "Notifications"].includes(innerText)) {
      if (innerText == "Home") navigate("/home");
      else if (innerText == "Profile") navigate("/profile/posts");
      else navigate("/" + innerText.toLowerCase());
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


  return (
    <div className="md:w-1/5 w-14">
      {openCreatePost && (
        <Modal title="Create Post" openModalHandler={setOpenCreatePost} />
      )}
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
              searchBar ? "" : "md:hidden"
            } transition-all mt-3 duration-500 ease-in-out flex justify-center`}
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
            {location.pathname == "/home" ? (
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
            {location.pathname == "/explore" ? (
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
            onMouseEnter={()=>prefetchProfile(localStorage.getItem('username'), queryClient)}
            onClick={handleClick}
            className={` border-stone-200 mx-1 p-1 hover:bg-stone-200 transition-all rounded-md flex items-center mmd:justify-center ${
              searchBar ? "justify-center" : ""
            } cursor-pointer sidebarItem`}
          >
            {location.pathname.startsWith("/profile/") ? (
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
      <LogoutMenu logoutMenu={logoutMenu} />
      <SearchPeople active={searchBar} />
      {/* <Notifications active={active} /> */}
    </div>
  );
};

export default Sidebar;
