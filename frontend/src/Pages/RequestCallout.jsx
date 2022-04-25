import React from "react";
import { Navigate } from "react-router-dom";

// <Container> adds padding to the sides of the page content, makes it look nicer
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";

// <LargeButton> is a subclass of React Bootstrap's <Button> with an icon added to the right side
import LargeButton from "../Components/LargeButton";

// api.jsx contains utility functions for getting or sending data from the frontend to the backend
// For example, sending form data or getting user info
import { backendGetUserType } from "../api.jsx";

class RequestCallout extends React.Component {

	constructor(props) {
		super(props); // Call React.Component's constructor as well as our own constructor
		this.state = { // "this.state" variables automatically update the website whenever they get changed
			canView: true // Assume user can view page to avoid redirecting early
		}
	}

	componentDidMount() {
		backendGetUserType()
			.then(res => this.setState({
				// Redirect to /login if user isn't a customer
				canView: res.type === "CUSTOMER"
			})).catch(() => this.setState({
				// Redirect to /login if user isn't logged in yet
				canView: false
			}));
	}

	render() {
		return (
			<Container>
				{this.state.canView ? null : <Navigate to="/login"/>}
				<h1 className="mb-4">Request Callout</h1>
				{/* From class diagram we need these variables
					id - get from backend
					Date - find automatically
							vehicle - entered by user
					Customer - from page data
					Service professional - found by system
					cost - calculated by system
					locationLat - found by system
					locationLong - found by system
				*/}
				
				<Form noValidate validated={this.state.validated} onSubmit={this.submitForm}>
					<Form.Group className="mb-3">
				
						<Form.Label>Vehicle Registration Number</Form.Label>
						<Form.Control
							name="registrationNum"
							type="registrationNum"
							autoComplete="registrationNum"
							onChange={this.changeHandler}
							required
						/>
					{/* display the current date */}
					<Form.Label>Date: {(new Date().toLocaleString() + "").substring(0, 10)}</Form.Label>

					<Form.Text className="text-muted"><p>TO DO: LOCATION HERE</p></Form.Text>

					</Form.Group>

					{/* TO DO
						Update state
						Pass variables to back end
						Navigate to next page*/}
					<LargeButton variant="primary" type="submit" icon="arrow-right">
						Request Callout
					</LargeButton>
				</Form>

			</Container>
		);
	}
}

export default RequestCallout;