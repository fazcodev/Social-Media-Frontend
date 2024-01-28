import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { createImage } from "./cropImage.jsx";
import { useDispatch, useSelector } from "react-redux";
import FilterList from './FilterList.jsx'
import Adjustments from './EditAdjustments.jsx'

const EditMode = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const [option, setOption] = useState("Filters");
  const menuRef = [useRef(null), useRef(null)]
  const [filterclass, setfilterclass] = useState('');
  const [Navinfo, setNavinfo] = useState({x: 0});
  const editedImage = useSelector((state)=>state.cropMode.croppedImage)
  const imgRef = useRef(null)
  const optionSelector = (e)=>{
    setOption(e.target.innerText)
  }
  useEffect(()=>{
    const computeNavinfo = ()=>{
      const currOptionRef = menuRef.find((ref)=>ref.current.innerText == option)
      const rect = currOptionRef.current.getBoundingClientRect()
      setNavinfo({
          x: currOptionRef.current.innerText == 'Filters' ? 0 : rect.width,
      });
    }
    
    window.addEventListener('resize', computeNavinfo);

  // Call computeNavinfo initially
    computeNavinfo();

    // Cleanup: Remove event listener when component unmounts
    return () => {
      window.removeEventListener('resize', computeNavinfo);
    }
  }, [option])

  const applyFilter = async()=>{
    // Apply the selected filter to the image element
    const image = await createImage(editedImage)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled=true; 
    ctx.imageSmoothingQuality='high';
    // set canvas size to match the bounding box
    canvas.width = image.width
    canvas.height = image.height
    const computedStyle = window.getComputedStyle(imgRef.current);
    const filter = computedStyle.getPropertyValue('filter')
    const opacity = computedStyle.getPropertyValue('opacity')
    ctx.filter = filter
    ctx.opacity = opacity
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

    // As a blob
    return new Promise((resolve, reject) => {
      canvas.toBlob((file) => {
        resolve(URL.createObjectURL(file))
      }, 'image/jpeg', 100)
    })
    
    
  };
  useImperativeHandle(ref, () => ({
    applyFilter
  }))
  
  return (
      <div style = {{height: '27rem'}} className="flex">
        <div className="img-wrapper p-1 w-3/5 overflow-y-auto flex flex-col justify-center items-center"> 
          <img className={`${filterclass} ${props.title == 'Edit Avatar' ? 'aspect-square rounded-full w-1/2': 'w-full'}`} ref = {imgRef} src={editedImage} />
        </div>
        <div style = {{borderColor: '#bfbfbf'}} className="w-2/5 border-l overflow-y-scroll overflow-x-hidden">
          <div className="flex"> 
            <div id = 'Filters' ref = {menuRef[0]} className="w-1/2 cursor-pointer" onClick = {optionSelector}>Filters</div>
            <div id = 'Adjustments' ref = {menuRef[1]} className="w-1/2 cursor-pointer" onClick = {optionSelector}>Adjustments</div>
          </div>
          <div style={{ height: "1.5px", backgroundColor: "#bfbfbf" }}>
            <div
              style={{
                height: "1.5px",
                width: '50%',
                left: `${Navinfo.x}px`,
              }}
              className="relative transition-all bg-blue-500"
            />
          </div>
          {option == "Filters" && <div className="grid grid-cols-3 gap-4 mt-2 p-3">
              <FilterList filterclass = {filterclass} setfilterclass = {setfilterclass} imageRef = {imgRef}/>
          </div>
          }
          {option == "Adjustments" && <Adjustments imageRef = {imgRef}/>}

        </div>
      </div>
  );
})

EditMode.displayName = 'EditMode';
export default EditMode;

