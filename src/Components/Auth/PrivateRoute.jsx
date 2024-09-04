import { Outlet, Navigate, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { authActions } from "../../Store/Auth";
import { apiUrl } from "../../Config/config";

const PrivateRoute = () => {
  let username = localStorage.getItem("username");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  if (!username) return <Navigate to="/signin" />;
  const fetchPosts = async (username) => {
    try {
      const res = await axios.get(
        `${apiUrl}/${username}/posts`,
        {
          withCredentials: true,
        }
      );
      dispatch(authActions.setPosts(res.data));
    } catch (err) {
      console.log(err);
    }
  };
  axios
    .get(
      `${apiUrl}/users/me`,
      {
        withCredentials: true,
      }
    )
    .then((res) => {
      dispatch(
        authActions.setAuthData({
          // token: localStorage.getItem("token"),
          name: res.data.name,
          email: res.data.email,
          username: res.data.username,
          avatarURL: res.data.avatarURL,
          id: res.data._id,
          ...(res.data.bio && { bio: res.data.bio }),
          age: res.data.age,
        })
      );

      username = localStorage.getItem("username");
      fetchPosts(username);
      if (location.pathname == "/") navigate("/home");
      console.log("Authorized");
    })
    .catch((err) => {
      console.log("Unauthorized", err.response.data.error);
      navigate("/signin", { replace: true });
    });

  return <Outlet />;
};
export default PrivateRoute;
