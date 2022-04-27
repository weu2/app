import React from "react";
import { Link, NavLink } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";

// Top navigation bar is included on every page, included in index.jsx
class NavigationBar extends React.Component {

	componentDidMount() {
		// Use custom event to navigation bar from login page
		document.addEventListener("updateNavBar", () => this.forceUpdate());
	}

	signOut = () => {
		// Clear claim cookie, signing out the user
		document.cookie = "claim=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		// Force navigation bar to refresh
		this.forceUpdate();
	}

	loggedIn() {
		return document.cookie.includes("claim");
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
								this.loggedIn()
								? <>
									<Nav.Link as={NavLink} to="/dashboard">Dashboard</Nav.Link>
									<Nav.Link as={NavLink} to="/requestcallout">Request Callout</Nav.Link>
								</>
								: <>
									<Nav.Link as={NavLink} to="/login">Login</Nav.Link>
									<Nav.Link as={NavLink} to="/register">Register</Nav.Link>
								</>
							}
						</Nav>
						{
							this.loggedIn()
							? <Nav>
								<NavDropdown title={<FontAwesomeIcon icon={faCircleUser} size="2x" />}>
									<NavDropdown.Item as={Link} to="/profile">My Profile</NavDropdown.Item>
									<NavDropdown.Divider/>
									<NavDropdown.Item as={Link} to="/login" onClick={this.signOut}>Sign Out</NavDropdown.Item>
								</NavDropdown>
							</Nav>
							: null
						}
					</Navbar.Collapse>
				</Container>
			</Navbar>
		);
	}
}

export default NavigationBar;