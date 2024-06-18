// ChangePassword.js

import useChangePassword from "./useChangePassword";
import AlertMessage from "../../../UI/AlertMessage";

const ChangePassword = () => {
  const {
    alertMsg,
    error,
    userData,
    loading,
    handleInputChange,
    handleSubmit,
  } = useChangePassword();

  return (
    <form
      className="bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-lg px-8 pt-6 pb-8 mb-4"
      onSubmit={handleSubmit}
    >
      <div className="mb-4">
        <h2 className="text-lg font-bold mb-2">Change Password</h2>
      </div>
      <AlertMessage error={error} alertMsg={alertMsg} />
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
};

export default ChangePassword;
