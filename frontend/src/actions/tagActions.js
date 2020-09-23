import * as actions from './types';

export const createTag = (accessToken, tagName) => (dispatch) => {
	dispatch({
		type: actions.CREATE_TAG
	});
	try {
		fetch(process.env.REACT_APP_API_URL + `api/tags/${tagName}`, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			},
			method: 'POST'
		})
			.then((response) => {
				if (!response.ok) throw Error(response.statusText);
				else return response;
			})
			.then((response) => response.json())
			.then(() =>
				dispatch({
					type: actions.CREATE_TAG_SUCCESS,
					payload: tagName
				})
			);
	} catch (e) {
		console.log(e);
	}
};

export const fetchTags = (accessToken) => (dispatch) => {
	try {
		dispatch({
			type: 'FETCH_TAGS_REQUEST'
		});
		fetch(process.env.REACT_APP_API_URL + 'api/tags', {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		})
			.then((response) => {
				if (!response.ok) throw Error(response.statusText);
				else return response;
			})
			.then((response) => response.json())
			.then((tags) => {
				dispatch({
					type: actions.FETCH_TAGS_SUCCESS,
					payload: tags.Items[0]
				});
			});
	} catch (e) {
		console.log(e);
	}
};
