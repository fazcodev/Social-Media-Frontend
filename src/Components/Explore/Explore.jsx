import { useState } from "react";
import Modal from "../UI/Modal";
import PostsGrid from "../Profile/Posts/PostsGrid";
import axios from "axios";
import { apiUrl } from "../../Config/config";
import { useInfiniteQuery } from "@tanstack/react-query";
export default function Explore() {
  const [activePost, setActivePost] = useState(null); // [0, 1, 2, 3, 4
  const explorePostsURL = `${apiUrl}/explore`;
  // const [pageNumber, setPageNumber] = useState(0);
  // const {
  //   loading,
  //   results: explorePosts,
  //   hasMore,
  // } = usePagFetch("", pageNumber, 3, explorePostsURL);
  const {data, hasNextPage, fetchNextPage, isFetching} = useInfiniteQuery({
    queryKey: ["explore", "posts"],
    queryFn: async({pageParam}) => {
      const limit = 3;
      const res = await axios(`${apiUrl}/explore`, {
        withCredentials: true,
        params: {skip:pageParam*limit, limit}
      })
      return res.data;
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage?.length < 3) return null;
      return pages?.length;
    },
    initialPageParam: 0,
    refetchOnWindowFocus: false,
    staleTime: 5000 * 60,
  }); 
  return (
    <>
      {activePost && (
        <Modal
          title="View Post"
          postId={activePost}
          openModalHandler={setActivePost}
        />
      )}

      <div className="flex flex-1 justify-evenly my-5 overflow-y-scroll">
        <div className="w-11/12">
          <PostsGrid
            setActivePost={setActivePost}
            postPages={data?.pages}
            loading={isFetching}
            hasMore={hasNextPage}
            fetchNextPage={fetchNextPage}
          />
        </div>
      </div>
    </>
  );
}
