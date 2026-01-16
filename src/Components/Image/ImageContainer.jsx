import { useEffect, useRef, useContext, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { CircularProgress, Alert } from "@mui/material";
import { AddPhotoAlternateOutlined } from "@mui/icons-material";

import { cropModeActions } from "../../Store/ImageEditor";
import { ContainerContext } from "./Context/container-context";
import Rotate_Crop_Mode from "./RotateCrop/Rotate_Crop_Mode";
import EditMode from "./EditMode/EditMode";
import UploadMode from "./UploadMode";
import ContainerMenu from "./Container/ContainerMenu";
import { MENU_STEPS, UPLOAD_STATUS } from "./ImageConstants";

import "./ImageContainer.css";

const ImageContainer = (props) => {
  const {
    menuIdx,
    isImageUploaded,
    uploadingPost,
    setMenuIdx,
    setIsImageUploaded,
  } = useContext(ContainerContext);
  const dispatch = useDispatch();

  const menu = [
    { title: props.title },
    {
      title: MENU_STEPS.CROP,
      buttons: ["Back", "Edit"],
    },
    {
      title: MENU_STEPS.EDIT,
      buttons: [
        "Back",
        props.title === MENU_STEPS.EDIT_AVATAR ? "Upload Avatar" : "Next",
      ],
    },
    {
      title: MENU_STEPS.UPLOAD_POST,
      buttons: ["Back", "Share"],
    },
  ];

  const [isDragging, setIsDragging] = useState(false);

  const onFileUpload = (e) => {
    if (e.target.files[0]) {
      dispatch(
        cropModeActions.setCroppedImage(URL.createObjectURL(e.target.files[0]))
      );
      setIsImageUploaded(true);
    } else {
      dispatch(cropModeActions.setCroppedImage(null));
      setIsImageUploaded(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    if (e.relatedTarget && e.currentTarget.contains(e.relatedTarget)) {
      return;
    }
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      dispatch(
        cropModeActions.setCroppedImage(
          URL.createObjectURL(e.dataTransfer.files[0])
        )
      );
      setIsImageUploaded(true);
    }
  };

  useEffect(() => {
    if (isImageUploaded) setMenuIdx((idx) => idx + 1);
  }, [isImageUploaded, setMenuIdx]);

  const currentMenuTitle = menu[menuIdx].title;
  const isWide =
    currentMenuTitle === MENU_STEPS.CROP ||
    currentMenuTitle === MENU_STEPS.CREATE_POST ||
    currentMenuTitle === MENU_STEPS.EDIT_AVATAR;

  return (
    <div
      className={`${isWide ? "w-2/5 mmd:w-3/5 mtiny:w-4/5" : "w-3/5 mmd:w-4/5 mtiny:w-11/12"
        } mtiny:h-1/2 min-h-[27rem] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 dark:bg-slate-900/95 border-2 border-white/50 dark:border-slate-700 overflow-hidden z-50 rounded-2xl text-center transition-[width] duration-1000 ease-in-out shadow-2xl backdrop-blur-2xl`}
    >
      {uploadingPost !== UPLOAD_STATUS.IDLE ? (
        uploadingPost === UPLOAD_STATUS.UPLOADING ? (
          <CircularProgress
            fontSize="large"
            className="scale-150 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent"
          />
        ) : uploadingPost === UPLOAD_STATUS.SUCCESS ? (
          <div className="w-3/4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 rounded-2xl bg-green-500/10 dark:bg-green-500/20 border border-green-500/30 backdrop-blur-md text-center flex flex-col items-center gap-2">
            <div className="text-green-600 dark:text-green-400 text-4xl mb-1">
              ✓
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Success!
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              {props.title === MENU_STEPS.EDIT_AVATAR
                ? "Avatar Updated Successfully"
                : "Post Uploaded Successfully"}
            </p>
          </div>
        ) : (
          <div className="w-3/4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 rounded-2xl bg-red-500/10 dark:bg-red-500/20 border border-red-500/30 backdrop-blur-md text-center flex flex-col items-center gap-2">
            <div className="text-red-500 dark:text-red-400 text-4xl mb-1">
              ✕
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Error
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              {props.title === MENU_STEPS.EDIT_AVATAR
                ? "Failed Updating Avatar"
                : "Failed Uploading Post"}
            </p>
          </div>
        )
      ) : (
        <>
          <ContainerMenu
            menu={menu}
            title={props.title}
          />
          {isImageUploaded && (
            <>
              {currentMenuTitle === MENU_STEPS.CROP && (
                <Rotate_Crop_Mode title={props.title} />
              )}
              {currentMenuTitle === MENU_STEPS.EDIT && (
                <EditMode title={props.title} />
              )}
              {currentMenuTitle === MENU_STEPS.UPLOAD_POST && <UploadMode />}
            </>
          )}
          {!isImageUploaded && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`m-4 h-80 flex flex-col justify-center items-center rounded-2xl border-2 border-dashed transition-all group ${isDragging
                ? "border-accent bg-accent/10 scale-95"
                : "border-slate-300 dark:border-slate-700 hover:border-accent dark:hover:border-accent bg-slate-50/30 dark:bg-slate-800/30"
                }`}
            >
              <div
                className={`text-8xl mb-6 transition-colors transform duration-300 ${isDragging
                  ? "text-accent scale-110"
                  : "text-slate-300 dark:text-slate-600 group-hover:text-accent/50 group-hover:scale-110"
                  }`}
              >
                <AddPhotoAlternateOutlined fontSize="inherit" />
              </div>
              <div className="flex flex-col items-center gap-3">
                <h3
                  className={`text-lg font-semibold transition-colors ${isDragging
                    ? "text-accent"
                    : "text-slate-600 dark:text-slate-300"
                    }`}
                >
                  Drag & Drop photos here
                </h3>
                <label className="cursor-pointer px-6 py-3 rounded-xl text-white font-bold hover:bg-accent-dark bg-accent shadow-lg shadow-accent/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 relative z-10">
                  Select from computer
                  <input
                    className="hidden"
                    type="file"
                    onChange={onFileUpload}
                  />
                </label>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ImageContainer;

ImageContainer.propTypes = {
  title: PropTypes.string.isRequired,
};
