import React, { useState } from "react";
import { useSelector } from "react-redux";
import CommentSection from "../UI/CommentSection";
import defaultAvatar from "../Assets/Default_Avatar.png";

const UploadMode = () => {
  const editedImage = useSelector((state) => state.editMode.editedImage);
  const { username, avatarURL } = useSelector((state) => state.auth);
  return (
    <div style={{ height: "27rem" }} className="flex">
      <div className="img-wrapper p-0.5 w-3/5 overflow-y-scroll flex flex-col justify-center">
        <img className="w-full bg-cover bg-center" src={editedImage} />
      </div>
      <div
        style={{ borderColor: "#bfbfbf" }}
        className="p-2 w-2/5 border-l text-left overflow-y-auto overflow-x-hidden"
      >
        <div className="Avatar ">
          <img
            className="inline-block rounded-full h-12 w-12 p-0.5"
            src={avatarURL ? avatarURL : defaultAvatar}
          ></img>
          <span className="ml-2 font-semibold">{username}</span>
        </div>
        <CommentSection class="mt-5 h-1/2" />
      </div>
    </div>
  );
};

export default UploadMode;
