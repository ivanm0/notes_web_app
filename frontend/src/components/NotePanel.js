import React, { useRef, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Row, Col, Dropdown, SplitButton, OverlayTrigger, Popover, ListGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
	editCurrentNoteTitle,
	editCurrentNoteBody,
	finishSwitching,
	saveToDatabase,
	deleteNote,
	addTag,
	removeTag
} from '../actions/noteActions';
import { useAuth0 } from '@auth0/auth0-react';
import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im';

const NotePanel = () => {
	const dispatch = useDispatch();
	const { isAuthenticated } = useAuth0();
	const accessToken = useSelector((state) => state.user.accessToken);
	const isSwitchingNotes = useSelector((state) => state.loading['CHANGE_NOTE']);
	const creatingNote = useSelector((state) => state.loading['CREATE_NOTE']);
	const currNoteIndex = useSelector((state) => state.notes.currentItem);
	const note = useSelector((state) => state.notes.items[currNoteIndex]);
	const titleRef = useRef(null);
	const bodyRef = useRef(null);
	const actualBodyRef = useRef(null);
	const timeoutRef = useRef();

	const handleEditorChange = (content, editor) => {
		if (!isSwitchingNotes && [ 'title', 'body' ].includes(editor.id)) {
			let update = [ content, note.body ];
			if (editor.id === 'title') {
				dispatch(editCurrentNoteTitle(content));
			} else {
				dispatch(editCurrentNoteBody(content));
				update = [ note.title, content ];
			}
			clearTimeout(timeoutRef.current);
			timeoutRef.current = setTimeout(() => {
				if (isAuthenticated) {
					dispatch(saveToDatabase(accessToken, note.noteID, ...update));
				}
			}, 1000);
		}
	};

	useEffect(
		() => {
			if (creatingNote === false && titleRef.current) titleRef.current.focus();
		},
		[ creatingNote ]
	);

	useEffect(
		() => {
			if (isSwitchingNotes) {
				if (bodyRef.current || actualBodyRef.current) {
					if (bodyRef.current) actualBodyRef.current = bodyRef.current;
					actualBodyRef.current.focus();
					actualBodyRef.current.editorManager.activeEditor.selection.select(
						actualBodyRef.current.editorManager.activeEditor.getBody(),
						true
					);
					actualBodyRef.current.editorManager.activeEditor.selection.collapse(false);
				}
				dispatch(finishSwitching());
			}
		},
		[ isSwitchingNotes ]
	);

	return note ? (
		<div className="note-panel">
			<Row noGutters style={{ paddingRight: '1rem' }}>
				<Col md="9">
					<Editor
						id="title"
						apiKey="jad1xulh0gn6tbhbua9lj849bdw60snht2f7rp0ba5thnb2k"
						value={note && note.title}
						outputFormat="text"
						init={{
							setup: (editor) => (titleRef.current = editor),
							placeholder: 'Untitled',
							inline: true,
							menubar: false,
							toolbar: false,
							forced_root_block_attrs: {
								style:
									'margin-top: 2px; margin-bottom: 2px; margin-left: 12px; font-size: xx-large; font-weight: bold'
							}
						}}
						onEditorChange={handleEditorChange}
					/>
				</Col>
				<Col md="3" className="note-panel-header">
					<NotePanelOptions />
				</Col>
			</Row>
			{
				<Editor
					id="body"
					apiKey="jad1xulh0gn6tbhbua9lj849bdw60snht2f7rp0ba5thnb2k"
					value={note && note.body}
					onFocus={function(e) {
						var val = e.target.value;
						e.target.value = '';
						e.target.value = val;
					}}
					init={{
						setup: (editor) => (bodyRef.current = editor),
						minHeight: '120%',
						placeholder: 'Jot down your thoughts here...',
						height: '100%',
						menubar: false,
						plugins: [
							'advlist autolink lists link image charmap print preview anchor',
							'searchreplace visualblocks code fullscreen',
							'insertdatetime media table paste code help wordcount'
						],
						toolbar:
							'undo redo | formatselect | fontsizeselect | fontselect | bold italic underline backcolor | \
             alignleft aligncenter alignright alignjustify | \
             bullist numlist outdent indent | link code removeformat | help'
					}}
					onEditorChange={handleEditorChange}
				/>
			}
		</div>
	) : null;
};

export default NotePanel;

const NotePanelOptions = () => {
	const dispatch = useDispatch();
	const { isAuthenticated } = useAuth0();
	const accessToken = useSelector((state) => state.user.accessToken);
	const currNoteIndex = useSelector((state) => state.notes.currentItem);
	const note = useSelector((state) => state.notes.items[currNoteIndex]);
	const tags = useSelector((state) => state.tags.items);

	const tagHandler = (tag) => {
		const action = note.tags && note.tags.includes(tag) ? removeTag : addTag;
		if (isAuthenticated) dispatch(action(accessToken, note.noteID, tag));
	};

	const popover = (
		<Popover id="popover-basic">
			<Popover.Content>
				<ListGroup>
					{tags.map((tag) => (
						<ListGroup.Item action onClick={() => tagHandler(tag)}>
							{note.tags && note.tags.includes(tag) ? (
								<ImCheckboxChecked style={{ marginBottom: '3px' }} />
							) : (
								<ImCheckboxUnchecked style={{ marginBottom: '3px' }} />
							)}
							<span className="ml-3">{tag}</span>
						</ListGroup.Item>
					))}
				</ListGroup>
			</Popover.Content>
		</Popover>
	);

	return (
		<OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
			<SplitButton
				className="my-auto ml-auto mr-3"
				variant="secondary"
				size="sm"
				title="Add Tag"
				id="dropdown-menu-align-right"
			>
				<Dropdown.Item
					as="button"
					style={{ textAlign: 'right' }}
					variant="danger"
					onClick={() => isAuthenticated && dispatch(deleteNote(accessToken, note.noteID))}
				>
					Delete Note
				</Dropdown.Item>
			</SplitButton>
		</OverlayTrigger>
	);
};
