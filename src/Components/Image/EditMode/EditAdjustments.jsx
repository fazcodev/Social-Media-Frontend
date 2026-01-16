import Slider from "@mui/material/Slider";
import PropTypes from "prop-types";

const Adjustments = ({ adjustments, setAdjustments }) => {
  const { brightness, contrast, saturate, sepia, hueRotate, opacity } = adjustments;

  const handleChange = (key, value) => {
    setAdjustments({ ...adjustments, [key]: value });
  };

  return (
    <div className="p-3 mx-auto">
      <div className="slider py-5">
        <label>Brightness</label>
        <Slider
          sx={{ color: "gray" }}
          value={brightness}
          min={0}
          max={2}
          step={0.1}
          size="small"
          onChange={(e, value) => handleChange("brightness", value)}
        />
      </div>
      <div className="slider py-5">
        <label>Contrast</label>
        <Slider
          sx={{ color: "gray" }}
          min={0}
          max={2}
          step={0.1}
          size="small"
          value={contrast}
          onChange={(e, value) => handleChange("contrast", value)}
        />
      </div>
      <div className="slider py-5">
        <label>Opacity</label>
        <Slider
          sx={{ color: "gray" }}
          min={0}
          max={100}
          step={1}
          size="small"
          value={opacity * 100}
          onChange={(e, value) => handleChange("opacity", value / 100)}
        />
      </div>
      <div className="slider py-5">
        <label>Saturation</label>
        <Slider
          sx={{ color: "gray" }}
          min={0}
          max={2}
          step={0.1}
          size="small"
          value={saturate}
          onChange={(e, value) => handleChange("saturate", value)}
        />
      </div>
      <div className="slider py-5">
        <label>Temperature</label>
        <Slider
          sx={{ color: "gray" }}
          min={-180}
          max={180}
          step={1}
          size="small"
          value={hueRotate}
          onChange={(e, value) => handleChange("hueRotate", value)}
        />
      </div>
    </div>
  );
};

Adjustments.propTypes = {
  adjustments: PropTypes.shape({
    brightness: PropTypes.number,
    contrast: PropTypes.number,
    saturate: PropTypes.number,
    sepia: PropTypes.number,
    hueRotate: PropTypes.number,
    opacity: PropTypes.number,
  }).isRequired,
  setAdjustments: PropTypes.func.isRequired,
};

export default Adjustments;
