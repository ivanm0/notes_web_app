import * as actions from "./types";

export const loadUser = (username, accessToken) => ({
  type: actions.LOAD_USER,
  payload: { username, accessToken },
});

export const logoutUser = () => ({
  type: actions.LOGOUT_USER,
});
