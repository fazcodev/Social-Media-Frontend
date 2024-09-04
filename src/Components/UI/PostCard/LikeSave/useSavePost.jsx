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
            { type: "saved" }
          ],
          refetchType: 'all'
        },
        { throwonError: true }
      );
      queryClient.invalidateQueries(
        {
          queryKey: [
            "profile",
            "posts",
            { type: "posted" }
          ],
          refetchType: 'inactive'
        },
        { throwonError: true }
      );
      queryClient.invalidateQueries(
        {
          queryKey: ['post', post._id, { type: 'info' }],
          exact: true,
          refetchType: 'none'
        },
        { throwonError: true }
      )
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
