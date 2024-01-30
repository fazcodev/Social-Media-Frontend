import { Outlet, Navigate, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { authActions } from "../../Store/Auth";
import { BASE_URL } from "../Helpers/sendRequest";

const PrivateRoute = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  if(!token)return <Navigate to="/signin" />;
  const fetchPosts = async (username) => {
    try {
      const res = await axios.get(`${BASE_URL}/${username}/posts`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      dispatch(authActions.setPosts(res.data));
    } catch (err) {
      console.log(err);
    }
  };
  axios
    .get(`${BASE_URL}/users/me`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
    .then((res) => {
      dispatch(
        authActions.setAuthData({
          token: localStorage.getItem("token"),
          name: res.data.name,
          email: res.data.email,
          username: res.data.username,
          avatarURL: res.data.avatarURL,
          id: res.data._id,
          ...(res.data.bio && { bio: res.data.bio }),
          age: res.data.age,
        })
      );
      const username = res.data.username;
      fetchPosts(username);
      if(location.pathname == '/')navigate('/home');
    })
    .catch((err) => {
      console.log("Unauthorized", err);
      return <Navigate to="/signin" />;
    });

  return <Outlet />;
};
export default PrivateRoute;




