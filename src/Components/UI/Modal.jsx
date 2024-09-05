import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Backdrop from "./Backdrop";
import PostCard from "./PostCard/PostCard";
import ImageContainer from "../Image/ImageContainer";
import { ContainerCtxProvider } from "../Image/Context/container-context";

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
      {props.title != "View Post" &&
        ReactDOM.createPortal(
          <ContainerCtxProvider>
            <ImageContainer {...props} />
          </ContainerCtxProvider>,
          document.getElementById("overlay-root")
        )}
    </>
  );
}


Modal.propTypes = {
  title: PropTypes.string.isRequired,
  postId: PropTypes.string,
  postOwner: PropTypes.object
};
