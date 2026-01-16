import { useSelector } from "react-redux";
import CommentSection from "../UI/PostCard/Comment/CommentSection";
import defaultAvatar from "../Assets/Default_Avatar.png";

const UploadMode = () => {
  const editedImage = useSelector((state) => state.editMode.editedImage);
  const { username, avatarURL } = useSelector((state) => state.auth);

  return (
    <div className="h-[27rem] flex">
      <div className="img-wrapper p-0.5 w-3/5 overflow-y-scroll flex flex-col justify-center">
        <img
          alt="Image to upload"
          className="w-full bg-cover bg-center"
          src={editedImage}
        />
      </div>
      <div className="p-2 w-2/5 border-l border-[#bfbfbf] text-left overflow-y-auto overflow-x-hidden">
        <div className="flex items-center gap-2 mb-4">
          <img
            alt="User Avatar"
            className="inline-block rounded-full h-12 w-12 p-0.5 ring-2 ring-slate-200"
            src={avatarURL || defaultAvatar}
          />
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {username}
          </span>
        </div>
        <CommentSection class="mt-5 h-1/2" />
      </div>
    </div>
  );
};

export default UploadMode;
