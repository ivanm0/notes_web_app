import React, { useEffect, useState, memo } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch, useSelector } from "react-redux";
import { switchCurrentNote } from "../actions/noteActions";
import { Badge } from "react-bootstrap";

const NoteList = memo(() => {
  const { isAuthenticated } = useAuth0();
  const history = useHistory();

  const notes = useSelector((state) => state.notes.items);
  const noteListInfo = useSelector((state) => state.notes.noteListInfo);
  const currNoteIndex = useSelector((state) => state.notes.currentItem);
  const isFetching = useSelector((state) => state.notes.isLoading);
  const creatingNote = useSelector((state) => state.notes.creatingNote);
  const deletingNote = useSelector((state) => state.notes.deletingNote);

  useEffect(() => {
    if (!isFetching && !deletingNote && notes[0]) {
      history.push(`/notes?note=${notes[currNoteIndex].noteID}`);
    }
  }, [deletingNote]);

  useEffect(() => {
    if (!isFetching && !creatingNote && notes[0]) {
      history.push(`/notes?note=${notes[currNoteIndex].noteID}`);
    }
  }, [creatingNote]);

  return (
    (!isFetching || !isAuthenticated) && (
      <div id="note-list">
        <div className="note-list-info">
          <h2 className="mb-2">{noteListInfo}</h2>
          <h5>{notes.length} Items</h5>
        </div>
        {notes.map((note, index) => {
          return (
            <Note
              key={note.noteID}
              index={index}
              note={note}
              current={currNoteIndex === index}
            />
          );
        })}
      </div>
    )
  );
});

export default NoteList;

const Note = ({ index, note, current }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const noteListInfo = useSelector((state) => state.notes.noteListInfo);
  let className = "note";
  if (current) className = "note current-note";

  const handleNoteClick = () => {
    if (noteListInfo.includes("Search")) {
      history.push(
        `/notes?search=${noteListInfo.slice(8)}&note=${note.noteID}`
      );
    } else if (noteListInfo.includes("Tag")) {
      history.push(`/notes?tag=${noteListInfo.slice(5)}&note=${note.noteID}`);
    } else {
      history.push(`/notes?note=${note.noteID}`);
    }
    dispatch(switchCurrentNote(index));
  };

  return (
    <div className={className} onClick={handleNoteClick}>
      <div className="mb-1">
        {note.title.trim() === "" ? "Untitled" : note.title}
      </div>
      <div>
        {note.tags &&
          note.tags.map((tag) => (
            <Badge pill variant="secondary" className="mr-2">
              {tag}
            </Badge>
          ))}
      </div>
    </div>
  );
};
