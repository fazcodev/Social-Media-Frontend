import {useState, useEffect} from 'react'
import axios from 'axios';
import { apiUrl } from '../../config';

const usePosts = (username, type) => {
    const [posts, setPosts] = useState([]);
  
    useEffect(() => {
      const fetchPosts = async () => {
        try {
          const url = type === "saved" ? `${apiUrl}/posts/${username}/saved` : `${apiUrl}/${username}/posts`;
          const res = await axios.get(url, { withCredentials: type === "saved" });
          setPosts(res.data);
        } catch (err) {
          console.log(err);
        }
      };
      fetchPosts();
    }, [username, type]);
  
    return posts;
  };

export default usePosts
