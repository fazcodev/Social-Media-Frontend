import React from "react";
import { useDispatch } from "react-redux";
import {
  captionActions,
  editModeActions,
  cropModeActions,
} from "../../Store/ImageEditor";

export default function Backdrop(props) {
  const dispatch = useDispatch();

  const closeModalHandler = () => {
    props.openModalHandler(null);
    if (props.title == "Create Post") {
      dispatch(captionActions.setCaption(""));
      dispatch(editModeActions.setEditedImage(null));
      dispatch(cropModeActions.setCroppedImage(null));
      dispatch(cropModeActions.setCroppedPixels(null));
      dispatch(cropModeActions.setRotation(0));
    }
  };
  return (
    <div
      onClick={closeModalHandler}
      className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 z-50"
    />
  );
}
