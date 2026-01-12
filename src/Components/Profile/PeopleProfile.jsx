import ProfilePosts from "./Posts/ProfilePosts";
import ProfileDesc from "./ProfileDesc";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchUserInfo } from "../../Utils/FetchUtils";

export default function Profile() {
  const { username } = useParams();

  const userQuery = useQuery({
    queryKey: ["profile", "desc", { type: "info" }, username],
    queryFn: () => fetchUserInfo(username),
    staleTime: 5000 * 60,
    refetchOnWindowFocus: false,
    retry: false,
  });

  return (
    <div className="flex-1 overflow-y-scroll p-2">
      <ProfileDesc />
      {/* Only show divider and posts if user exists */}
      {userQuery.data && !userQuery.isError && (
        <>
          <div
            style={{ height: "1.7px" }}
            className="w-full bg-stone-300 dark:bg-slate-700 overflow-hidden my-2"
          ></div>
          <ProfilePosts username={username} />
        </>
      )}
    </div>
  );
}
