import React, { useState, useRef } from 'react';
import { Button, Modal, FormControl, ListGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { createNote, fetchNotes, changeCategory } from '../actions/noteActions';
import { animateScroll } from 'react-scroll';
import { useAuth0 } from '@auth0/auth0-react';
import { createTag } from '../actions/tagActions';
import { AiOutlinePlus, AiOutlineTag, AiFillTag } from 'react-icons/ai';
import { useLocation } from 'react-router';

const SideBar = () => {
	const dispatch = useDispatch();
	const { isAuthenticated } = useAuth0();
	const accessToken = useSelector((state) => state.user.accessToken);

	const newNoteHandler = () => {
		if (isAuthenticated) dispatch(createNote(accessToken));
		animateScroll.scrollToTop({
			containerId: 'note-list',
			duration: (distance) => distance ** 0.8 / 5
		});
	};

	return (
		<div className="side-bar p-3">
			<Button
				style={{ fontSize: 'larger' }}
				block
				className="text-left py-2"
				variant="outline-primary"
				onClick={newNoteHandler}
			>
				<AiOutlinePlus className="mb-1 mr-2" />
				New Note
			</Button>
			<CategoryGroup />
		</div>
	);
};

export default SideBar;

const CategoryGroup = () => {
	const dispatch = useDispatch();
	const location = useLocation();
	const accessToken = useSelector((state) => state.user.accessToken);
	const noteListInfo = useSelector((state) => state.notes.noteListInfo);
	const tags = useSelector((state) => state.tags.items);
	const [ showNewTagModal, setShowNewTagModal ] = useState(false);
	const newTagInputRef = useRef('');

	const showModalHandler = () => {
		setShowNewTagModal(true);
		setTimeout(() => {
			newTagInputRef.current.focus();
		}, 1);
	};

	const newTagHandler = (e) => {
		if (newTagInputRef.current.value.trim() !== '' && (!e.key || e.key === 'Enter')) {
			console.log(newTagInputRef.current.value);
			dispatch(createTag(accessToken, newTagInputRef.current.value));
			setShowNewTagModal(false);
		}
	};

	const categoryClickHandler = (tag) => {
		if (tag) {
			dispatch(changeCategory(accessToken, tag));
		} else {
			dispatch(fetchNotes(accessToken, new URLSearchParams(location.search).get('note')));
		}
	};

	return (
		<div>
			<ListGroup variant="flush" style={{ borderTop: '2px solid #444' }} className="mt-3">
				<div
					className={
						noteListInfo === 'All Notes' || noteListInfo.includes('Search') ? (
							'category current-category'
						) : (
							'category'
						)
					}
					onClick={() => categoryClickHandler()}
				>
					<AiOutlineTag
						style={{
							marginLeft: '-.5rem',
							marginRight: '.75rem'
						}}
					/>
					All Notes
				</div>
				{tags &&
					tags.map((tag) => (
						<div
							className={noteListInfo === 'Tag: ' + tag ? 'category current-category' : 'category'}
							onClick={() => categoryClickHandler(tag)}
						>
							<AiOutlineTag
								style={{
									marginLeft: '-.5rem',
									marginRight: '.75rem'
								}}
							/>
							{tag}
						</div>
					))}
				<div className="category" onClick={showModalHandler}>
					<AiFillTag
						style={{
							marginLeft: '-.5rem',
							marginRight: '.75rem'
						}}
					/>
					New Tag
				</div>
			</ListGroup>
			<Modal centered show={showNewTagModal} onHide={() => setShowNewTagModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Create a new tag!</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Tag Name: <FormControl ref={newTagInputRef} onKeyPress={(e) => newTagHandler(e)} />
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowNewTagModal(false)}>
						Close
					</Button>
					<Button variant="primary" onClick={(e) => newTagHandler(e)}>
						Create
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};
