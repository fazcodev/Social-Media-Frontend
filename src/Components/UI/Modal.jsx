import ReactDOM from "react-dom";
import Backdrop from "./Backdrop";
import PostCard from "./PostCard";
import ImageContainer from "../Image/ImageContainer";

export default function Modal(props) {
  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop {...props} />,
        document.getElementById("backdrop-root")
      )}
      {props.title == "View Post" &&
        ReactDOM.createPortal(
          <PostCard {...props} />,
          document.getElementById("overlay-root")
        )}
      {props.title == "Create Post" &&
        ReactDOM.createPortal(
          <ImageContainer {...props} />,
          document.getElementById("overlay-root")
        )}
    </>
  );
}
