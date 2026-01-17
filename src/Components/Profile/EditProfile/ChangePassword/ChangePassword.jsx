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
      className="bg-white/30 dark:bg-slate-800/40 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 shadow-lg rounded-2xl px-8 pt-6 pb-8 mb-4 transition-all duration-300"
      onSubmit={handleSubmit}
    >
      <div className="mb-4">
        <h2 className="text-lg font-bold mb-2 text-slate-800 dark:text-slate-100">Change Password</h2>
      </div>
      <AlertMessage error={error} alertMsg={alertMsg} />
      <input
        type="password"
        id="oldPassword"
        name="oldPassword"
        value={userData.oldPassword}
        onChange={handleInputChange}
        className="shadow-sm appearance-none block border border-slate-300 dark:border-slate-600 rounded-xl w-1/2 mb-4 py-2 px-3 text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/50 leading-tight focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
        placeholder="Current Password"
      />
      <input
        type="password"
        id="newPassword"
        name="newPassword"
        value={userData.newPassword}
        onChange={handleInputChange}
        className="shadow-sm appearance-none block border border-slate-300 dark:border-slate-600 rounded-xl w-1/2 mb-4 py-2 px-3 text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/50 leading-tight focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
        placeholder="New Password"
      />
      <input
        type="password"
        id="retypeNewPassword"
        name="retypeNewPassword"
        value={userData.retypeNewPassword}
        onChange={handleInputChange}
        className="shadow-sm appearance-none block border border-slate-300 dark:border-slate-600 rounded-xl w-1/2 mb-4 py-2 px-3 text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/50 leading-tight focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
        placeholder="Retype New Password"
      />
      <button
        disabled={loading}
        className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-bold py-2 px-6 rounded-xl shadow-lg shadow-red-500/20 hover:shadow-red-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transform transition-all active:scale-95"
        type="submit"
      >
        Change Password
      </button>
    </form>
  );
};

export default ChangePassword;
