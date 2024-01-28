import Cropper from "react-easy-crop";
import {
  CropFreeOutlined,
  CenterFocusStrongOutlined,
  FlipCameraAndroidOutlined,
  CropSquareOutlined,
  Crop54Outlined,
  Crop32Outlined,
  Crop169Outlined,
  CropPortraitOutlined,
} from "@mui/icons-material";
import { Slider } from "@mui/material";
import { useEffect, useState } from "react";
import {useSelector, useDispatch} from 'react-redux'
import { cropModeActions } from "../../Store/ImageEditor";


const Rotate_Crop_Mode = (props) => {
  const dispatch = useDispatch()
  const cropOptions = useSelector((state)=>state.cropMode)
  const [buttonControls, setButtonControls] = useState([false, false, false])
  const [aspect, setAspect] = useState(props.title == 'Edit Avatar' ? 1/1: 4/3);
  const cropButtonClass = 'px-2 py-1 transition-all hover:opacity-80 bg-black'
  useEffect(()=>{
    dispatch(cropModeActions.setCrop({x:0, y:0}))
    dispatch(cropModeActions.setRotation(0))
    dispatch(cropModeActions.setZoom(1.5))
  }, [])
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
  
  return (
    <div className="img-wrapper w-full relative h-[450px] mtiny:h-[350px]">
      <Cropper
        crop={cropOptions.crop}
        image={props.image}
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
          <div className={`${buttonControls[0]?'opacity-100 block':'opacity-0 hidden'} transition-all flex flex-col rounded-lg overflow-hidden mb-2`}>
            <button className={`${aspect == 1/1? 'opacity-90': 'opacity-60'} ${cropButtonClass}`} onClick={()=>setAspect(1/1)}>
              <CropSquareOutlined/>
              <span>1:1</span>
            </button>
            <button className={`${aspect == 4/3? 'opacity-90': 'opacity-60'} ${cropButtonClass}`} onClick={()=>setAspect(4/3)}>
              <Crop54Outlined/>
              <span>4:3</span>
            </button>
            <button className={`${aspect == 3/2? 'opacity-90': 'opacity-60'} ${cropButtonClass}`} onClick={()=>setAspect(3/2)}>
              <Crop32Outlined/>
              <span>3:2</span>
            </button>
            <button className={`${aspect == 16/9? 'opacity-90': 'opacity-60'} ${cropButtonClass}`} onClick={()=>setAspect(16/9)}>
              <Crop169Outlined/>
              <span>16:9</span>
            </button>
            <button className={`${aspect == 9/16? 'opacity-90': 'opacity-60'} ${cropButtonClass}`} onClick={()=>setAspect(9/16)}>
              <CropPortraitOutlined/>
              <span>9:16</span>
            </button>
          </div>
          <CropFreeOutlined
            onClick = {()=>setButtonControls((prevControls)=>[!prevControls[0], false, false])}
            fontSize="large"
            className="bg-black opacity-60 hover:opacity-80 cursor-pointer p-2 rounded-full"
          />
        </div>}
        <div className="w-1/5">

          <Slider
            sx = {{color: 'white'}}
            className = {`${buttonControls[1]?'hover:opacity-100 opacity-60':'opacity-0'} text-white transition-all`}
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
            sx = {{color: 'white', opacity: `${buttonControls[2]?'60%':'0'}`}}
            className = {`${buttonControls[2]?'hover:opacity-100':''} transition-all`}
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

