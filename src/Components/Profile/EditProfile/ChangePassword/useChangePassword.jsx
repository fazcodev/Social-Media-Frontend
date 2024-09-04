// useChangePassword.js

import { useState } from "react";
import axios from "axios";
import { apiUrl } from "../../../../Config/config";

const useChangePassword = () => {
  const [alertMsg, setAlertMsg] = useState(null);
  const [error, setError] = useState(false);
  const [userData, setUserData] = useState({
    oldPassword: "",
    newPassword: "",
    retypeNewPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    if (alertMsg) setAlertMsg(null);
    const { name, value } = event.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlertMsg(null);

    if (userData.newPassword !== userData.retypeNewPassword) {
      setError(true);
      setAlertMsg("Passwords must match");
      return;
    }

    setLoading(true);
    try {
      await axios.patch(
        `${apiUrl}/users/me/change-password`,
        {
          oldPassword: userData.oldPassword,
          newPassword: userData.newPassword,
        },
        { withCredentials: true }
      );
      setError(false);
      setAlertMsg("Password changed successfully");
      setUserData({
        oldPassword: "",
        newPassword: "",
        retypeNewPassword: "",
      });
    } catch (err) {
      setError(true);
      setAlertMsg(err.response?.data?.error || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return {
    alertMsg,
    error,
    userData,
    loading,
    handleInputChange,
    handleSubmit,
  };
};

export default useChangePassword;
