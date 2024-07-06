import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";

import { apiUrl } from "../../config";

import { PhoneAndroid, DevicesOther } from "@mui/icons-material";


const LogoutMenu = ({logoutMenu}) => {

    const [loggingOut, setLoggingOut] = useState(false);
    const navigate = useNavigate();

    
    const logoutHandler = async (type) => {
        setLoggingOut(true);
        try {
          await axios.post(
            `${apiUrl}/users/${type}`,
            {},
            {
              withCredentials: true,
            }
          );
          // localStorage.removeItem("token");
          localStorage.removeItem("username");
          localStorage.removeItem("id")
          localStorage.removeItem("name");
          localStorage.removeItem("email");
          localStorage.removeItem("avatarURL");
          navigate("/signin");
        } catch (err) {
          console.log(err);
        }
        setLoggingOut(false);
      };
    return(
        <div
        className={`flex flex-col absolute bottom-10 z-30 ${
          logoutMenu ? "left-2 opacity-100" : "-left-44 opacity-0"
        } transition-all duration-300 bg-stone-200 rounded-lg p-2 text-xs text-center`}
      >
        <button
          onClick={() => logoutHandler("logout")}
          disabled={loggingOut}
          className={`text-white ${loggingOut ? 'cursor-wait bg-red-300': 'cursor-pointer bg-red-500 hover:bg-red-600'} block px-1 py-0.5 rounded-md mb-3`}
        >
          <PhoneAndroid />
          {`  Logout`}
        </button>
        <button
          onClick={() => logoutHandler("logoutAll")}
          disabled={loggingOut}
          className={`text-white ${loggingOut ? 'cursor-wait bg-red-300': 'cursor-pointer bg-red-500 hover:bg-red-600'} block px-1 py-0.5 rounded-md`}
        >
          <DevicesOther />
          {`  Logout from all Devices`}
        </button>
      </div>
    )
}

export default LogoutMenu;


LogoutMenu.propTypes = {
    logoutMenu: PropTypes.bool.isRequired,
  };