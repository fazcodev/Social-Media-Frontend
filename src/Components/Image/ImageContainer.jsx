import React, { useState, useEffect, useRef } from "react";
import { AddPhotoAlternateOutlined } from "@mui/icons-material";
import "./ImageContainer.css";
import getCroppedImg, { createImage } from "./cropImage";
import { cropModeActions, editModeActions } from "../../Store/ImageEditor";
import { captionActions } from "../../Store/ImageEditor";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../Store/Auth";
import Rotate_Crop_Mode from "./Rotate_Crop_Mode";
import EditMode from "./EditMode";
import UploadMode from "./UploadMode";
import axios from "axios";
import { CircularProgress, Alert } from "@mui/material";
import { BASE_URL } from "../Helpers/sendRequest";


const createImageBlob = async (editedImage) => {
  // Apply the selected filter to the image element
  const image = await createImage(editedImage);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  // set canvas size to match the bounding box
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  // As a blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (file) => {
        resolve(file);
      },
      "image/jpeg",
      100
    );
  });
};

const ImageContainer = (props) => {
  const [image, setImage] = useState();
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [uploadingPost, setUploadingPost] = useState(0);

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
  if (props.setProfilePic) {
    menu.pop();
    menu[2].buttons = ["Back", "Upload"];
  }
  const [menuIdx, setMenuIdx] = useState(0);
  const editModeRef = useRef(null);
  const dispatch = useDispatch();

  const { caption } = useSelector((state) => state.caption);
  const { editedImage } = useSelector((state) => state.editMode);
  const token = localStorage.getItem("token");

  const croppedAreaPixels = useSelector(
    (state) => state.cropMode.croppedPixels
  );

  const rotation = useSelector((state) => state.cropMode.rotation);

  const editButton = async () => {
    try {
      const croppedImage = await getCroppedImg(
        image,
        croppedAreaPixels,
        rotation
      );
      // console.log('donee', { croppedImage })
      dispatch(cropModeActions.setCroppedImage(croppedImage));
      dispatch(editModeActions.setEditedImage(croppedImage));
      setMenuIdx((menuIdx) => menuIdx + 1);
    } catch (e) {
      console.error(e);
    }
  };

  const uploadButton = async () => {
    const editedImgURL = await editModeRef.current.applyFilter();
    dispatch(editModeActions.setEditedImage(editedImgURL));
    if (props.title == "Edit Avatar") {
      shareButton(editedImgURL);
      return;
    }
    setMenuIdx((menuIdx) => menuIdx + 1);
  };

  const shareButton = async (imgURL) => {
    setUploadingPost(1);
    const formData = new FormData();
    // props.openModalHandler(false);
    const newImageBlob = await createImageBlob(imgURL);
    formData.append("description", caption);
    formData.append("image", newImageBlob, "image.jpeg");

    try {
      const res = await axios.post(
        `${
          props.title != "Create Post"
            ? `${BASE_URL}/users/me/avatar`
            : `${BASE_URL}/posts`
        }`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + token,
          },
        }
      );
      setUploadingPost(2);
      dispatch(captionActions.setCaption(""));
      if (props.title == "Edit Avatar") {
        localStorage.setItem("avatarURL", res.data.avatarURL);
        // also update the avatarURL in the redux store using dispatch
        dispatch(
          authActions.setAuthData({
            token: token,
            email: res.data.email,
            name: res.data.name,
            username: res.data.username,
            avatarURL: res.data.avatarURL,
          })
        );
      }
    } catch (e) {
      setUploadingPost(3)
      console.log(e);
    }
  };

  const backButton = () => {
    if (menu[menuIdx].title == "Crop") {
      setIsImageUploaded(false);
    }
    setMenuIdx((menuIdx) => menuIdx - 1);
  };

  const onFileUpload = (e) => {
    if (e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
      setIsImageUploaded(true);
    }
  };

  useEffect(() => {
    if (isImageUploaded) setMenuIdx((idx) => idx + 1);
  }, [isImageUploaded]);

  return (
    <div
      className={`${
        menu[menuIdx].title == "Crop" ||
        menu[menuIdx].title == "Create Post" ||
        menu[menuIdx].title == "Edit Avatar"
          ? "w-2/5 mmd:w-3/5 mtiny:w-4/5"
          : "w-3/5 mmd:w-4/5 mtiny:w-11/12"
      } mtiny:h-1/2 min-h-[27rem] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border-stone-100 border-2 overflow-hidden z-50 rounded-xl text-center transition-[width] duration-1000 ease-in-out`}
    >
      {uploadingPost != 0 ? (
        uploadingPost == 1 ? (
          <CircularProgress fontSize='large' className="scale-150 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 " />
        ) : (
          //display a success message using material ui
          uploadingPost == 2 ? <Alert sx = {{fontSize: '20px'}} className="w-3/4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" severity="success">Post Uploaded Successfully</Alert> : <Alert sx = {{fontSize: '20px'}} className="w-3/4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" severity="error">Post Uploading Failed</Alert>
        )
      ) : (
        <>
          {" "}
          <div
            style={{ borderColor: "#bfbfbf" }}
            className="rounded-t-lg border-b p-0.5 flex justify-center"
          >
            {"buttons" in menu[menuIdx] &&
              menu[menuIdx].buttons[0] == "Back" && (
                <button onClick={backButton}>Back</button>
              )}
            <div className="w-1/2 text-xl inline-block">
              {menu[menuIdx].title}
            </div>
            <ul className="list-none inline text-right">
              {"buttons" in menu[menuIdx] &&
                menu[menuIdx].buttons.map((value, idx) => {
                  return (
                    value != "Back" && (
                      <li key={`button_${idx}`} className="inline">
                        <button
                          className="bg-blue-400 px-2 py-0.5 rounded-md"
                          onClick={
                            value == "Edit"
                              ? editButton
                              : value == "Next" || value == "Upload Avatar"
                              ? uploadButton
                              : () => shareButton(editedImage)
                          }
                        >
                          {value}
                        </button>
                      </li>
                    )
                  );
                })}
            </ul>
          </div>
          {isImageUploaded &&
            ((menu[menuIdx].title == "Crop" && (
              <Rotate_Crop_Mode image={image} title={props.title} />
            )) ||
              (menu[menuIdx].title == "Edit" && (
                <EditMode ref={editModeRef} title={props.title} />
              )) ||
              (menu[menuIdx].title == "Upload Post" && <UploadMode />))}
          {!isImageUploaded && (
            <div className="bg-stone-50 h-96 flex flex-col justify-center items-center">
              <div className="text-8xl mb-7">
                <AddPhotoAlternateOutlined fontSize="inherit" />
              </div>
              <div>
                <label className="cursor-pointer px-2 py-2.5 rounded-lg text-white font-bold hover:bg-blue-600 bg-blue-500">
                  Upload Photo
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
