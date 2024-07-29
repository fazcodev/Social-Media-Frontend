import {useState} from 'react';
import PropTypes from 'prop-types'
import useLikePost from './useLikePost';

import { Favorite } from '@mui/icons-material';
import "../PostLike.css";


const LikePostAnimation = ({post}) => {

    const [heartActive, setHeartActive] = useState(false);
    const {liked, likePost} = useLikePost(post)


    const handleLikeAnimation = () => {
        setHeartActive(true);
        if (!liked) likePost({postId: post?._id, reqType: "like"});
        setTimeout(() => {
          setHeartActive(false);
        }, 1100);
      };
    return(
        <div
          onDoubleClick={handleLikeAnimation}
          className="relative cursor-pointer w-1/2 bg-black overflow-y-scroll flex items-center img-wrapper"
        >
          <img className="w-full bg-cover" src={post?.imageUrl} alt="" />
          <Favorite
            fontSize="large"
            className={`${
              heartActive ? "heart" : ""
            } absolute opacity-0 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-red-600`}
          />
        </div>
    )
}

export default LikePostAnimation;

LikePostAnimation.propTypes = {
    post: PropTypes.object
}