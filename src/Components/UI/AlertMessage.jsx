// AlertMessage.js
import PropTypes from "prop-types";
import Alert from "@mui/material/Alert";

const AlertMessage = ({ error, alertMsg }) => {
  if (!alertMsg) return null;
  return (
    <Alert severity={error ? "error" : "success"} className="mb-4">
      {alertMsg}
    </Alert>
  );
};

export default AlertMessage;

AlertMessage.propTypes = {
    error: PropTypes.bool,
    alertMsg: PropTypes.string,
    };
