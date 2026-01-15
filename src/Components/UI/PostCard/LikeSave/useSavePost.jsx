import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../../../../Config/config.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useSavePost = (post) => {
  const [saved, setSaved] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    setSaved(post?.isSaved);
  }, [post]);

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ postId, reqType }) => {
      await axios({
        method: reqType === "save" ? "post" : "delete",
        url: `${apiUrl}/posts/${postId}/${reqType}`,
        withCredentials: true,
      });
      return { reqType };
    },
    onMutate: async ({ reqType }) => {
      // Store previous value for rollback
      const previousSaved = saved;

      // Optimistic update
      setSaved(reqType === "save");

      return { previousSaved };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      console.log(err);
      setSaved(context.previousSaved);
    },
    onSuccess: (data, variables) => {
      const newSaved = variables.reqType === "save";

      // Invalidate saved posts - refetch all since list changed
      queryClient.invalidateQueries({
        queryKey: ["profile", "posts", { type: "saved" }],
        refetchType: "all",
      });

      // Invalidate posted queries (inactive only)
      queryClient.invalidateQueries({
        queryKey: ["profile", "posts", { type: "posted" }],
        refetchType: "inactive",
      });

      // Invalidate post info query
      queryClient.invalidateQueries({
        queryKey: ["post", post._id, { type: "info" }],
        exact: true,
        refetchType: "none",
      });

      // Update feed cache with correct infinite query structure
      queryClient.setQueryData(["feed"], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) =>
            page.map((p) => {
              if (p._id === post._id) {
                return { ...p, isSaved: newSaved };
              }
              return p;
            })
          ),
        };
      });
    },
  });

  return { saved, savePost: mutate, isPending };
};

export default useSavePost;
