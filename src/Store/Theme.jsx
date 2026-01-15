import { createSlice } from "@reduxjs/toolkit";

// Get initial theme from localStorage or system preference
const getInitialTheme = () => {
    if (typeof window !== "undefined" && localStorage.getItem("theme")) {
        return localStorage.getItem("theme");
    }
    if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
    }
    return "light";
};

// Apply theme to DOM
const applyTheme = (theme) => {
    if (typeof document !== "undefined") {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }
};

// Apply initial theme immediately
const initialTheme = getInitialTheme();
applyTheme(initialTheme);

const themeSlice = createSlice({
    name: "theme",
    initialState: { theme: initialTheme },
    reducers: {
        toggleTheme(state) {
            state.theme = state.theme === "dark" ? "light" : "dark";
            applyTheme(state.theme);
        },
        setTheme(state, action) {
            state.theme = action.payload;
            applyTheme(state.theme);
        },
    },
});

export const themeActions = themeSlice.actions;
export const themeReducer = themeSlice.reducer;
