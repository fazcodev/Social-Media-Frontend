import React, { useState, useRef, useEffect } from "react";
import Slider from "@mui/material/Slider";

const Adjustments = ({imageRef }) => {
  const computedStyle = window.getComputedStyle(imageRef.current);
  const filter = computedStyle.getPropertyValue('filter')
  const brightnessMatch = filter.match(/brightness\(([\d.]+)\)/);
  const contrastMatch = filter.match(/contrast\(([\d.]+)\)/);
  const saturationMatch = filter.match(/saturate\(([\d.]+)\)/);
  const sepiaMatch = filter.match(/sepia\(([\d.]+)\)/);
  const hueRotateMatch = filter.match(/hue-rotate\(([\d.]+)deg\)/)
  const [brightness, setBrightness] = useState(brightnessMatch?parseFloat(brightnessMatch[1], 10):1);
  const [contrast, setContrast] = useState(contrastMatch?parseFloat(contrastMatch[1], 10):1);
  const [sepia, setSepia] = useState(sepiaMatch?parseFloat(sepiaMatch[1], 10):0)
  const [opacity, setOpacity] = useState(100);
  const [saturation, setSaturation] = useState(saturationMatch?parseFloat(saturationMatch[1], 10):1);
  const [temperature, setTemperature] = useState(hueRotateMatch?parseFloat(hueRotateMatch[1], 10):0);

  
  const updateImageStyles = () => {
    if (imageRef.current) {
      imageRef.current.style.filter = `brightness(${brightness}) contrast(${contrast}) saturate(${saturation}) sepia(${sepia}) hue-rotate(${temperature}deg)`;
      
      imageRef.current.style.opacity = opacity / 100;
    }
  };

  useEffect(() => {
    updateImageStyles();
  }, [brightness, contrast, opacity, saturation, temperature]);

  const handleBrightnessChange = (value) => {
    setBrightness(value);
  };

  const handleContrastChange = (value) => {
    setContrast(value);
  };

  const handleOpacityChange = (value) => {
    setOpacity(value);
  };

  const handleSaturationChange = (value) => {
    setSaturation(value);
  };

  const handleTemperatureChange = (value) => {
    setTemperature(value);
  };



  return (
    <div className="p-3 mx-auto">
      <div className="slider py-5">
        <label>Brightness</label>
        <Slider
          sx={{ color: "gray" }}
          value={brightness}
          min={0}
          max={10}
          step={0.1}
          size="small"
          onChange={(e, value)=>handleBrightnessChange(value)}
        />
      </div>
      <div className="slider py-5">
        <label>Contrast</label>
        <Slider
          sx={{ color: "gray" }}
          min={0}
          max={10}
          step={0.1}
          size="small"
          value={contrast}
          onChange={(e, value)=>handleContrastChange(value)}
        />
      </div>
      <div className="slider py-5">
        <label>Opacity</label>
        <Slider
          sx={{ color: "gray" }}
          min={0}
          max={100}
          step={2}
          size="small"
          value={opacity}
          onChange={(e, value)=>handleOpacityChange(value)}
        />
      </div>
      <div className="slider py-5">
        <label>Saturation</label>
        <Slider
          sx={{ color: "gray" }}
          min={0}
          max={10}
          step={0.1}
          size="small"
          value={saturation}
          onChange={(e, value)=>handleSaturationChange(value)}
        />
      </div>
      <div className="slider py-5">
        <label>Temperature</label>
        <Slider
          sx={{ color: "gray" }}
          min={-100}
          max={100}
          step={1}
          size="small"
          value={temperature}
          onChange={(e, value)=>handleTemperatureChange(value)}
        />
      </div>
    </div>
  );
};

export default Adjustments;
