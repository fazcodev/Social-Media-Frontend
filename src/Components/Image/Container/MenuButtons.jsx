import { useContext } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { ContainerContext } from "../Context/container-context";
import { useQueryClient } from "@tanstack/react-query";

import { cropModeActions } from "../../../Store/ImageEditor";
import { editModeActions } from "../../../Store/ImageEditor";
import { captionActions } from "../../../Store/ImageEditor";
import { authActions } from "../../../Store/Auth";

import { createImageBlob, getCroppedImg, applyFilter } from "../ImageUtils";
import { apiUrl } from "../../../Config/config";

const useButtons = (menu, title) => {
  const { caption } = useSelector((state) => state.caption);
  const cropMode = useSelector((state) => state.cropMode);
  const containerCtx = useContext(ContainerContext);
  const editedImage = useSelector((state) => state.editMode.editedImage);
  const queryClient = useQueryClient();

  const dispatch = useDispatch();

  const token = localStorage.getItem("token");

  const editButton = async () => {
    try {
      const croppedImage = await getCroppedImg(
        cropMode.croppedImage,
        cropMode.croppedPixels,
        cropMode.rotation
      );
      // console.log('donee', { croppedImage })
      dispatch(cropModeActions.setCroppedImage(croppedImage));
      containerCtx.setMenuIdx((menuIdx) => menuIdx + 1);
    } catch (e) {
      console.error(e);
    }
  };

  const uploadButton = async (editModeRef) => {
    const editedImgURL = await applyFilter(editModeRef.current.imgRef);
    dispatch(editModeActions.setEditedImage(editedImgURL));
    if (title == "Edit Avatar") {
      shareButton(editedImgURL);
      return;
    }
    containerCtx.setMenuIdx((menuIdx) => menuIdx + 1);
  };

  const shareButton = async () => {
    containerCtx.setUploadingPost(1);
    const formData = new FormData();
    // props.openModalHandler(false);
    const newImageBlob = await createImageBlob(editedImage);
    formData.append("description", caption);
    formData.append("image", newImageBlob, "image.jpeg");
    // console.log('hello')
    try {
      const res = await axios.post(
        `${
          title != "Create Post"
            ? `${apiUrl}/users/me/avatar`
            : `${apiUrl}/posts`
        }`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      queryClient.invalidateQueries({
        predicate: (query) => {
          return (
            query.queryKey[0] === "profile" &&
            ['posted', 'info'].includes(query.queryKey[2].type) &&
            query.queryKey.includes(localStorage.getItem("username"))
          );
        },
      });
      containerCtx.setUploadingPost(2);
      dispatch(captionActions.setCaption(""));
      if (title == "Edit Avatar") {
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
      containerCtx.setUploadingPost(3);
      console.log(e);
    }
  };

  const backButton = () => {
    if (menu[containerCtx.menuIdx].title == "Crop") {
      containerCtx.setIsImageUploaded(false);
    }
    containerCtx.setMenuIdx((menuIdx) => menuIdx - 1);
  };

  return {
    editButton,
    uploadButton,
    shareButton,
    backButton,
  };
};

export default useButtons;
