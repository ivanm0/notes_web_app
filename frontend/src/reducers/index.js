import { combineReducers } from "redux";
import userReducer from "./userReducer";
import noteReducer from "./noteReducer";
import { LOGOUT_USER } from "../actions/types";
import tagReducer from "./tagReducer";

const appReducer = combineReducers({
  user: userReducer,
  notes: noteReducer,
  tags: tagReducer,
});

export default (state, action) => {
  if (action.type === LOGOUT_USER) {
    state = undefined;
  }

  return appReducer(state, action);
};
