import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import FilterList from "./FilterList";
import Adjustments from "./EditAdjustments";

const EditOptions = ({ filterClass, setFilterClass, imageRef }) => {

  const [option, setOption] = useState("Filters");
  const elementRef = useRef(null)
  const [Navinfo, setNavinfo] = useState({ x: 0 });

  const handleOptionSelection = (e)=>{
    setOption(e.target.innerText)
    elementRef.current = e.target
  }
  const computeNavinfo = useCallback(() => {
    
    const rect = elementRef.current.getBoundingClientRect();
    setNavinfo({
      x: elementRef.current.innerText == "Filters" ? 0 : rect.width,
    });
  }, []);

  useEffect(() => {
    
    window.addEventListener("resize", computeNavinfo);

    // Call computeNavinfo initially
    if(elementRef.current)computeNavinfo();

    // Cleanup: Remove event listener when component unmounts
    return () => {
      window.removeEventListener("resize", computeNavinfo);
    };
  }, [computeNavinfo, elementRef.current]);


  return (
    <div
      style={{ borderColor: "#bfbfbf" }}
      className="w-2/5 border-l overflow-y-scroll overflow-x-hidden"
    >
      <div className="flex *:w-1/2 *:cursor-pointer">
        <div
          id="Filters"
          onClick={handleOptionSelection}
        >
          Filters
        </div>
        <div
          id="Adjustments"
          onClick={handleOptionSelection}
        >
          Adjustments
        </div>
      </div>
      <div style={{ height: "1.5px", backgroundColor: "#bfbfbf" }}>
        <div
          style={{
            height: "1.5px",
            width: "50%",
            left: `${Navinfo.x}px`,
          }}
          className="relative transition-all bg-blue-500"
        />
      </div>
      {option == "Filters" && (
        <div className="grid grid-cols-3 gap-4 mt-2 p-3">
          <FilterList
            filterclass={filterClass}
            setfilterclass={setFilterClass}
            imageRef={imageRef}
          />
        </div>
      )}
      {option == "Adjustments" && <Adjustments imageRef={imageRef} />}
    </div>
  );
};

export default EditOptions;

EditOptions.propTypes = {
  filterClass: PropTypes.string.isRequired,
  setFilterClass: PropTypes.func.isRequired,
  imageRef: PropTypes.object.isRequired,
};
