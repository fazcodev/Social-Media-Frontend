import React from "react";

export default function Notifications({ active }) {
  return (
    <div
      className={`absolute top-0 left-0 z-20 w-1/4 mtiny:2/5 bg-stone-50 rounded-lg overflow-hidden h-full border border-stone-200 ${
        active !== "Notifications"
          ? "-translate-x-20 invisible opacity-0"
          : "visible translate-x-12 opacity-100"
      } transition-all duration-500`}
    ></div>
  );
}
