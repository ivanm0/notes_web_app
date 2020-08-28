import * as actions from './types';

export const loadUser = (name, accessToken) => ({
	type: actions.LOAD_USER,
	payload: { name, accessToken }
});

export const logoutUser = () => ({
	type: actions.LOGOUT_USER
});
