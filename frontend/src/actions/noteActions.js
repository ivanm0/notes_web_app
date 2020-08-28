import * as actions from './types';

export const fetchNotes = (accessToken, id) => (dispatch) => {
	try {
		dispatch({
			type: 'FETCH_NOTES_REQUEST'
		});
		fetch('http://localhost:5000/api/notes', {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		})
			.then((response) => {
				if (!response.ok) throw Error(response.statusText);
				else return response;
			})
			.then((response) => response.json())
			.then((notes) => {
				dispatch({
					type: actions.FETCH_NOTES_SUCCESS,
					payload: {
						items: notes.Items,
						index:
							notes.Items.findIndex((note) => note.noteID === id) >= 0
								? notes.Items.findIndex((note) => note.noteID === id)
								: 0
					}
				});
				// dispatch({
				// 	type: actions.SWITCH_CURRENT_NOTE,
				// 	payload:

				// });
			});
	} catch (e) {
		console.log(e);
	}
};

export const createNote = (accessToken) => (dispatch) => {
	dispatch({
		type: actions.CREATE_NOTE_REQUEST
	});
	try {
		fetch('http://localhost:5000/api/notes', {
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
			.then((note) =>
				dispatch({
					type: actions.CREATE_NOTE_SUCCESS,
					payload: note
				})
			);
	} catch (e) {
		console.log(e);
	}
};

export const deleteNote = (accessToken, id) => (dispatch) => {
	dispatch({
		type: actions.DELETE_NOTE_REQUEST
	});
	try {
		fetch(`http://localhost:5000/api/notes/${id}`, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			},
			method: 'DELETE'
		})
			.then((response) => {
				if (!response.ok) throw Error(response.statusText);
				else return response;
			})
			.then(() =>
				dispatch({
					type: actions.DELETE_NOTE_SUCCESS,
					payload: id
				})
			);
	} catch (e) {
		console.log(e);
	}
};

export const switchCurrentNote = (index) => ({
	type: actions.CHANGE_NOTE_REQUEST,
	payload: index
});

export const finishSwitching = () => ({
	type: actions.CHANGE_NOTE_SUCCESS
});

export const editCurrentNoteTitle = (edit) => ({
	type: actions.EDIT_CURRENT_NOTE_TITLE,
	payload: edit
});

export const editCurrentNoteBody = (edit) => ({
	type: actions.EDIT_CURRENT_NOTE_BODY,
	payload: edit
});

export const saveToDatabase = (accessToken, id, title, body) => (dispatch) => {
	dispatch({
		type: actions.SAVE_TO_DATABASE_REQUEST
	});
	try {
		fetch(`http://localhost:5000/api/notes/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`
			},
			body: JSON.stringify({
				title: title,
				body: body
			})
		})
			.then((response) => {
				if (!response.ok) throw Error(response.statusText);
				else return response;
			})
			.then((response) => response.json())
			.then((data) =>
				dispatch({
					type: actions.SAVE_TO_DATABASE_SUCCESS,
					payload: {
						id,
						timestamp: data.Attributes.lastEditTimestamp
					}
				})
			);
	} catch (e) {
		console.log(e);
	}
};

export const searchNotes = (accessToken, query) => (dispatch) => {
	dispatch({
		type: actions.SEARCH_REQUEST
	});
	try {
		fetch(`http://localhost:5000/api/notes/search/${query}`, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		})
			.then((response) => {
				if (!response.ok) throw Error(response.statusText);
				else return response;
			})
			.then((response) => response.json())
			.then((notes) => {
				dispatch({
					type: actions.SEARCH_SUCCESS,
					payload: {
						items: notes.Items,
						query
					}
				});
			});
	} catch (e) {
		console.log(e);
	}
};

export const exitSearch = () => ({
	type: actions.EXIT_SEARCH
});

export const addTag = (accessToken, noteID, tag) => (dispatch) => {
	dispatch({
		type: actions.ADD_TAG_REQUEST
	});
	try {
		fetch(`http://localhost:5000/api/notes/tag/${noteID}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`
			},
			body: JSON.stringify({
				action: 'ADD',
				tag: tag
			})
		})
			.then((response) => {
				if (!response.ok) throw Error(response.statusText);
				else return response;
			})
			.then((response) => response.json())
			.then(() => {
				dispatch({
					type: actions.ADD_TAG_SUCCESS,
					payload: {
						noteID,
						tag
					}
				});
			});
	} catch (e) {
		console.log(e);
	}
};

export const removeTag = (accessToken, noteID, tag) => (dispatch) => {
	dispatch({
		type: actions.REMOVE_TAG_REQUEST
	});
	try {
		fetch(`http://localhost:5000/api/notes/tag/${noteID}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`
			},
			body: JSON.stringify({
				action: 'DELETE',
				tag: tag
			})
		})
			.then((response) => {
				if (!response.ok) throw Error(response.statusText);
				else return response;
			})
			.then((response) => response.json())
			.then(() => {
				dispatch({
					type: actions.REMOVE_TAG_SUCCESS,
					payload: {
						noteID,
						tag
					}
				});
			});
	} catch (e) {
		console.log(e);
	}
};

export const changeCategory = (accessToken, tag) => (dispatch) => {
	dispatch({
		type: actions.CHANGE_CATEGORY_REQUEST
	});
	try {
		fetch(`http://localhost:5000/api/notes/search/tag/${tag}`, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		})
			.then((response) => {
				if (!response.ok) throw Error(response.statusText);
				else return response;
			})
			.then((response) => response.json())
			.then((notes) => {
				dispatch({
					type: actions.CHANGE_CATEGORY_SUCCESS,
					payload: {
						items: notes.Items,
						tag
					}
				});
			});
	} catch (e) {
		console.log(e);
	}
};
