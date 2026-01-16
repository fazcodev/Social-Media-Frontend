import { useContext } from "react";
import PropTypes from "prop-types";
import { ContainerContext } from "../Context/container-context";
import useImageFlow from "../../../Hooks/useImageFlow";
import { useSelector } from "react-redux";
import { MENU_STEPS } from "../ImageConstants";

const ContainerMenu = ({ menu, title }) => {
  const { menuIdx } = useContext(ContainerContext);
  const editedImage = useSelector((state) => state.editMode.editedImage);

  const { handleEditStep, handleUploadStep, handleShare, handleBack } = useImageFlow(
    menu,
    title
  );

  const getClickHandler = (buttonName) => {
    switch (buttonName) {
      case "Back": return handleBack;
      case "Edit": return handleEditStep;
      case "Next":
      case "Upload Avatar":
        return handleUploadStep;
      case "Share":
        return () => handleShare(editedImage);
      default:
        return () => { };
    }
  }

  const currentMenu = menu[menuIdx];

  return (
    <div className="rounded-t-2xl border-b border-white/20 dark:border-slate-700/50 p-4 flex justify-between items-center bg-white/50 dark:bg-slate-800/50 backdrop-blur-md relative z-50">
      <div className="w-16 text-left">
        {currentMenu?.buttons && currentMenu.buttons[0] === "Back" && (
          <button
            onClick={handleBack}
            className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-4 py-1.5 rounded-xl text-sm font-bold transition-all transform hover:scale-105 shadow-sm"
          >
            Back
          </button>
        )}
      </div>

      <div className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
        {currentMenu?.title}
      </div>

      <div className="w-16 text-right">
        <ul className="list-none inline">
          {currentMenu?.buttons &&
            currentMenu.buttons.map((value, idx) => {
              if (value === "Back") return null;
              return (
                <li key={`button_${idx}`} className="inline">
                  <button
                    className="bg-accent hover:bg-accent-dark text-white px-4 py-1.5 rounded-xl text-sm font-bold shadow-lg shadow-accent/20 transition-all transform hover:scale-105"
                    onClick={getClickHandler(value)}
                  >
                    {value}
                  </button>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default ContainerMenu;

ContainerMenu.propTypes = {
  menu: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
};
