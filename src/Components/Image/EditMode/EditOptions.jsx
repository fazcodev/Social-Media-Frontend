import { useState, useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import FilterList from "./FilterList";
import Adjustments from "./EditAdjustments";

const EditOptions = ({
  filterClass,
  setFilterClass,
  adjustments,
  setAdjustments,
}) => {
  const [option, setOption] = useState("Filters");
  const elementRef = useRef(null);
  const [navInfo, setNavInfo] = useState({ x: 0 });

  const handleOptionSelection = (e) => {
    setOption(e.target.innerText);
    elementRef.current = e.target;
  };

  const computeNavinfo = useCallback(() => {
    if (!elementRef.current) return;
    const rect = elementRef.current.getBoundingClientRect();
    setNavInfo({
      x: elementRef.current.innerText === "Filters" ? 0 : rect.width,
    });
  }, []);

  useEffect(() => {
    window.addEventListener("resize", computeNavinfo);
    if (elementRef.current) computeNavinfo();
    return () => {
      window.removeEventListener("resize", computeNavinfo);
    };
  }, [computeNavinfo]);

  // Initial set for indicator
  useEffect(() => {
    const filtersTab = document.getElementById("Filters");
    if (filtersTab && !elementRef.current) {
      elementRef.current = filtersTab;
      computeNavinfo();
    }
  }, [computeNavinfo]);

  return (
    <div
      style={{ borderColor: "#bfbfbf" }}
      className="w-2/5 border-l overflow-y-scroll overflow-x-hidden"
    >
      <div className="flex *:w-1/2 *:cursor-pointer *:py-3 *:font-semibold text-center">
        <div
          id="Filters"
          onClick={handleOptionSelection}
          className={`${option === "Filters" ? "text-blue-500" : "text-gray-500"}`}
        >
          Filters
        </div>
        <div
          id="Adjustments"
          onClick={handleOptionSelection}
          className={`${option === "Adjustments" ? "text-blue-500" : "text-gray-500"}`}
        >
          Adjustments
        </div>
      </div>
      <div className="h-0.5 bg-gray-200 w-full relative">
        <div
          style={{
            width: "50%",
            transform: `translateX(${navInfo.x}px)`,
          }}
          className="absolute h-full bg-blue-500 transition-transform duration-300 ease-in-out top-0 left-0"
        />
      </div>
      {option === "Filters" && (
        <div className="grid grid-cols-3 gap-4 mt-2 p-3">
          <FilterList
            filterClass={filterClass}
            setFilterClass={setFilterClass}
          />
        </div>
      )}
      {option === "Adjustments" && (
        <Adjustments
          adjustments={adjustments}
          setAdjustments={setAdjustments}
        />
      )}
    </div>
  );
};

export default EditOptions;

EditOptions.propTypes = {
  filterClass: PropTypes.string.isRequired,
  setFilterClass: PropTypes.func.isRequired,
  adjustments: PropTypes.object.isRequired,
  setAdjustments: PropTypes.func.isRequired,
};
