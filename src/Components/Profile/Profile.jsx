import { useState, useEffect, useRef } from "react";
import { useLocation, NavLink, useNavigate } from "react-router-dom";

import ProfilePosts from "./Posts/ProfilePosts";
import ProfileDesc from "./ProfileDesc";
import Recommend from "./Recommend";
import SavedPosts from "./Posts/SavedPosts";

import { GridOnSharp, BookmarkBorderSharp } from "@mui/icons-material";

export default function Profile() {
  const [navInfo, setNavInfo] = useState({ width: 0, left: 0 });
  const location = useLocation();
  const navigate = useNavigate();
  const elementRef = useRef(null);
  const outerRef = useRef(null);
  const username = localStorage.getItem("username");


  useEffect(() => {
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

  return (
    <div className="flex flex-1 justify-evenly overflow-y-auto">
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
              to="/profile/posts"
              className={({ isActive }) =>
                isActive
                  ? "sidebarItem font-semibold"
                  : "sidebarItem font-semibold text-stone-400"
              }
              ref={location.pathname === "/profile/posts" ? elementRef : null}
            >
              <GridOnSharp fontSize="small" />
              <span className="ml-2">POSTS</span>
            </NavLink>
            <NavLink
              to="/profile/saved"
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
          <ProfilePosts username = {username} />
        ) : location.pathname === "/profile/saved" ? (
          <SavedPosts username = {username} />
        ) : (
          navigate("/404")
        )}
      </div>
      <Recommend />
    </div>
  );
}
