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
        url: `${apiUrl}/users/${
          person.username
        }/${e.target.innerText.toLowerCase()}`,
        withCredentials: true,
      });
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
          className={`tiny:hidden absolute top-2 right-2 w-12 h-12 flex items-center justify-center bg-stone-300 rounded-full`}
        >
          <GroupAdd
            className={`${openList ? "text-black" : "text-blue-600"}`}
            fontSize="large"
          />
        </button>
      )}
      {suggestList?.length > 0 && (
        <div
          className={`pt-3 px-2 w-1/4 mmd:w-1/3 mtiny:w-1/2 ${
            openList
              ? "mtiny:img-wrapper mtiny:opacity-100"
              : "mtiny:opacity-0 mtiny:invisible"
          } mtiny:rounded-md mtiny:absolute mtiny:top-16 mtiny:right-2 mtiny:bg-stone-200 transition-all mtiny:max-h-40 duration-500 text-center ${
            seeAll ? "overflow-y-scroll max-h-56" : "overflow-hidden max-h-48"
          }`}
        >
          <span className="text-sm font-semibold text-stone-400">
            Suggestions for you
          </span>
          <button
            onClick={() => setSeeAll((prev) => !prev)}
            className="text-sm font-bold w-20"
          >
            {!seeAll ? "See All" : "See Less"}
          </button>

          <div className="flex flex-col w-full">
            {suggestList?.length > 0 &&
              suggestList?.map((person) => {
                return (
                  <div
                    key={person._id}
                    className="flex cursor-pointer gap-3 mtiny:gap-2 items-center my-2"
                    onClick={() => openUserProfile(person)}
                  >
                    <img
                      alt="avatar"
                      className="h-10 w-10 mtiny:h-8 mtiny:w-8 rounded-full"
                      src={
                        person.avatarURL == undefined
                          ? AvatarPNG
                          : person.avatarURL
                      }
                    />
                    <div>
                      <h1 className="font-bold">{person.name}</h1>
                      <h1 className="text-sm">{person.username}</h1>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        mutate({ e, person });
                      }}
                      disabled={isFetching}
                      className={`${
                        isFetching
                          ? "text-blue-100 cursor-default hover:text-blue-100"
                          : "text-blue-500 hover:text-blue-600"
                      } disabled:cursor-default text-sm font-bold`}
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
