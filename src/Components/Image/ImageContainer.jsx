import { useEffect, useRef, useContext } from "react";
import PropTypes from 'prop-types'

import { cropModeActions } from "../../Store/ImageEditor";
import { useDispatch} from "react-redux";
import { ContainerContext } from "./Context/container-context";

import Rotate_Crop_Mode from "./RotateCrop/Rotate_Crop_Mode";
import EditMode from "./EditMode/EditMode";
import UploadMode from "./UploadMode";
import ContainerMenu from "./Container/ContainerMenu";

import { CircularProgress, Alert } from "@mui/material";
import { AddPhotoAlternateOutlined } from "@mui/icons-material";

import "./ImageContainer.css";



const ImageContainer = (props) => {

  const {menuIdx, isImageUploaded, uploadingPost, setMenuIdx, setIsImageUploaded} = useContext(ContainerContext);
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
  

  const onFileUpload = (e) => {
    if (e.target.files[0]) {
      // setImage(URL.createObjectURL(e.target.files[0]));
      // console.log(URL.createObjectURL(e.target.files[0]));
      dispatch(cropModeActions.setCroppedImage(URL.createObjectURL(e.target.files[0])));
      // console.log(cropMode.croppedImage)
      setIsImageUploaded(true);
    }
    else{
      dispatch(cropModeActions.setCroppedImage(null));
      setIsImageUploaded(false);
    }
  };

  useEffect(() => {
    if (isImageUploaded) setMenuIdx((idx) => idx + 1);
  }, [isImageUploaded, setMenuIdx]);

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
          <ContainerMenu menu = {menu} title = {props.title} editModeRef = {editModeRef}/>
          {isImageUploaded &&
            ((menu[menuIdx].title == "Crop" && (
              <Rotate_Crop_Mode title={props.title} />
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


ImageContainer.propTypes = {
  title: PropTypes.string.isRequired,
}