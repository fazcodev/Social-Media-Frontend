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
      style={{ borderColor: "#bfbfbf" }}
      className="rounded-t-lg border-b p-0.5 flex justify-center"
    >
      {"buttons" in menu[menuIdx] && menu[menuIdx].buttons[0] == "Back" && (
        <button onClick={backButton}>Back</button>
      )}
      <div className="w-1/2 text-xl inline-block">{menu[menuIdx].title}</div>
      <ul className="list-none inline text-right">
        {"buttons" in menu[menuIdx] &&
          menu[menuIdx].buttons.map((value, idx) => {
            return (
              value != "Back" && (
                <li key={`button_${idx}`} className="inline">
                  <button
                    className="bg-blue-400 px-2 py-0.5 rounded-md"
                    onClick={
                      value == "Edit"
                        ? editButton
                        : (value == "Next" || value == "Upload Avatar")
                        ? ()=>uploadButton(editModeRef)
                        : ()=>shareButton(editedImage)
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
  );
};

export default ContainerMenu;

ContainerMenu.propTypes = {
  menu: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  editModeRef: PropTypes.any.isRequired
};
