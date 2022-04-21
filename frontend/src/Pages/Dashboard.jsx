import React from "react";
import { Navigate, Link } from "react-router-dom";

// <Container> adds padding to the sides of the page content, makes it look nicer
import Container from "react-bootstrap/Container";

// <Button> is a general purpose button with many different styles, see react-bootstrap.github.io/components/buttons/
import Button from "react-bootstrap/Button";

// api.jsx contains utility functions for getting or sending data from the frontend to the backend
// For example, sending form data or getting user info
import { backendIsAuthorized } from "../api.jsx";

class Dashboard extends React.Component {

	constructor(props) {
		super(props); // Call React.Component's constructor as well as our own constructor
		this.state = { // "this.state" variables automatically update the website whenever they get changed
			loggedIn: true // Assume user is logged in to avoid redirecting them early
		}
	}

	componentDidMount() {
		backendIsAuthorized().catch(() => this.setState({
			// Redirect to /login if user isn't logged in yet
			loggedIn: false
		}));
	}

	render() {
		return (
			// <Container> adds padding around the website content, makes it look nicer
			<Container>
				{/* Navigate to /login if user isn't logged in yet */}
				{this.state.loggedIn ? null : <Navigate to="/login"/>}
				{/* "mb-4" is a Bootstrap CSS class for setting margin-bottom, see getbootstrap.com/docs/5.1/utilities/spacing/ */}
				<h1 className="mb-4">Dashboard Test</h1>
				{/* <Link> redirects to a different page when clicked */}
				<Link to="/requestcallout">
					{/* variant="primary" makes the button pink, see react-bootstrap.github.io/components/buttons/ for more colours */}
					<Button variant="primary">Request Callout</Button>
				</Link>
			</Container>
		);
	}
}

export default Dashboard;