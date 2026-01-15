import { useEffect, useRef, useContext, useState } from "react";
import PropTypes from "prop-types";

import { cropModeActions } from "../../Store/ImageEditor";
import { useDispatch } from "react-redux";
import { ContainerContext } from "./Context/container-context";

import Rotate_Crop_Mode from "./RotateCrop/Rotate_Crop_Mode";
import EditMode from "./EditMode/EditMode";
import UploadMode from "./UploadMode";
import ContainerMenu from "./Container/ContainerMenu";

import { CircularProgress, Alert } from "@mui/material";
import { AddPhotoAlternateOutlined } from "@mui/icons-material";

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
      title: "Crop",
      buttons: ["Back", "Edit"],
    },
    {
      title: "Edit",
      buttons: [
        "Back",
        props.title == "Edit Avatar" ? "Upload Avatar" : "Next",
      ],
    },
    {
      title: "Upload Post",
      buttons: ["Back", "Share"],
    },
  ];

  // const [menuIdx, setMenuIdx] = useState(0);
  const editModeRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const onFileUpload = (e) => {
    if (e.target.files[0]) {
      // setImage(URL.createObjectURL(e.target.files[0]));
      // console.log(URL.createObjectURL(e.target.files[0]));
      dispatch(
        cropModeActions.setCroppedImage(URL.createObjectURL(e.target.files[0]))
      );
      // console.log(cropMode.croppedImage)
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
        cropModeActions.setCroppedImage(URL.createObjectURL(e.dataTransfer.files[0]))
      );
      setIsImageUploaded(true);
    }
  };

  useEffect(() => {
    if (isImageUploaded) setMenuIdx((idx) => idx + 1);
  }, [isImageUploaded, setMenuIdx]);

  return (
    <div
      className={`${menu[menuIdx].title == "Crop" ||
        menu[menuIdx].title == "Create Post" ||
        menu[menuIdx].title == "Edit Avatar"
        ? "w-2/5 mmd:w-3/5 mtiny:w-4/5"
        : "w-3/5 mmd:w-4/5 mtiny:w-11/12"
        } mtiny:h-1/2 min-h-[27rem] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 dark:bg-slate-900/95 border-2 border-white/50 dark:border-slate-700 overflow-hidden z-50 rounded-2xl text-center transition-[width] duration-1000 ease-in-out shadow-2xl backdrop-blur-2xl`}
    >
      {uploadingPost != 0 ? (
        uploadingPost == 1 ? (
          <CircularProgress
            fontSize="large"
            className="scale-150 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent"
          />
        ) : //display a success message using material ui
          uploadingPost == 2 ? (
            <Alert
              sx={{ fontSize: "20px" }}
              className="w-3/4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              severity="success"
            >
              {props.title == "Edit Avatar" ? "Avatar Updated Successfully" : "Post Uploaded Successfully"}
            </Alert>
          ) : (
            <Alert
              sx={{ fontSize: "20px" }}
              className="w-3/4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              severity="error"
            >
              {props.title == "Edit Avatar" ? "Failed Updating Avatar" : "Failed Uploading Post"}
            </Alert>
          )
      ) : (
        <>
          <ContainerMenu
            menu={menu}
            title={props.title}
            editModeRef={editModeRef}
          />
          {isImageUploaded &&
            ((menu[menuIdx].title == "Crop" && (
              <Rotate_Crop_Mode title={props.title} />
            )) ||
              (menu[menuIdx].title == "Edit" && (
                <EditMode ref={editModeRef} title={props.title} />
              )) ||
              (menu[menuIdx].title == "Upload Post" && <UploadMode />))}
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
              <div className={`text-8xl mb-6 transition-colors transform duration-300 ${isDragging ? "text-accent scale-110" : "text-slate-300 dark:text-slate-600 group-hover:text-accent/50 group-hover:scale-110"
                }`}>
                <AddPhotoAlternateOutlined fontSize="inherit" />
              </div>
              <div className="flex flex-col items-center gap-3">
                <h3 className={`text-lg font-semibold transition-colors ${isDragging ? "text-accent" : "text-slate-600 dark:text-slate-300"}`}>
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
