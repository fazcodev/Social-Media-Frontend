import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
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
  LightMode,
  DarkMode,
} from "@mui/icons-material";
import "./SidebarUI.css";
import LogoutMenu from "./LogoutMenu";
import { useQueryClient } from "@tanstack/react-query";
import { prefetchProfile } from "../../Utils/FetchUtils";
import { themeActions } from "../../Store/Theme";



const Sidebar = () => {
  const [active, setActive] = useState("Home");
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const [searchBar, setSearchBar] = useState(false);
  const [logoutMenu, setLogoutMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const queryClient = useQueryClient();
  const theme = useSelector((state) => state.theme.theme);
  const dispatch = useDispatch();
  const toggleTheme = () => dispatch(themeActions.toggleTheme());
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

  const isActive = (path) => {
    if (path === "/home" && location.pathname === "/home") return true;
    if (path === "/explore" && location.pathname === "/explore") return true;
    if (path === "Search" && searchBar) return true;
    if (path === "Create" && openCreatePost) return true;
    if (path === "Profile" && location.pathname.startsWith("/profile/")) return true;
    return false;
  };

  const getItemClass = (id, pathForActive) => {
    const activeState = isActive(pathForActive || id);
    return `group mx-2 my-1 p-3 rounded-xl flex items-center transition-all duration-300 cursor-pointer ${activeState
      ? "bg-accent/20 dark:bg-accent/25 text-accent dark:text-accent font-semibold shadow-sm"
      : "text-slate-600 dark:text-slate-400 hover:bg-slate-300/50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-200"
      } ${searchBar ? "justify-center" : "mmd:justify-center"}`;
  };

  return (
    <div className="md:w-1/5 w-20 relative z-20">
      {openCreatePost && (
        <Modal title="Create Post" openModalHandler={setOpenCreatePost} />
      )}
      <div
        className={`${!searchBar ? "md:w-[inherit] w-20" : "w-20"
          } fixed top-0 left-0 flex flex-col justify-between h-screen border-r-2 border-white/50 dark:border-slate-700/50 bg-white/30 dark:bg-slate-800/40 backdrop-blur-xl transition-all duration-500`}
      >
        <ul className="flex flex-col gap-2 mt-4">
          <li id="logo-container" className="mb-2 transition-all duration-300">
            {/* Desktop Logo (Full) */}
            <div
              className={`pl-4 pr-6 py-4 flex items-center gap-2 mmd:hidden transition-all duration-300 ${searchBar ? 'opacity-0 invisible absolute' : 'opacity-100 visible'}`}
            >
              <Instagram className="text-accent dark:text-cyan-400" fontSize="large" />
              <h1 className="text-3xl font-heading font-extrabold logo-gradient cursor-pointer tracking-tight drop-shadow-sm" onClick={() => navigate('/home')}>
                SnapMedia
              </h1>
            </div>

            {/* Collapsed/Mobile Logo (Icon Only) */}
            <div
              className={`justify-center transition-all duration-300 ${searchBar ? "flex" : "flex md:hidden"
                } ${!searchBar ? "mt-4" : "mt-6"}`}
            >
              <div
                className="cursor-pointer"
                onClick={() => navigate('/home')}
              >
                <Instagram className="text-accent" fontSize="large" />
              </div>
            </div>
          </li>

          <li
            id="Home"
            onClick={handleClick}
            className={getItemClass("Home", "/home")}
          >
            {location.pathname == "/home" ? (
              <Home fontSize="medium" className="scale-110" />
            ) : (
              <HomeOutlined fontSize="medium" />
            )}
            <span
              className={`font-medium text-base ml-4 mmd:hidden ${searchBar ? "hidden" : ""
                }`}
            >
              Home
            </span>
          </li>

          <li
            id="Search"
            onClick={handleClick}
            className={getItemClass("Search")}
          >
            <Search fontSize="medium" className={searchBar ? "scale-110" : ""} />
            <span
              className={`font-medium text-base ml-4 mmd:hidden ${searchBar ? "hidden" : ""
                }`}
            >
              Search
            </span>
          </li>

          <li
            id="Explore"
            onClick={handleClick}
            className={getItemClass("Explore", "/explore")}
          >
            {location.pathname == "/explore" ? (
              <Explore fontSize="medium" className="scale-110" />
            ) : (
              <ExploreOutlined fontSize="medium" />
            )}
            <span
              className={`font-medium text-base ml-4 mmd:hidden ${searchBar ? "hidden" : ""
                }`}
            >
              Explore
            </span>
          </li>

          <li
            id="Create"
            onClick={handleClick}
            className={getItemClass("Create")}
          >
            <AddBoxOutlined fontSize="medium" className={openCreatePost ? "scale-110" : ""} />
            <span
              className={`font-medium text-base ml-4 mmd:hidden ${searchBar ? "hidden" : ""
                }`}
            >
              Create
            </span>
          </li>

          <li
            id="Profile"
            onMouseEnter={() => prefetchProfile(localStorage.getItem('username'), queryClient)}
            onClick={handleClick}
            className={getItemClass("Profile", "Profile")}
          >
            {location.pathname.startsWith("/profile/") ? (
              <Person fontSize="medium" className="scale-110" />
            ) : (
              <PersonOutlineOutlined fontSize="medium" />
            )}
            <span
              className={`font-medium text-base ml-4 mmd:hidden ${searchBar ? "hidden" : ""
                }`}
            >
              Profile
            </span>
          </li>
        </ul>

        <div className="mb-4 flex flex-col">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`group mx-2 my-1 p-3 rounded-xl flex items-center transition-all duration-300 cursor-pointer text-slate-600 dark:text-slate-400 hover:bg-slate-300/50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-200 ${searchBar ? "justify-center" : "mmd:justify-center"}`}
          >
            {theme === "dark" ? <LightMode fontSize="medium" /> : <DarkMode fontSize="medium" />}
            <span className={`font-medium text-base ml-4 mmd:hidden ${searchBar ? "hidden" : ""}`}>
              {theme === "dark" ? "Light" : "Dark"}
            </span>
          </button>

          {/* Logout */}
          <button
            onClick={() => setLogoutMenu((prev) => !prev)}
            className={`group mx-2 my-1 p-3 rounded-xl flex items-center transition-all duration-300 cursor-pointer text-slate-600 dark:text-slate-400 hover:bg-slate-300/50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-200 ${searchBar ? "justify-center" : "mmd:justify-center"}`}
          >
            <Logout fontSize="medium" />
            <span className={`font-medium text-base ml-4 mmd:hidden ${searchBar ? "hidden" : ""}`}>Log out</span>
          </button>
        </div>
      </div>
      <LogoutMenu logoutMenu={logoutMenu} />
      <SearchPeople active={searchBar} />
    </div>
  );
};

export default Sidebar;
