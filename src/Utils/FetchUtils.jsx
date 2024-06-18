import axios from "axios";
import { apiUrl } from "../config";




export const fetchUserInfo = async () => {
  try {
    const res = await axios.get(`${apiUrl}/users/me`, {
      withCredentials: true,
    });
    return res.data
  } catch (err) {
    console.log(err);
  }
};



export const fetchFollowings = async (username) => {
  try {
    const res = await axios.get(
      `${apiUrl}/users/${username}/followings`
    );

    return res.data;
  } catch (err) {
    console.log(err);
  }
};


export const fetchFollowers = async (username) => {
  try {
    const res = await axios.get(
      `${apiUrl}/users/${username}/followers`
    );
    return res.data;
  } catch (err) {
    console.log(err);
  }
};
