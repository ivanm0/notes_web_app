import * as actions from '../actions/types';

const initialState = {
	name: '',
	accessToken: ''
};

export default (state = initialState, { type, payload }) => {
	switch (type) {
		case actions.LOAD_USER:
			return {
				...state,
				name: payload.name,
				accessToken: payload.accessToken
			};
		default:
			return state;
	}
};
