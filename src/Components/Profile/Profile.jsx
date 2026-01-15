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
    <div className="flex flex-1 items-start justify-evenly overflow-y-auto">
      <div className="grow shrink basis-[85%] border-r-2 border-slate-200 dark:border-slate-800 mmd:basis-[80%] transition-colors duration-300 min-h-screen">
        <ProfileDesc />
        <div>
          <div ref={outerRef} className="w-full bg-slate-200 dark:bg-slate-800/50 h-[2px] mt-4 relative">
            <div
              className="slider bg-accent shadow-[0_0_10px_rgba(56,189,248,0.5)]"
              style={{
                width: navInfo.width,
                left: navInfo.left,
                height: 2,
                transition: "all 0.3s ease-in-out",
                position: "relative",
              }}
            ></div>
          </div>

          <div className="flex h-12 items-center justify-center gap-16 mt-2">
            <NavLink
              to="/profile/posts"
              className={({ isActive }) =>
                isActive
                  ? "sidebarItem font-bold text-accent flex items-center transition-colors"
                  : "sidebarItem font-semibold text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 flex items-center transition-colors"
              }
              ref={location.pathname === "/profile/posts" ? elementRef : null}
            >
              <GridOnSharp fontSize="small" />
              <span className="ml-2 tracking-wide text-sm">POSTS</span>
            </NavLink>
            <NavLink
              to="/profile/saved"
              className={({ isActive }) =>
                isActive
                  ? "sidebarItem font-bold text-accent flex items-center transition-colors"
                  : "sidebarItem font-semibold text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 flex items-center transition-colors"
              }
              ref={location.pathname === "/profile/saved" ? elementRef : null}
            >
              <BookmarkBorderSharp fontSize="small" />
              <span className="ml-2 tracking-wide text-sm">SAVED</span>
            </NavLink>
          </div>
        </div>
        {location.pathname === "/profile/posts" ? (
          <ProfilePosts username={username} />
        ) : location.pathname === "/profile/saved" ? (
          <SavedPosts username={username} />
        ) : (
          navigate("/404")
        )}
      </div>
      <Recommend />
    </div>
  );
}
