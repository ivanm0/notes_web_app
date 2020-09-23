import * as actions from '../actions/types';

const initialState = { items: [] };

export default (state = initialState, { type, payload }) => {
	switch (type) {
		case actions.CREATE_TAG:
			return state;
		case actions.CREATE_TAG_SUCCESS:
			return {
				...state,
				items: [ payload, ...state.items ]
			};
		case actions.FETCH_TAGS_SUCCESS:
			return {
				...state,
				items: payload.tags ? payload.tags.names : state.items
			};
		default:
			return state;
	}
};
