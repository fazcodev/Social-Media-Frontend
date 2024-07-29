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
      className="bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-lg px-8 pt-6 pb-8 mb-4"
      onSubmit={(e) => handleSubmit(e, dispatch, authActions)}
    >
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Profile Info</h2>
      </div>
      <AlertMessage error={error} alertMsg={alertMsg} />
      <div className="mb-4">
        <label
          htmlFor="username"
          className="block text-gray-700 text-sm font-bold mb-2"
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
          className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Username"
        />
        {!loading && userData.username.length > 0 && (
          <div
            className={`${
              usernameAvl ? "text-green-600" : "text-red-600"
            } inline ml-2`}
          >
            {usernameAvl ? <CheckCircleOutline /> : <CancelOutlined />}
          </div>
        )}
      </div>
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-gray-700 text-sm font-bold mb-2"
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
          className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Name"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="age"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Age
        </label>
        <input
          
          type="number"
          id="age"
          name="age"
          value={userData.age}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Age"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="bio"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={2}
          value={userData.bio}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded-md w-1/2 maxh-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Write something about yourself"
        />
        <span className="text-stone-400 ml-2 text-sm">
          {userData.bio.length}/150
        </span>
      </div>
      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-gray-700 text-sm font-bold mb-2"
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
          className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Email"
        />
      </div>
      <button
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="submit"
      >
        Save
      </button>
    </form>
  );
};

export default ProfileInfo;
