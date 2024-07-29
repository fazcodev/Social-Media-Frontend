import { useEffect, useState } from "react";
import {useSelector, useDispatch} from 'react-redux'
import PropTypes from "prop-types";
import Cropper from "react-easy-crop";
import { cropModeActions } from "../../../Store/ImageEditor";

import CropOptions from "./CropOptions";

import {
  CropFreeOutlined,
  CenterFocusStrongOutlined,
  FlipCameraAndroidOutlined,
} from "@mui/icons-material";
import { Slider } from "@mui/material";


const Rotate_Crop_Mode = (props) => {
  const dispatch = useDispatch()
  const cropOptions = useSelector((state)=>state.cropMode)
  const [buttonControls, setButtonControls] = useState([false, false, false])
  const [aspect, setAspect] = useState(props.title == 'Edit Avatar' ? 1/1: 4/3);

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    dispatch(cropModeActions.setCroppedPixels(croppedAreaPixels))
  }
  const setCrop = (crop)=>{
    dispatch(cropModeActions.setCrop(crop))
  }
  const setRotation = (rotate)=>{
    dispatch(cropModeActions.setRotation(rotate))
  }
  const setZoom = (zoom)=>{
    dispatch(cropModeActions.setZoom(zoom))
  }
  
  useEffect(()=>{
    dispatch(cropModeActions.setCrop({x:0, y:0}))
    dispatch(cropModeActions.setRotation(0))
    dispatch(cropModeActions.setZoom(1.5))
  }, [])

  return (
    <div className="img-wrapper w-full relative h-[450px] mtiny:h-[350px]">
      <Cropper
        crop={cropOptions.crop}
        image={cropOptions.croppedImage}
        zoom={cropOptions.zoom}
        zoomWithScroll = {false}
        rotation = {cropOptions.rotation}
        cropShape={props.title === 'Edit Avatar' ? 'round': 'rect'}
        aspect={aspect}
        onCropChange={setCrop}
        onCropComplete={onCropComplete}
        onZoomChange={setZoom}
        onRotationChange={setRotation}
      />
      
      <div className="absolute bottom-6 w-full flex justify-evenly items-end text-white">
        {props.title == 'Create Post' && <div className='w-1/5'>
          <CropOptions aspect = {aspect} setAspect = {setAspect} buttonControls={buttonControls}/>
          <CropFreeOutlined
            onClick = {()=>setButtonControls((prevControls)=>[!prevControls[0], false, false])}
            fontSize="large"
            className="bg-black opacity-60 hover:opacity-80 cursor-pointer p-2 rounded-full"
          />
        </div>}

        <div className="w-1/5">

          <Slider
            sx = {{color: 'white'}}
            className = {`${buttonControls[1]?'hover:opacity-100 opacity-60':'opacity-0 invisible'} text-white transition-all duration-[400ms]`}
            value={cropOptions.zoom}
            min={1}
            max={3}
            step={0.05}
            aria-labelledby="Zoom"
            size = 'small'
            onChange={(e, zoom) => setZoom(zoom)}
          />
          <CenterFocusStrongOutlined
            onClick = {()=>setButtonControls((prevControls)=>[false, !prevControls[1], false])}
            fontSize="large"
            className="bg-black opacity-60 hover:opacity-80 p-2 cursor-pointer rounded-full"
          />
        </div>
        <div className="w-1/5">

          <Slider
            sx = {{color: 'white'}}
            className = {`${buttonControls[2]?'hover:opacity-100 opacity-60':'opacity-0 invisible'} transition-all duration-[400ms]`}
            value={cropOptions.rotation}
            min={0}
            max={360}
            step={1}
            aria-labelledby="Rotation"
            size="small"
            onChange={(e, rotation) => setRotation(rotation)}
          />
          <FlipCameraAndroidOutlined
            onClick = {()=>setButtonControls((prevControls)=>[false, false, !prevControls[2]])}
            fontSize="large"
            className="bg-black opacity-60 hover:opacity-80 p-2 cursor-pointer rounded-full"
          />
        </div>
        
      </div>
      
    </div>
  );
};

export default Rotate_Crop_Mode;

Rotate_Crop_Mode.propTypes = {
  title: PropTypes.string.isRequired,
};
