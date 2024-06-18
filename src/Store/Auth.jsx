import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    // token: null,
    email: null,
    name: null,
    username: null,
    avatarURL: null,
    id: null,
    bio: null,
    age: null,
    posts: [],
  },
  reducers: {
    setAuthData(state, action) {
      // localStorage.setItem('token', action.payload.token)
      localStorage.setItem("email", action.payload.email);
      localStorage.setItem("name", action.payload.name);
      localStorage.setItem("username", action.payload.username);
      localStorage.setItem("id", action.payload.id);
      if (action.payload.avatarURL)
        localStorage.setItem("avatarURL", action.payload.avatarURL);
      if (action.payload.bio) localStorage.setItem("bio", action.payload.bio);
      if (action.payload.age) localStorage.setItem("age", action.payload.age);

      // state.token = action.payload.token
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.username = action.payload.username;
      state.avatarURL = action.payload.avatarURL;
      state.id = action.payload.id;
      state.bio = action.payload.bio;
      state.age = action.payload.age;
    },
    setPosts(state, action) {
      state.posts = action.payload;
    },
  },
});

export const authReducer = authSlice.reducer;
export const authActions = authSlice.actions;
