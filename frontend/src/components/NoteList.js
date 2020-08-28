import React, { useEffect, memo } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { switchCurrentNote } from '../actions/noteActions';
import { Badge } from 'react-bootstrap';
import moment from 'moment';

const NoteList = memo(() => {
	const notes = useSelector((state) => state.notes.items);
	const noteListInfo = useSelector((state) => state.notes.noteListInfo);
	const currNoteIndex = useSelector((state) => state.notes.currentItem);

	return (
		<div id="note-list">
			<div className="note-list-info">
				<h2 className="mb-2">{noteListInfo}</h2>
				<h5>{notes.length} Items</h5>
			</div>
			{notes.map((note, index) => {
				return <Note key={note.noteID} index={index} note={note} current={currNoteIndex === index} />;
			})}
		</div>
	);
});

export default NoteList;

const Note = ({ index, note, current }) => {
	const history = useHistory();
	const dispatch = useDispatch();
	const noteListInfo = useSelector((state) => state.notes.noteListInfo);
	let className = 'note';
	if (current) className = 'note current-note';

	const handleNoteClick = () => {
		if (/^Search.*/.test(noteListInfo)) {
			history.push(`/notes?search=${noteListInfo.slice(8)}&note=${note.noteID}`);
		} else if (/^Tag.*/.test(noteListInfo)) {
			history.push(`/notes?tag=${noteListInfo.slice(5)}&note=${note.noteID}`);
		} else {
			history.push(`/notes?note=${note.noteID}`);
		}
		dispatch(switchCurrentNote(index));
	};

	return (
		<div className={className} onClick={handleNoteClick}>
			<div
				className="mb-2"
				style={{ overflow: 'hidden', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}
			>
				<p
					style={{
						float: 'left',
						width: '75%',
						textOverflow: 'ellipsis',
						whiteSpace: 'nowrap',
						overflow: 'hidden'
					}}
				>
					{note.title.trim() === '' ? 'Untitled' : note.title}
				</p>
				<small style={{ float: 'right', width: '20%', textAlign: 'right' }}>
					{moment.unix(note.lastEditTimestamp).format('MM/DD/YY')}
				</small>
			</div>
			<div>
				{note.tags &&
					note.tags.map((tag) => (
						<Badge pill key={tag} variant="secondary" className="mr-2">
							{tag}
						</Badge>
					))}
			</div>
		</div>
	);
};
