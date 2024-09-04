import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../../../../Config/config.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useSavePost = (post) => {
  const [saved, setSaved] = useState(null);
  useEffect(() => {
    setSaved(post?.isSaved);
  }, [post]);
  const savePost = async (postId, reqType) => {
    try {
      await axios({
        method: reqType == "save" ? "post" : "delete",
        url: `${apiUrl}/posts/${postId}/${reqType}`,
        withCredentials: true,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (vars, ...args) => savePost(vars.postId, vars.reqType),
    onSuccess: (date, variables, context) => {
      setSaved(variables.reqType == "save");
      queryClient.invalidateQueries(
        {
          queryKey: [
            "profile",
            "posts",
            { type: "saved" },
            localStorage.getItem("username"),
          ],
          exact: true,
          refetchType: "all",
        },
        { throwonError: true }
      );
      queryClient.setQueryData(
        [
          "profile",
          "posts",
          { type: "posted" },
          localStorage.getItem("username"),
        ],
        (prevPages) =>
          prevPages.map((page) =>
            page.map((p) => {
              if (p._id === post._id) {
                return { isSaved: saved, ...p };
              }
              return p;
            })
          )
      );

      queryClient.setQueryData(
        ['feed'],
        (prevPages) =>
          prevPages.map((page) =>
            page.map((p) => {
              if (p._id === post._id) {
                return { isSaved: saved, ...p };
              }
              return p;
            })
          )
      );
    },
  });

  return { saved, savePost: mutate, isPending };
};

export default useSavePost;
