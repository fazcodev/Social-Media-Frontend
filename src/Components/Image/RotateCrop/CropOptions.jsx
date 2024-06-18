import PropTypes from "prop-types";
import {
  CropSquareOutlined,
  Crop54Outlined,
  Crop32Outlined,
  Crop169Outlined,
  CropPortraitOutlined,
} from "@mui/icons-material";

const CropOptions = ({ aspect, setAspect, buttonControls }) => {
  return (
    <div
      className={`${
        buttonControls[0] ? "opacity-100 block" : "opacity-0 hidden"
      } transition-all flex flex-col rounded-lg overflow-hidden mb-2 *:px-2 *:py-1 *:transition-all *:hover:opacity-80 *:bg-black`}
    >
      <button
        className={`${aspect == 1 / 1 ? "opacity-90" : "opacity-60"}`}
        onClick={() => setAspect(1 / 1)}
      >
        <CropSquareOutlined />
        <span>1:1</span>
      </button>
      <button
        className={`${aspect == 4 / 3 ? "opacity-90" : "opacity-60"}`}
        onClick={() => setAspect(4 / 3)}
      >
        <Crop54Outlined />
        <span>4:3</span>
      </button>
      <button
        className={`${aspect == 3 / 2 ? "opacity-90" : "opacity-60"}`}
        onClick={() => setAspect(3 / 2)}
      >
        <Crop32Outlined />
        <span>3:2</span>
      </button>
      <button
        className={`${aspect == 16 / 9 ? "opacity-90" : "opacity-60"}`}
        onClick={() => setAspect(16 / 9)}
      >
        <Crop169Outlined />
        <span>16:9</span>
      </button>
      <button
        className={`${aspect == 9 / 16 ? "opacity-90" : "opacity-60"}`}
        onClick={() => setAspect(9 / 16)}
      >
        <CropPortraitOutlined />
        <span>9:16</span>
      </button>
    </div>
  );
};


export default CropOptions

CropOptions.propTypes = {
    aspect: PropTypes.number.isRequired,
    setAspect: PropTypes.func.isRequired,
    buttonControls: PropTypes.array.isRequired
}
