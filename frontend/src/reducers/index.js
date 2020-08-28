import { combineReducers } from 'redux';
import userReducer from './userReducer';
import noteReducer from './noteReducer';
import { LOGOUT_USER } from '../actions/types';
import tagReducer from './tagReducer';
import apiReducer from './apiReducer';

const appReducer = combineReducers({
	user: userReducer,
	notes: noteReducer,
	tags: tagReducer,
	loading: apiReducer
});

export default (state, action) => {
	if (action.type === LOGOUT_USER) {
		state = undefined;
	}

	return appReducer(state, action);
};
