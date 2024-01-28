import React, { useState } from "react";
import Alert from "@mui/material/Alert";
import axios from "axios";
import { BASE_URL } from "../Helpers/sendRequest";

export default function ChangePassword() {
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
    event.preventDefault();
    const target = event.target;
    setUserData((prevData) => ({
      ...prevData,
      [target.name]: target.value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlertMsg(null);

    // Verify that the passwords match
    if (userData.newPassword !== userData.retypeNewPassword) {
      setError(true);
      setAlertMsg("Passwords must match");
      return;
    }
    setLoading(true);
    await axios
      .patch(
        `${BASE_URL}/users/me/change-password`,
        {
          oldPassword: userData.oldPassword,
          newPassword: userData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        setError(false);
        setAlertMsg("Password changed successfully");
        setUserData({
          oldPassword: "",
          newPassword: "",
          retypeNewPassword: "",
        });
      })
      .catch((err) => {
        console.log(err);
        setError(true);
        setAlertMsg(err.response.data.error);
      });
    setLoading(false);
  };
  return (
    <form
      className="bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-lg px-8 pt-6 pb-8 mb-4"
      onSubmit={handleSubmit}
    >
      <div className="mb-4">
        <h2 className="text-lg font-bold mb-2">Change Password</h2>
      </div>
      {error && alertMsg && (
        <Alert severity="error" className="mb-4">
          {alertMsg}
        </Alert>
      )}
      {!error && alertMsg && (
        <Alert severity="success" className="mb-4">
          {alertMsg}
        </Alert>
      )}
      <input
        type="password"
        id="oldPassword"
        name="oldPassword"
        value={userData.oldPassword}
        onChange={handleInputChange}
        className="shadow appearance-none block border rounded w-1/2 mb-4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        placeholder="Current Password"
      />
      <input
        type="password"
        id="newPassword"
        name="newPassword"
        value={userData.newPassword}
        onChange={handleInputChange}
        className="shadow appearance-none block border rounded w-1/2 mb-4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        placeholder="New Password"
      />
      <input
        type="password"
        id="retypeNewPassword"
        name="retypeNewPassword"
        value={userData.retypeNewPassword}
        onChange={handleInputChange}
        className="shadow appearance-none block border rounded w-1/2 mb-4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        placeholder="Retype New Password"
      />

      <button
        disabled={loading}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="submit"
      >
        Change Password
      </button>
    </form>
  );
}
