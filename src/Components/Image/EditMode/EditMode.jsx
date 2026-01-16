import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { getFilterString } from "../ImageUtils";
import { editModeActions } from "../../../Store/ImageEditor";

import EditOptions from "./EditOptions.jsx";

const EditMode = ({ title }) => {
  const dispatch = useDispatch();

  const filterClass = useSelector((state) => state.editMode.filterClass);
  const adjustments = useSelector((state) => state.editMode.adjustments);
  const editedImage = useSelector((state) => state.cropMode.croppedImage);

  const filterString = getFilterString(adjustments);

  const handleSetFilterClass = (cls) => {
    dispatch(editModeActions.setFilterClass(cls));
    if (cls) {
      dispatch(
        editModeActions.setAdjustments({
          brightness: 1,
          contrast: 1,
          saturate: 1,
          sepia: 0,
          hueRotate: 0,
          opacity: 1,
        })
      );
    }
  };

  const handleSetAdjustments = (adj) => {
    dispatch(editModeActions.setAdjustments(adj));
    if (filterClass) dispatch(editModeActions.setFilterClass(""));
  };

  return (
    <div style={{ height: "27rem" }} className="flex">
      <div className="img-wrapper p-1 w-3/5 overflow-y-auto flex flex-col justify-center items-center">
        <img
          alt="Image Preview"
          className={`image-preview-node ${filterClass} ${title === "Edit Avatar"
              ? "aspect-square rounded-full w-1/2"
              : "w-full"
            }`}
          src={editedImage}
          style={{
            filter: filterClass ? undefined : filterString,
            opacity: adjustments.opacity,
          }}
        />
      </div>
      <EditOptions
        filterClass={filterClass}
        setFilterClass={handleSetFilterClass}
        adjustments={adjustments}
        setAdjustments={handleSetAdjustments}
      />
    </div>
  );
};

export default EditMode;

EditMode.propTypes = {
  title: PropTypes.string.isRequired,
};
