import React from "react";
import { Link, NavLink } from "react-router-dom";

// <Container> adds padding to the sides of the page content, makes it look nicer
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
			firstName: null,
			userInfo: null
		};
	}

	componentDidMount() {
		// Use custom event to update navigation bar from login page
		document.addEventListener("loggedIn", () => {
			this.setState({ loggedIn: true });
			this.fetchUserInfo();
		});
		
		// Use custom event to update navigation bar from profile page
		document.addEventListener("updateFirstName", event => {
			this.setState({ firstName: event.detail.name });
		});

		if (this.state.loggedIn) {
			this.fetchUserInfo();
		}
	}

	fetchUserInfo = () => {
		backendGetUserInfo()
			.then(res => this.setState({
				userInfo: res,
				firstName: res.firstName
			}));
	}

	signOut = () => {
		// Clear claim cookie, signing out the user
		document.cookie = "claim=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		// Force navigation bar to refresh
		this.setState({
			loggedIn: false,
			userInfo: null,
			firstName: null
		});
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
									<Nav.Link as={NavLink} to="/dashboard">Dashboard</Nav.Link>
									{
										(this.state.userInfo && this.state.userInfo.CUSTOMER)
										? <>
											<Nav.Link as={NavLink} to="/requestcallout">Request Callout</Nav.Link>
											<Nav.Link as={NavLink} to="/membership">Membership</Nav.Link>
										</>
										: null
									}
									{
										(this.state.userInfo && this.state.userInfo.PROFESSIONAL)
										? <Nav.Link as={NavLink} to="/findcallouts">Find Callouts</Nav.Link>
										: null
									}
									<Nav.Link as={NavLink} to="/reviews">Reviews</Nav.Link>
									<Nav.Link as={NavLink} to="/reports">Reports</Nav.Link>
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
								{
									this.state.userInfo
									&& <Navbar.Collapse>
										<Navbar.Text className="me-1">Hello, {this.state.firstName}</Navbar.Text>
									</Navbar.Collapse>
								}
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