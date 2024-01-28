//warning card component
import ReactDOM from "react-dom";
import Backdrop from "./Backdrop";
import { Warning } from "@mui/icons-material";
import { Button } from "@mui/material";
import PropTypes from "prop-types";
export default function WarningCard(props) {
  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop {...props} />,
        document.getElementById("backdrop-root")
      )}
      {ReactDOM.createPortal(
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-md shadow-2xl z-[55] flex flex-col items-center p-5">
          <Warning className="text-9xl text-red-500" />
          <h1 className="text-xl text-center">{props.message}</h1>
          <div className="flex gap-5 mt-5">
            <Button
              className="mt-5"
              variant="contained"
              color="error"
              onClick={props.onConfirm}
            >
              {props.confirmText}
            </Button>

            <Button
              className="mt-5"
              variant="contained"
              color="primary"
              onClick={props.onCancel}
            >
              Cancel
            </Button>
          </div>
        </div>,
        document.getElementById("overlay-root")
      )}
    </>
  );
}

WarningCard.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  openModalHandler: PropTypes.func.isRequired,
};
