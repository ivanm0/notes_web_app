import * as actions from "../actions/types";

const initialState = { items: [], isFetching: false };

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case actions.CREATE_TAG:
      return state;
    case actions.CREATE_TAG_SUCCESS:
      return {
        ...state,
        items: [payload, ...state.items],
      };
    case actions.FETCH_TAGS:
      return {
        ...state,
        isFetching: true,
      };
    case actions.FETCH_TAGS_SUCCESS:
      const itemArr = [];
      return {
        ...state,
        items: payload ? payload.names : state.items,
        isFetching: false,
      };
    default:
      return state;
  }
};
