import * as actions from '../actions/types';

const initialState = {
	items: [
		{
			userID: 0,
			noteID: 5,
			creationTimestamp: 1592518020,
			lastEditTimestamp: 1592518020,
			title: 'These',
			body: ''
		},
		{
			userID: 0,
			noteID: 4,
			creationTimestamp: 1592517960,
			lastEditTimestamp: 1592517960,
			title: 'could',
			body: ''
		},
		{
			userID: 0,
			noteID: 3,
			creationTimestamp: 1592517900,
			lastEditTimestamp: 1592517900,
			title: 'be',
			body: ''
		},
		{
			userID: 0,
			noteID: 2,
			creationTimestamp: 1592517840,
			lastEditTimestamp: 1592517840,
			title: 'your',
			body: ''
		},
		{
			userID: 0,
			noteID: 1,
			creationTimestamp: 1592517780,
			lastEditTimestamp: 1592517780,
			title: 'notes.',
			body: ''
		},
		{
			userID: 0,
			noteID: 0,
			creationTimestamp: 1592517720,
			lastEditTimestamp: 1592517720,
			title: 'Sign up today.',
			body: ''
		}
	],
	currentItem: 5,
	noteListInfo: 'All Notes'
};

export default (state = initialState, { type, payload }) => {
	switch (type) {
		case actions.FETCH_NOTES_SUCCESS:
			return {
				...state,
				items: payload.items,
				currentItem: payload.index,
				noteListInfo: 'All Notes'
			};
		case actions.CREATE_NOTE_SUCCESS:
			return {
				...state,
				items: [ payload, ...state.items ],
				currentItem: 0
			};
		case actions.DELETE_NOTE_SUCCESS:
			return {
				...state,
				items: state.items.filter((note) => note.noteID !== payload),
				currentItem: state.currentItem + 1 === state.items.length ? state.currentItem - 1 : state.currentItem
			};
		case actions.CHANGE_NOTE_REQUEST:
			// not an API call but still need to keep track of its "loading" state (for note panel to re-init editors)
			return {
				...state,
				currentItem: payload
			};
		case actions.EDIT_CURRENT_NOTE_TITLE:
			return {
				...state,
				items: [
					{ ...state.items[state.currentItem], title: payload },
					...state.items.slice(0, state.currentItem),
					...state.items.slice(state.currentItem + 1)
				],
				currentItem: 0
			};
		case actions.EDIT_CURRENT_NOTE_BODY:
			return {
				...state,
				items: [
					{ ...state.items[state.currentItem], body: payload },
					...state.items.slice(0, state.currentItem),
					...state.items.slice(state.currentItem + 1)
				],
				currentItem: 0
			};
		case actions.SAVE_TO_DATABASE_SUCCESS:
			return {
				...state,
				items: state.items.map(
					(note) => (note.noteID === payload.id ? { ...note, lastEditTimestamp: payload.timestamp } : note)
				)
			};
		case actions.SEARCH_SUCCESS:
			return {
				...state,
				noteListInfo: `Search: ${payload.query}`,
				items: payload.items,
				currentItem: 0,
				isLoading: false
			};
		case actions.CHANGE_CATEGORY_SUCCESS:
			return {
				...state,
				noteListInfo: `Tag: ${payload.tag}`,
				items: payload.items,
				currentItem: 0,
				isLoading: false
			};
		case actions.EXIT_SEARCH:
			return {
				...state,
				noteListInfo: 'All Notes'
			};
		case actions.ADD_TAG_SUCCESS:
			return {
				...state,
				items: state.items.map(
					(note) =>
						note.noteID === payload.noteID && !(note.tags && note.tags.includes(payload.tag))
							? { ...note, tags: [ ...(note.tags ? note.tags : []), payload.tag ] }
							: note
				)
			};
		case actions.REMOVE_TAG_SUCCESS:
			return {
				...state,
				items: state.items.map(
					(note) =>
						note.noteID === payload.noteID
							? {
									...note,
									tags: note.tags.filter((tag) => tag !== payload.tag)
								}
							: note
				)
			};
		default:
			return state;
	}
};
