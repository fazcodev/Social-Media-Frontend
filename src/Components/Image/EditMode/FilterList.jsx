import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import "./InstagramFilters.css";

const FILTERS = [
  { name: "Original", class: "" },
  { name: "Aden", class: "filter-aden" },
  { name: "Amaro", class: "filter-amaro" },
  { name: "Ashby", class: "filter-ashby" },
  { name: "Brannan", class: "filter-brannan" },
  { name: "Brooklyn", class: "filter-brooklyn" },
  { name: "Charmes", class: "filter-charmes" },
  { name: "Clarendon", class: "filter-clarendon" },
  { name: "Crema", class: "filter-crema" },
  { name: "Dogpatch", class: "filter-dogpatch" },
  { name: "Earlybird", class: "filter-earlybird" },
  { name: "Gingham", class: "filter-gingham" },
  { name: "Ginza", class: "filter-ginza" },
  { name: "Hafe", class: "filter-hafe" },
  { name: "Helena", class: "filter-helena" },
  { name: "Hudson", class: "filter-hudson" }, // Typo in original? Keeping for consistency with CSS
  { name: "Inkwell", class: "filter-inkwell" },
  { name: "Kelvin", class: "filter-kelvin" },
  { name: "Lark", class: "filter-lark" },
  { name: "Lo-fi", class: "filter-lofi" },
  { name: "Ludwig", class: "filter-ludwig" }, // Typo fixed in name, keeping class same
  { name: "Maven", class: "filter-maven" },
  { name: "Mayfair", class: "filter-mayfair" },
  { name: "Moon", class: "filter-moon" },
  { name: "Nashville", class: "filter-nashville" },
  { name: "Perpetua", class: "filter-perpetua" },
  { name: "Poprocket", class: "filter-poprocket" },
  { name: "Reyes", class: "filter-reyes" },
  { name: "Rise", class: "filter-rise" },
  { name: "Sierra", class: "filter-sierra" },
  { name: "Skyline", class: "filter-skyline" },
  { name: "Slumber", class: "filter-slumber" },
  { name: "Stinson", class: "filter-stinson" },
  { name: "Sutro", class: "filter-sutro" },
  { name: "Toaster", class: "filter-toaster" },
  { name: "Valencia", class: "filter-valencia" },
  { name: "Vesper", class: "filter-vesper" },
  { name: "Walden", class: "filter-walden" },
  { name: "Willow", class: "filter-willow" },
  { name: "X-Pro II", class: "filter-xpro-ii" },
];

const FilterList = ({ filterClass, setFilterClass }) => {
  const croppedImage = useSelector((state) => state.cropMode.croppedImage);

  return (
    <>
      {FILTERS.map((filter, index) => {
        const isActive = filterClass === filter.class;
        return (
          <div
            key={index}
            className={`
              cursor-pointer overflow-hidden transition-all duration-200
              ${isActive ? "border-blue-500 border-2 rounded-md text-blue-500 text-sm" : ""}
              hover:border-blue-500 hover:border-2 hover:rounded-md hover:text-sm
            `}
            onClick={() => setFilterClass(filter.class)}
          >
            <div>
              <img
                className={filter.class}
                src={croppedImage}
                alt={filter.name}
              />
            </div>
            <div className="text-center p-1">
              <p className="font-semibold">{filter.name}</p>
            </div>
          </div>
        );
      })}
    </>
  );
};

FilterList.propTypes = {
  filterClass: PropTypes.string.isRequired,
  setFilterClass: PropTypes.func.isRequired,
};

export default FilterList;
