import React, { useEffect, useRef } from 'react';
import './custom.scss';
import { useAuth0 } from '@auth0/auth0-react';
import { Row, Col } from 'react-bootstrap';
import Navigation from './components/Navigation';
import SideBar from './components/SideBar';
import NoteList from './components/NoteList';
import NotePanel from './components/NotePanel';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNotes } from './actions/noteActions';
import { fetchTags } from './actions/tagActions';
import { loadUser } from './actions/userActions';
import { animateScroll } from 'react-scroll';
import Loader from 'react-loader-spinner';
import { fetchNotesAndTags } from './actions/appActions';

function App() {
	const history = useHistory();
	const location = useLocation();
	const dispatch = useDispatch();
	const { isAuthenticated, isLoading, user, getAccessTokenSilently } = useAuth0();
	const notes = useSelector((state) => state.notes.items);
	const noteListInfo = useSelector((state) => state.notes.noteListInfo);
	const currNoteIndex = useSelector((state) => state.notes.currentItem);
	const loadingSelector = (actions) => (state) => actions.some((action) => state.loading[action]);
	const isFetching = useSelector((state) =>
		[ 'FETCH_NOTES', 'FETCH_TAGS', 'SEARCH', 'CHANGE_CATEGORY', 'CREATE_NOTE', 'DELETE_NOTE' ].some(
			(action) => state.loading[action]
		)
	);
	const isFirstLoop = useRef(true);

	useEffect(
		() => {
			const getNotes = async () => {
				getAccessTokenSilently().then((accessToken) => {
					dispatch(loadUser(user.name, accessToken));
					dispatch(fetchNotesAndTags(accessToken, new URLSearchParams(location.search).get('note')));
				});
			};

			if (!isLoading && isAuthenticated) getNotes();
		},
		[ isLoading, isAuthenticated ]
	);

	useEffect(
		() => {
			if (!isFirstLoop.current && !isFetching) {
				if (notes[currNoteIndex]) {
					if (noteListInfo.includes('Search')) {
						history.push(`/notes?search=${noteListInfo.slice(8)}&note=${notes[currNoteIndex].noteID}`);
					} else if (noteListInfo.includes('Tag')) {
						history.push(`/notes?tag=${noteListInfo.slice(5)}&note=${notes[currNoteIndex].noteID}`);
					} else {
						if (notes[0]) {
							history.push(`/notes?note=${notes[currNoteIndex].noteID}`);
						}
					}
				} else {
					if (noteListInfo.includes('Search')) {
						history.push(
							`/notes?search=${noteListInfo.slice(8)}
            }`
						);
					} else if (noteListInfo.includes('Tag')) {
						history.push(`/notes?tag=${noteListInfo.slice(5)}`);
					}
				}
				animateScroll.scrollTo(currNoteIndex * 80, {
					containerId: 'note-list'
					// duration: (distance) => distance ** 0.8 / 5,
				});
			}
			if (isFirstLoop.current) isFirstLoop.current = false;
		},
		[ isFetching ]
	);

	return isLoading || (isAuthenticated && isFetching) ? (
		<div
			style={{
				height: '50vh',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center'
			}}
		>
			<Loader type="ThreeDots" color="#00BFFF" height={80} width={80} />
		</div>
	) : (
		<div>
			<Navigation />
			<Row noGutters>
				<Col md="2">
					<SideBar />
				</Col>
				<Col md="10">
					<Row noGutters>
						<Col md="3">
							<NoteList />
						</Col>
						<Col md="9">
							<NotePanel />
						</Col>
					</Row>
				</Col>
			</Row>
		</div>
	);
}
// }

export default App;
