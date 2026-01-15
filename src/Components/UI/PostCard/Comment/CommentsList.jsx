import { useRef, useCallback, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { v4 as uuid } from "uuid";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { fetchComments } from "../../../../Utils/FetchUtils";
import defaultAvatar from "../../../Assets/Default_Avatar.png";
import { AccessTimeOutlined } from "@mui/icons-material";

dayjs.extend(relativeTime);

const CommentsList = ({ postId }) => {
  const bottomRef = useRef();
  const observer = useRef();
  // useEffect(() => {
  //   const fetchComments = async () => {
  //     try {
  //       const res = await axios.get(`${apiUrl}/posts/${postId}/comments`, {
  //         withCredentials : true
  //       });
  //       setComments(res.data);
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   }
  //   fetchComments(postId)
  // }, [postId, setComments]);

  const { data, hasNextPage, fetchNextPage, isFetching } = useInfiniteQuery({
    queryKey: ["post", postId, { type: "comments" }],
    queryFn: async (...args) => {
      const data = await fetchComments(postId, ...args);
      if (args[0].pageParam == 0) {
        bottomRef.current?.scrollIntoView({ behavior: "auto" });
      }
      return data;
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage?.length < 10) return null;
      return pages.length;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
  });
  const lastCommentElementRef = useCallback(
    (node) => {
      if (isFetching) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage) {
            if (fetchNextPage && hasNextPage) fetchNextPage();
          }
        },
        { rootMargin: "5000px" }
      );
      if (node) observer.current.observe(node);
    },
    [isFetching, hasNextPage]
  );
  // useEffect(() => {
  //   bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, []);

  return (
    <div className="h-full grow flex flex-col-reverse overflow-y-scroll">
      <div ref={bottomRef} />
      {data?.pages?.length > 0 &&
        data.pages.map((page, idx) =>
          page?.map((comment, cid) => {
            return (
              <div
                key={comment._id}
                ref={
                  data?.pages?.length === idx + 1 && page.length == cid + 1
                    ? lastCommentElementRef
                    : null
                }
                className={`${comment?.user?._id == localStorage.getItem("id")
                  ? "justify-end"
                  : "justify-start"
                  } flex p-1`}
              >
                <div className="flex gap-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)] dark:shadow-[0_3px_10px_rgb(0,0,0,0.5)] border border-slate-300 dark:border-slate-600 items-start bg-slate-100 dark:bg-slate-700/80 w-3/4 p-2 rounded-xl">
                  <div className="w-10 mtiny:w-6 rounded-full overflow-hidden flex justify-center items-center shrink-0">
                    <img
                      className="w-full"
                      src={
                        comment?.user.avatarURL
                          ? comment.user.avatarURL
                          : defaultAvatar
                      }
                      alt=""
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <div className="font-bold mtiny:font-semibold mtiny:text-sm text-slate-800 dark:text-slate-100">
                        {comment?.user?.name}
                      </div>
                      <div className="text-xs mtiny:text-[8px] text-slate-500 dark:text-slate-400">
                        {comment?.createdAt === "temp" ? (
                          <AccessTimeOutlined fontSize="small" />
                        ) : (
                          dayjs(comment?.createdAt).fromNow()
                        )}
                      </div>
                    </div>
                    <div className="text-sm mtiny:text-xs text-slate-700 dark:text-slate-200">{comment?.text}</div>
                  </div>
                </div>
              </div>
            );
          })
        )}


    </div>
  );
};

export default CommentsList;

CommentsList.propTypes = {
  postId: PropTypes.string
  // comments: PropTypes.array.isRequired,
  // setComments: PropTypes.func.isRequired,
};
