import React from "react";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";

// Top navigation bar, included on every page (found in index.jsx)
class NavigationBar extends React.Component {

	render() {
		// Use <Container fluid> to make this take up the whole width
		return (
			<Navbar bg="primary" variant="light" expand="lg" className="mb-5">
				<Container>
					<Navbar.Brand href="./">
						<img
							src="/logo_navbar.svg"
							width="88"
							height="48"
							className="d-inline-block align-top"
							alt="WeU"
						/>
					</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						<Nav className="me-auto">
							<Nav.Link href="./login">Login</Nav.Link>
							<Nav.Link href="./register">Register</Nav.Link>
							<Nav.Link href="./locationtest">Location Test</Nav.Link>
						</Nav>
						<Nav>
							<NavDropdown
								title={<FontAwesomeIcon icon={faCircleUser} size="2x" />}
								id="basic-nav-dropdown"
							>
								<NavDropdown.Item href="./profile">My Profile</NavDropdown.Item>
								<NavDropdown.Divider/>
								<NavDropdown.Item href="./signout">Sign Out</NavDropdown.Item>
							</NavDropdown>
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		);
	}
}

export default NavigationBar;