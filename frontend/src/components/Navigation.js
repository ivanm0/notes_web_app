import React, { useRef } from 'react';
import { useLocation } from 'react-router';
import { Navbar, Col, InputGroup, FormControl, Button } from 'react-bootstrap';
import { useAuth0 } from '@auth0/auth0-react';
import { logoutUser } from '../actions/userActions';
import { searchNotes, exitSearch, fetchNotes } from '../actions/noteActions';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineClose } from 'react-icons/ai';

const Navigation = () => {
	const { isAuthenticated } = useAuth0();

	return (
		<Navbar bg="dark" variant="dark" className="nav">
			<Navbar.Collapse id="basic-navbar-nav">
				<Col md="2">
					<Navbar.Brand style={{ fontSize: '1.5rem' }} className="brand" href="/">
						IM.notes
					</Navbar.Brand>
				</Col>
				<Col md="7">{isAuthenticated && <SearchBar />}</Col>
				<Col md="3" align="right">
					<LoginControl />
				</Col>
			</Navbar.Collapse>
		</Navbar>
	);
};

export default Navigation;

const SearchBar = () => {
	const location = useLocation();
	const dispatch = useDispatch();
	const searchRef = useRef(null);
	const accessToken = useSelector((state) => state.user.accessToken);
	const noteListInfo = useSelector((state) => state.notes.noteListInfo);

	const handleSearch = (event) => {
		if (event.key === 'Enter' && searchRef.current.value.trim() !== '') {
			dispatch(searchNotes(accessToken, searchRef.current.value));
		}
	};

	const handleExitSearch = () => {
		searchRef.current.value = '';
		if (noteListInfo.includes('Search')) {
			dispatch(exitSearch());
			dispatch(fetchNotes(accessToken, new URLSearchParams(location.search).get('note')));
		}
	};

	return (
		<InputGroup>
			<FormControl
				placeholder="Search"
				aria-label="Search"
				aria-describedby="basic-addon2"
				ref={searchRef}
				onKeyPress={handleSearch}
			/>
			<InputGroup.Append>
				<Button variant="secondary" onClick={handleExitSearch}>
					<AiOutlineClose style={{ marginBottom: '.2rem' }} />
				</Button>
			</InputGroup.Append>
		</InputGroup>
	);
};

const LoginControl = () => {
	const { isAuthenticated } = useAuth0();
	if (isAuthenticated) {
		return <LogoutButton />;
	} else {
		return <LoginButton />;
	}
};

const LoginButton = () => {
	const { loginWithRedirect } = useAuth0();

	return <Button onClick={() => loginWithRedirect()}>Log In</Button>;
};

const LogoutButton = () => {
	const dispatch = useDispatch();
	const { logout } = useAuth0();

	const handleLogout = () => {
		logout();
		dispatch(logoutUser());
	};

	return <Button onClick={handleLogout}>Log Out</Button>;
};
