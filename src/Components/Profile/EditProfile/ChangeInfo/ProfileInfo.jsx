// ProfileInfo.js
import { useDispatch } from "react-redux";
import { authActions } from "../../../../Store/Auth";

import useProfileInfo from "./useProfileInfo";
import AlertMessage from "../../../UI/AlertMessage";

import { CheckCircleOutline, CancelOutlined } from "@mui/icons-material";

const ProfileInfo = () => {
  const dispatch = useDispatch();
  const {
    userData,
    error,
    alertMsg,
    loading,
    usernameAvl,
    handleInputChange,
    handleSubmit,
  } = useProfileInfo();

  return (
    <form
      className="bg-white/30 dark:bg-slate-800/40 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 shadow-lg rounded-2xl px-8 pt-6 pb-8 mb-4 transition-all duration-300"
      onSubmit={(e) => handleSubmit(e, dispatch, authActions)}
    >
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-100">Profile Info</h2>
      </div>
      <AlertMessage error={error} alertMsg={alertMsg} />
      <div className="mb-4">
        <label
          htmlFor="username"
          className="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-2"
        >
          Username
        </label>
        <input
          autoComplete="off"
          type="text"
          id="username"
          name="username"
          value={userData.username}
          onChange={handleInputChange}
          className="shadow-sm appearance-none border border-slate-300 dark:border-slate-600 rounded-xl w-1/2 py-2 px-3 text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/50 leading-tight focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
          placeholder="Username"
        />
        {!loading && userData.username.length > 0 && (
          <div
            className={`${usernameAvl ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              } inline ml-2`}
          >
            {usernameAvl ? <CheckCircleOutline /> : <CancelOutlined />}
          </div>
        )}
      </div>
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-2"
        >
          Name
        </label>
        <input
          autoComplete="off"
          type="text"
          id="name"
          name="name"
          value={userData.name}
          onChange={handleInputChange}
          className="shadow-sm appearance-none border border-slate-300 dark:border-slate-600 rounded-xl w-1/2 py-2 px-3 text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/50 leading-tight focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
          placeholder="Name"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="age"
          className="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-2"
        >
          Age
        </label>
        <input

          type="number"
          id="age"
          name="age"
          value={userData.age}
          onChange={handleInputChange}
          className="shadow-sm appearance-none border border-slate-300 dark:border-slate-600 rounded-xl w-1/2 py-2 px-3 text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/50 leading-tight focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
          placeholder="Age"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="bio"
          className="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-2"
        >
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={2}
          value={userData.bio}
          onChange={handleInputChange}
          className="shadow-sm appearance-none border border-slate-300 dark:border-slate-600 rounded-xl w-1/2 maxh-2 py-2 px-3 text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/50 leading-tight focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
          placeholder="Write something about yourself"
        />
        <span className="text-slate-400 dark:text-slate-500 ml-2 text-sm">
          {userData.bio.length}/150
        </span>
      </div>
      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-2"
        >
          Email
        </label>
        <input
          autoComplete="off"
          type="email"
          id="email"
          name="email"
          value={userData.email}
          onChange={handleInputChange}
          className="shadow-sm appearance-none border border-slate-300 dark:border-slate-600 rounded-xl w-1/2 py-2 px-3 text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/50 leading-tight focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
          placeholder="Email"
        />
      </div>
      <button
        disabled={loading}
        className="bg-accent hover:bg-accent-dark disabled:opacity-50 text-white font-bold py-2 px-6 rounded-xl shadow-lg shadow-accent/20 hover:shadow-accent/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transform transition-all active:scale-95"
        type="submit"
      >
        Save
      </button>
    </form>
  );
};

export default ProfileInfo;
