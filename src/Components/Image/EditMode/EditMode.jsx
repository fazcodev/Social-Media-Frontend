import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import PropTypes from 'prop-types'
import { useSelector } from "react-redux";

import EditOptions from "./EditOptions.jsx";

const EditMode = forwardRef((props, ref) => {
 
  const [filterclass, setfilterclass] = useState('');
  const editedImage = useSelector((state)=>state.cropMode.croppedImage)
  const imgRef = useRef(null)
  
  
  useImperativeHandle(ref, () => ({
    imgRef
  }))
  
  return (
      <div style = {{height: '27rem'}} className="flex">
        <div className="img-wrapper p-1 w-3/5 overflow-y-auto flex flex-col justify-center items-center"> 
          <img alt = 'Image Preview' className={`${filterclass} ${props.title == 'Edit Avatar' ? 'aspect-square rounded-full w-1/2': 'w-full'}`} ref = {imgRef} src={editedImage} />
        </div>
        <EditOptions filterClass = {filterclass} setFilterClass={setfilterclass} imageRef={imgRef}/>
      </div>
  );
})

EditMode.displayName = 'EditMode';
export default EditMode;

EditMode.propTypes = {
  title: PropTypes.string.isRequired
}
