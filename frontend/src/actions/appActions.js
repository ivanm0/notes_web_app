import * as actions from './types';

export const fetchNotesAndTags = (accessToken, id) => async (dispatch) => {
	try {
		dispatch({
			type: actions.FETCH_NOTES_REQUEST
		});
		dispatch({
			type: actions.FETCH_TAGS_REQUEST
		});
		const urls = [ 'http://localhost:5000/api/notes', 'http://localhost:5000/api/tags' ];
		const requests = urls.map((url) =>
			fetch(url, {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			})
		);
		const responses = await Promise.all(requests);
		responses.forEach((response) => {
			if (!response.ok) throw Error(response.statusText);
		});

		const [ notesRes, tagsRes ] = responses;
		const notesJSON = await notesRes.json();
		const tagsJSON = await tagsRes.json();

		dispatch({
			type: actions.FETCH_NOTES_SUCCESS,
			payload: {
				items: notesJSON.Items,
				index:
					notesJSON.Items.findIndex((note) => note.noteID === id) >= 0
						? notesJSON.Items.findIndex((note) => note.noteID === id)
						: 0
			}
		});
		dispatch({
			type: actions.FETCH_TAGS_SUCCESS,
			payload: { tags: tagsJSON.Items[0] }
		});
	} catch (e) {
		console.log(e);
	}
};
