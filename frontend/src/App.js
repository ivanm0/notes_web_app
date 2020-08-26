import React, { useEffect } from "react";
import "./custom.scss";
import { useAuth0 } from "@auth0/auth0-react";
import { Row, Col } from "react-bootstrap";
import Navigation from "./components/Navigation";
import SideBar from "./components/SideBar";
import NoteList from "./components/NoteList";
import NotePanel from "./components/NotePanel";
import { useHistory, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchNotes } from "./actions/noteActions";
import { fetchTags } from "./actions/tagActions";
import { loadUser } from "./actions/userActions";
import { animateScroll } from "react-scroll";
import Loader from "react-loader-spinner";

function App() {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const {
    isAuthenticated,
    isLoading,
    user,
    getAccessTokenSilently,
  } = useAuth0();
  const notes = useSelector((state) => state.notes.items);
  const noteListInfo = useSelector((state) => state.notes.noteListInfo);
  const currNoteIndex = useSelector((state) => state.notes.currentItem);
  const fetchingNotes = useSelector((state) => state.notes.isLoading);
  const fetchingTags = useSelector((state) => state.tags.isFetching);

  useEffect(() => {
    console.log(isLoading);
    const getNotes = async () => {
      getAccessTokenSilently()
        .then((accessToken) => {
          dispatch(loadUser(user.username, accessToken));
          dispatch(
            fetchNotes(
              accessToken,
              new URLSearchParams(location.search).get("note")
            )
          );
          return accessToken;
        })
        .then((accessToken) => dispatch(fetchTags(accessToken)));
    };

    if (!isLoading && isAuthenticated) getNotes();
  }, [isLoading]);

  useEffect(() => {
    if (!fetchingNotes) {
      if (notes[currNoteIndex]) {
        if (noteListInfo.includes("Search")) {
          history.push(
            `/notes?search=${noteListInfo.slice(8)}&note=${
              notes[currNoteIndex].noteID
            }`
          );
        } else if (noteListInfo.includes("Tag")) {
          history.push(
            `/notes?tag=${noteListInfo.slice(5)}&note=${
              notes[currNoteIndex].noteID
            }`
          );
        } else {
          if (!new URLSearchParams(location.search).get("note") && notes[0]) {
            history.push(`/notes?note=${notes[currNoteIndex].noteID}`);
          }
        }
      } else {
        if (noteListInfo.includes("Search")) {
          history.push(
            `/notes?search=${noteListInfo.slice(8)}
            }`
          );
        } else if (noteListInfo.includes("Tag")) {
          history.push(`/notes?tag=${noteListInfo.slice(5)}`);
        }
      }
      animateScroll.scrollTo(currNoteIndex * 80, {
        containerId: "note-list",
        // duration: (distance) => distance ** 0.8 / 5,
      });
    }
  }, [fetchingNotes]);

  return isLoading || fetchingNotes || fetchingTags ? (
    <div
      style={{
        height: "50vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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
