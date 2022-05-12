import React from "react";
import { Link, NavLink } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";

// api.jsx contains utility functions for getting or sending data from the frontend to the backend
// For example, sending form data or getting user info
import { backendGetUserInfo } from "../api.jsx";

// Top navigation bar is included on every page, included in index.jsx
class NavigationBar extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			loggedIn: document.cookie.includes("claim"),
			userInfo: null
		};
	}

	componentDidMount() {
		// Use custom event to navigation bar from login page
		document.addEventListener("loggedIn", () => {
			this.setState({ loggedIn: true });
			this.fetchUserInfo();
		});
		if (this.state.loggedIn) {
			this.fetchUserInfo();
		}
	}

	fetchUserInfo = () => {
		backendGetUserInfo()
			.then(res => this.setState({ userInfo: res }));
	}

	signOut = () => {
		// Clear claim cookie, signing out the user
		document.cookie = "claim=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		// Force navigation bar to refresh
		this.setState({ loggedIn: false, userInfo: null });
	}

	render() {
		return (
			<Navbar bg="primary" variant="light" expand="lg" className="mb-5">
				{/* Use <Container fluid> to make it take up the whole width */}
				<Container>
					<Navbar.Brand href="/">
						{/* Special logo variant with larger outline to contrast against the background */}
						<img
							src="/logo_navbar.svg"
							width="88"
							height="48"
							className="d-inline-block align-top"
							alt="WeU"
						/>
					</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse>
						<Nav className="me-auto">
							{/* React Router's <NavLink> changes pages much faster */}
							{
								this.state.loggedIn
								? <>
									{
										this.state.userInfo  
										? <Nav.Link as={NavLink} to="/dashboard">Hello, {this.state.userInfo.firstName}</Nav.Link>
										: null
									}
									{
										(this.state.userInfo && this.state.userInfo.CUSTOMER)
										? <Nav.Link as={NavLink} to="/requestcallout">Request Callout</Nav.Link>
										: null
									}
									{
										(this.state.userInfo && this.state.userInfo.PROFESSIONAL)
										? <Nav.Link as={NavLink} to="/findcallouts">Find Callouts</Nav.Link>
										: null
									}
								</>
								: <>
									<Nav.Link as={NavLink} to="/login">Login</Nav.Link>
									<Nav.Link as={NavLink} to="/register">Register</Nav.Link>
								</>
							}
						</Nav>
						{
							this.state.loggedIn
							&& <Nav>
								<NavDropdown title={<FontAwesomeIcon icon={faCircleUser} size="2x" />}>
									<NavDropdown.Item as={Link} to="/profile">My Profile</NavDropdown.Item>
									<NavDropdown.Divider/>
									<NavDropdown.Item as={Link} to="/login" onClick={this.signOut}>Sign Out</NavDropdown.Item>
								</NavDropdown>
							</Nav>
						}
					</Navbar.Collapse>
				</Container>
			</Navbar>
		);
	}
}

export default NavigationBar;