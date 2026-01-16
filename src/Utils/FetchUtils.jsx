import axios from "axios";
import { apiUrl } from "../Config/config";

export const fetchPosts = async (username, type, { pageParam = 0, ...args } = {}) => {
  try {
    const limit = 3;
    const url = type === 'saved' ? `${apiUrl}/posts/${username}/saved` : `${apiUrl}/${username}/posts`;
    const res = await axios.get(url, { withCredentials: type === "saved", params: { skip: pageParam * limit, limit } });
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const fetchUserInfo = async (username) => {
  try {
    const res = await axios.get(`${apiUrl}/users/${username}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const fetchFollowings = async (username) => {
  try {
    const res = await axios.get(`${apiUrl}/users/${username}/followings`);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const fetchFollowers = async (username) => {
  try {
    const res = await axios.get(`${apiUrl}/users/${username}/followers`);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const fetchPost = async (postId) => {
  try {
    const res = await axios.get(`${apiUrl}/posts/${postId}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export const fetchComments = async (postId, { pageParam = 0, ...args } = {}) => {
  try {
    const limit = 10;
    const res = await axios.get(`${apiUrl}/posts/${postId}/comments`, {
      withCredentials: true,
      params: { skip: pageParam * limit, limit }
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}
export const prefetchProfile = async (username, queryClient) => {
  try {
    let promises = [
      queryClient.prefetchInfiniteQuery({
        queryKey: ['profile', 'posts', { type: 'posted' }, username],
        queryFn: ({ pageParam = 0 }) => fetchPosts(username, "posts", { pageParam }),
        getNextPageParam: (lastPage, pages) => {
          if (!lastPage || lastPage.length < 3) return undefined;
          return pages.length;
        },
        initialPageParam: 0,
        staleTime: 10000 * 60,
      }),
      queryClient.prefetchQuery({
        queryKey: ['profile', 'desc', { type: 'followers' }, username],
        queryFn: () => fetchFollowers(username),
        staleTime: 10000 * 60,
        refetchOnWindowFocus: false,

      }),
      queryClient.prefetchQuery({
        queryKey: ['profile', 'desc', { type: 'followings' }, username],
        queryFn: () => fetchFollowings(username),
        staleTime: 10000 * 60,
        refetchOnWindowFocus: false,

      }),
      queryClient.prefetchQuery({
        queryKey: ['profile', 'desc', { type: 'info' }, username],
        queryFn: () => fetchUserInfo(username),
        staleTime: 10000 * 60,
        refetchOnWindowFocus: false,
      }),
    ];
    if (username === localStorage.getItem('username')) {
      promises.push(queryClient.prefetchInfiniteQuery({
        queryKey: ['profile', 'posts', { type: 'saved' }, username],
        queryFn: ({ pageParam = 0 }) => fetchPosts(username, "saved", { pageParam }),
        getNextPageParam: (lastPage, pages) => {
          if (!lastPage || lastPage.length < 3) return undefined;
          return pages.length;
        },
        initialPageParam: 0,
        staleTime: 10000 * 60,
      }));
    }
    await Promise.all(promises);
  } catch (error) {
    console.log(error);
  }
};
