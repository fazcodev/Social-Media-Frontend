import { useState, useEffect } from "react";
import ProfilePosts from "./Posts/ProfilePosts";
import ProfileDesc from "./ProfileDesc";
import axios from "axios";
import { useParams } from "react-router-dom";
import { apiUrl } from "../../config";

export default function Profile() {

  const { username } = useParams();

  return (
    <div className="flex-1 overflow-y-scroll p-2">
      <ProfileDesc/>
      <div
        style={{ height: "1.7px" }}
        className="w-full bg-stone-300 overflow-hidden my-2"
      ></div>
      <ProfilePosts username = {username}/>
    </div>
  );
}
