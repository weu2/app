import React from "react";
import { Navigate, Link } from "react-router-dom";

// <Container> adds padding to the sides of the page content, makes it look nicer
import Container from "react-bootstrap/Container";

// <Button> is a general purpose button with many different styles, see react-bootstrap.github.io/components/buttons/
import Button from "react-bootstrap/Button";

// api.jsx contains utility functions for getting or sending data from the frontend to the backend
// For example, sending form data or getting user info
import { backendGetUserType } from "../api.jsx";

class Dashboard extends React.Component {

	constructor(props) {
		super(props); // Call React.Component's constructor as well as our own constructor
		this.state = { // "this.state" variables automatically update the website whenever they get changed
			loggedIn: true, // Assume user is logged in to avoid redirecting them early
			userType: null // "CUSTOMER" or "PROFESSIONAL"
		}
	}

	componentDidMount() {
		backendGetUserType()
			.then(res => this.setState({
				// Show different buttons depending whether the user is logged in
				userType: res.type
			})).catch(() => this.setState({
				// Redirect to /login if user isn't logged in yet
				loggedIn: false
			}));
	}

	render() {
		return (
			// <Container> adds padding around the website content, makes it look nicer
			<Container>
				{/* Redirect to /login if the user is not logged in yet */}
				{this.state.loggedIn ? null : <Navigate to="/login"/>}

				{/* "mb-4" is a Bootstrap CSS class for setting margin-bottom, see getbootstrap.com/docs/5.1/utilities/spacing/ */}
				<h1 className="mb-4">Dashboard</h1>
				
				{/* Show "Request Callout" button if the user is a customer */}
				{
					this.state.userType === "CUSTOMER"
					? <Link to="/requestcallout">
						<Button variant="primary">
							Request Callout
						</Button>
					</Link>
					: null
				}
				{/* Show "View Callouts" button if the user is a service professional */}
				{
					this.state.userType === "PROFESSIONAL"
					? <Link to="/viewcallouts">
						<Button variant="primary">
							View Callouts
						</Button>
					</Link>
					: null
				}
			</Container>
		);
	}
}

export default Dashboard;