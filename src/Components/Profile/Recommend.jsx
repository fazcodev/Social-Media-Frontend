import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import AvatarPNG from "../Assets/Default_Avatar.png";
import { GroupAdd } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../Config/config";

export default function Recommend() {
  const [openList, setOpenList] = useState(false);
  const [seeAll, setSeeAll] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const openUserProfile = (person) => {
    navigate(`/profile/users/${person.username}`);
  };
  const fetchSuggestList = async () => {
    try {
      const res = await axios.get(`${apiUrl}/users/me/user-suggestions`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  // useEffect(() => {
  //   fetchSuggestList();
  // }, []);
  const { data: suggestList } = useQuery({
    queryKey: ["profile", "suggestions", localStorage.getItem("username")],
    queryFn: fetchSuggestList,
    staleTime: 10000 * 60,
    refetchOnWindowFocus: false,
  });

  const followUser = async (e, person) => {
    // console.log(e.currentTarget.innerText.toLowerCase());
    try {
      const res = await axios({
        method: e.target.innerText == "Follow" ? "post" : "delete",
        url: `${apiUrl}/users/${person.username
          }/${e.target.innerText.toLowerCase()}`,
        withCredentials: true,
      });
      e.target.innerText = (e.target.innerText == "Follow" ? "Unfollow" : "Follow");
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };
  const { mutate, isFetching } = useMutation({
    mutationFn: ({ e, person }) => {
      return followUser(e, person);
    },
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData(
        ["profile", "suggestions", localStorage.getItem("username")],
        (oldData) => {
          return oldData.filter((person) => person._id != variables.person._id);
        }
      );
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] == "profile" &&
          query.queryKey[1] === "desc" &&
          query.queryKey[2]?.type !== "info" &&
          [
            localStorage.getItem("username"),
            variables.person.username,
          ].includes(query.queryKey[3]),
      });
    },
  });
  return (
    <>
      {suggestList?.length > 0 && (
        <button
          onClick={() => setOpenList((prev) => !prev)}
          className={`tiny:hidden absolute top-2 right-2 w-12 h-12 flex items-center justify-center bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white rounded-full shadow-md z-30`}
        >
          <GroupAdd
            className={`${openList ? "text-slate-900 dark:text-white" : "text-accent"}`}
            fontSize="large"
          />
        </button>
      )}
      {suggestList?.length > 0 && (
        <div
          className={`pt-3 px-4 w-1/4 mmd:w-1/3 mtiny:w-1/2 ${openList
            ? "mtiny:img-wrapper mtiny:opacity-100 mtiny:visible"
            : "mtiny:opacity-0 mtiny:invisible"
            } mtiny:rounded-xl mtiny:absolute mtiny:top-16 mtiny:right-2 mtiny:bg-white/90 mtiny:dark:bg-slate-900/90 mtiny:backdrop-blur-xl mtiny:shadow-2xl mtiny:border mtiny:dark:border-slate-700 transition-all mtiny:max-h-56 duration-300 text-center ${seeAll ? "overflow-y-scroll max-h-80" : "overflow-hidden max-h-64"
            } mtiny:z-40 [scrollbar-gutter:stable]`}
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400 tracking-wide">
              Suggestions for you
            </span>
            <button
              onClick={() => setSeeAll((prev) => !prev)}
              className="text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-accent transition-colors w-16 text-right"
            >
              {!seeAll ? "See All" : "See Less"}
            </button>
          </div>

          <div className="flex flex-col w-full gap-3">
            {suggestList?.length > 0 &&
              suggestList?.map((person) => {
                return (
                  <div
                    key={person._id}
                    className="flex cursor-pointer gap-3 items-center bg-white/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-white/40 dark:border-slate-700 p-2 rounded-lg transition-colors group"
                    onClick={() => openUserProfile(person)}
                  >
                    <img
                      alt="avatar"
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-accent/50 transition-all"
                      src={
                        person.avatarURL == undefined
                          ? AvatarPNG
                          : person.avatarURL
                      }
                    />
                    <div className="flex-1 text-left min-w-0">
                      <h1 className="font-bold text-slate-900 dark:text-white text-sm truncate">{person.name}</h1>
                      <h1 className="text-xs text-slate-500 dark:text-slate-400 truncate">@{person.username}</h1>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        mutate({ e, person });
                      }}
                      disabled={isFetching}
                      className={`${isFetching
                        ? "text-accent/50 cursor-default"
                        : "text-accent hover:text-accent-dark"
                        } disabled:cursor-default text-xs font-bold transition-colors shrink-0`}
                    >
                      Follow
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </>
  );
}
