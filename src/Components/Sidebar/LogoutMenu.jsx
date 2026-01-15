import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth"
import { auth } from '../../Config/firebase-config'
import axios from "axios";
import PropTypes from "prop-types";

import { apiUrl } from "../../Config/config";

import { PhoneAndroid, DevicesOther } from "@mui/icons-material";


const LogoutMenu = ({ logoutMenu }) => {

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
      await signOut(auth)
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
  return (
    <div
      className={`flex flex-col fixed bottom-20 z-50 ${logoutMenu ? "left-4 md:left-6 opacity-100 visible" : "-left-60 opacity-0 invisible"
        } transition-all duration-300 bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs text-center w-48`}
    >
      <button
        onClick={() => logoutHandler("logout")}
        disabled={loggingOut}
        className={`text-white ${loggingOut ? 'cursor-wait bg-red-300' : 'cursor-pointer bg-red-500 hover:bg-red-600'} block px-1 py-0.5 rounded-md mb-3`}
      >
        <PhoneAndroid />
        {`  Logout`}
      </button>
      <button
        onClick={() => logoutHandler("logoutAll")}
        disabled={loggingOut}
        className={`text-white ${loggingOut ? 'cursor-wait bg-red-300' : 'cursor-pointer bg-red-500 hover:bg-red-600'} block px-1 py-0.5 rounded-md`}
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