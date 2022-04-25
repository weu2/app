import React from "react";
import { Navigate, Link } from "react-router-dom";

// <Container> adds padding to the sides of the page content, makes it look nicer
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Callout from "../Components/Callout";

// api.jsx contains utility functions for getting or sending data from the frontend to the backend
// For example, sending form data or getting user info
import { backendGetCallouts } from "../api.jsx";

class Dashboard extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			loggedIn: true, // Assume user can view page to avoid redirecting early
			callouts: null // Store all listed callouts
		}
	}

	componentDidMount() {
		backendGetCallouts()
			.then(res => this.setState({
				callouts: res
			})).catch(() => this.setState({
				// Redirect to /login if user isn't logged in yet
				loggedIn: false
			}));
	}

	generateCallouts() {
		// Create a <Callout> component to display each callout
		return this.state.callouts.map((callout, index) =>
			<Callout className="mb-3" callout={callout} key={callout.uuid} index={index + 1} />
		);
	}

	render() {
		return (
			// <Container> adds padding around the website content, makes it look nicer
			<Container>
				{/* "mb-4" is a Bootstrap CSS class for setting margin-bottom, see getbootstrap.com/docs/5.1/utilities/spacing/ */}
				<h1 className="mb-4">
					{/* Logos are stored as vector art for the best possible quality
					"/logo.svg" is the shorthand for "/public/logo.svg" */}
					Welcome to <img src="/logo.svg" width="128" alt="WeU"/>
				</h1>

				{/* Redirect to /login if the user is not logged in yet */}
				{this.state.loggedIn ? null : <Navigate to="/login"/>}

				{/* Display callouts if they exist */}
				{
					this.state.callouts
					? this.generateCallouts()
					: <p>Callouts will be listed here.</p>
				}
				<Link to="/requestcallout">
					<Button variant="primary">
						Request Callout
					</Button>
				</Link>
			</Container>
		);
	}
}

export default Dashboard;