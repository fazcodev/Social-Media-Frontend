import { useContext } from "react";
import PropTypes from "prop-types";
import { ContainerContext } from "../Context/container-context";

import useButtons from "./MenuButtons";
import { useSelector } from "react-redux";

const ContainerMenu = ({ menu, title, editModeRef }) => {

  const { menuIdx } = useContext(ContainerContext);
  const editedImage = useSelector((state) => state.editMode.editedImage);
  const { editButton, uploadButton, shareButton, backButton } = useButtons(menu, title);

  return (
    <div
      className="rounded-t-2xl border-b border-white/20 dark:border-slate-700/50 p-4 flex justify-between items-center bg-white/50 dark:bg-slate-800/50 backdrop-blur-md relative z-50"
    >
      <div className="w-16 text-left">
        {"buttons" in menu[menuIdx] && menu[menuIdx].buttons[0] == "Back" && (
          <button
            onClick={backButton}
            className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-4 py-1.5 rounded-xl text-sm font-bold transition-all transform hover:scale-105 shadow-sm"
          >
            Back
          </button>
        )}
      </div>

      <div className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
        {menu[menuIdx].title}
      </div>

      <div className="w-16 text-right">
        <ul className="list-none inline">
          {"buttons" in menu[menuIdx] &&
            menu[menuIdx].buttons.map((value, idx) => {
              return (
                value != "Back" && (
                  <li key={`button_${idx}`} className="inline">
                    <button
                      className="bg-accent hover:bg-accent-dark text-white px-4 py-1.5 rounded-xl text-sm font-bold shadow-lg shadow-accent/20 transition-all transform hover:scale-105"
                      onClick={
                        value == "Edit"
                          ? editButton
                          : (value == "Next" || value == "Upload Avatar")
                            ? () => uploadButton(editModeRef)
                            : () => shareButton(editedImage)
                      }
                    >
                      {value}
                    </button>
                  </li>
                )
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
  editModeRef: PropTypes.any.isRequired
};
