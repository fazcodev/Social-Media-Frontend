import { useState, useEffect, useRef } from "react";
import ProfilePosts from "./ProfilePosts";
import ProfileDesc from "./ProfileDesc";
import Recommend from "./Recommend";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import SavedPosts from "./SavedPosts";
import { GridOnSharp, BookmarkBorderSharp } from "@mui/icons-material";
import axios from "axios";
import { BASE_URL } from "../Helpers/sendRequest";

export default function Profile() {
  const [myPosts, setMyPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [navInfo, setNavInfo] = useState({
    width: 0,
    left: 0,
  });
  const location = useLocation();
  const navigate = useNavigate();
  const elementRef = useRef(null);
  const outerRef = useRef(null);

  useEffect(() => {
    // let resizeObserverEntries = [];

    const observer = new ResizeObserver((entries) => {
      if (elementRef.current) {
        const elementRect = elementRef.current.getBoundingClientRect();
        setNavInfo({
          width: elementRect.width,
          left:
            elementRect.left - entries[0].target.getBoundingClientRect().left,
        });
      }
    });
    if (outerRef.current) observer.observe(outerRef.current);

    return () => observer.disconnect();
  }, [location]);

  const getSavedPosts = async () => {
    try {
      const res = await axios({
        method: "GET",
        url: `${BASE_URL}/posts/${localStorage.getItem("username")}/saved`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSavedPosts(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const getMyPosts = async () => {
    try {
      const res = await axios({
        method: "GET",
        url: `${BASE_URL}/${localStorage.getItem("username")}/posts`,
      });
      setMyPosts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getMyPosts();
    getSavedPosts();
  }, [location]);
  return (
    <div className="flex flex-1 justify-evenly">
      <div className="grow shrink basis-[85%] mmd:basis-[80%] border-r">
        <ProfileDesc />
        <div>
          <div ref={outerRef} className="w-full bg-stone-300 overflow-hidden">
            <div
              className="slider bg-black"
              style={{
                width: navInfo.width,
                left: navInfo.left,
                height: 2,
                transition: "all 0.3s ease-in-out",
                position: "relative",
              }}
            ></div>
          </div>

          <div className="flex h-12 items-center justify-center gap-16">
            <NavLink
              to={"/profile/posts"}
              className={({ isActive }) =>
                isActive
                  ? "sidebarItem font-semibold"
                  : "sidebarItem font-semibold text-stone-400"
              }
              ref={location.pathname == "/profile/posts" ? elementRef : null}
            >
              <GridOnSharp fontSize="small" />
              <span className="ml-2">POSTS</span>
            </NavLink>
            <NavLink
              to={"/profile/saved"}
              className={({ isActive }) =>
                isActive
                  ? "sidebarItem font-semibold"
                  : "sidebarItem font-semibold text-stone-400"
              }
              ref={location.pathname === "/profile/saved" ? elementRef : null}
            >
              <BookmarkBorderSharp fontSize="small" />
              <span className="ml-2">SAVED</span>
            </NavLink>
          </div>
        </div>
        {location.pathname === "/profile/posts" ? (
          <ProfilePosts posts={myPosts} />
        ) : location.pathname === "/profile/saved" ? (
          <SavedPosts posts={savedPosts} />
        ) : (
          navigate("/404")
        )}
      </div>
      <Recommend />
    </div>
  );
}
