import type { AppState } from "../../types";

const INITIAL_STATE: AppState = {
  posts: [],
  auth: {
    refreshToken: "",
    accessToken: "",
    apiKey: "",
    isAuthenticated: false,
    isLoggedIn: false,
    user: {
      image: "https://i.pravatar.cc/150?img=34",
      username: "dondada",
      firstName: "Skuba",
      lastName: "Koooper",
      id: 12345,
      email: "skub@mail.com",
      phone: "4121234567",
    },
  },
  currentPage: "/",
};

export const state = INITIAL_STATE;
