import * as actions from "../actions/types";

const initialState = {
  username: "",
  accessToken: "",
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case actions.LOAD_USER:
      return {
        ...state,
        username: payload.username,
        accessToken: payload.accessToken,
      };
    default:
      return state;
  }
};
