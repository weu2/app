import React from "react";
import { Navigate } from "react-router-dom";

// <Container> adds padding to the sides of the page content, makes it look nicer
import Container from "react-bootstrap/Container";

// <Alert> is useful for displaying success or error messages, see react-bootstrap.github.io/components/alerts/
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";

// <LargeButton> is a subclass of React Bootstrap's <Button> with an icon added to the right side
import LargeButton from "../Components/LargeButton";
import LocationInput from "../Components/LocationInput";

// api.jsx contains utility functions for getting or sending data from the frontend to the backend
// For example, sending form data or getting user info
import { backendGetUserInfo, backendCreateCallout } from "../api.jsx";

class RequestCallout extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			loggedIn: true, // Assume user can view page to avoid redirecting early
			validated: false, // Shows feedback messages to show the user if they screwed up the form, see react-bootstrap.github.io/forms/validation/
			error: null, // Display failure message if an error occurs
			submitted: false // Redirects to /dashboard
		};
	}

	componentDidMount() {
		backendGetUserInfo()
			.then(res => this.setState({
				// Redirect to /login if user isn't a customer
				loggedIn: res.type === "CUSTOMER"
			})).catch(() => this.setState({
				// Redirect to /login if user isn't logged in yet
				loggedIn: false
			}));
	}

	submitForm = (event) => {
		// Prevent form submission from refreshing the page, since we send the data manually
		event.preventDefault();

		const form = event.currentTarget;
		if (form.checkValidity()) {
			// Manually send form data to backend
			backendCreateCallout(new FormData(form))
				.then(() => this.setState({
					// Redirect to /dashboard
					submitted: true
				})).catch(async(res) => this.setState({
					// Show error message
					error: `Error: ${res.status} (${res.statusText}) ${await res.text()}`
				}));
		}
		// Show validation messages if required
		this.setState({ validated: true });
	}

	render() {
		return (
			// <Container> adds padding around the website content, makes it look nicer
			<Container>
				{/* "mb-4" is a Bootstrap CSS class for setting margin-bottom, see getbootstrap.com/docs/5.1/utilities/spacing/ */}
				<h2 className="mb-4">Request Callout</h2>

				{/* Redirect to /login if the user cannot view this page */}
				{this.state.loggedIn ? null : <Navigate to="/login"/>}

				{/* Redirect to /dashboard after form submission */}
				{this.state.submitted ? <Navigate to="/dashboard"/> : null}

				{/* Display an error message if required */}
				{this.state.error ? <Alert variant="danger">{this.state.error}</Alert> : null}

				{/* Form validation and submission is done manually, see react-bootstrap.github.io/forms/validation/ */}
				<Form noValidate validated={this.state.validated} onSubmit={this.submitForm}>

					{/* Each form group typically contains one label and one input, see react-bootstrap.github.io/forms/overview/ */}
					<Form.Group className="mb-3" controlId="formNumberPlate">
						<Form.Label>Number Plate</Form.Label>
						<Form.Control
							name="numberPlate"
							type="text" // Standard HTML input type, for valid values check www.w3schools.com/html/html_form_input_types.asp
							autoComplete="numberplate" // autocomplete is not essential, but for suggested values check developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
							required
						/>
						{/* Display feedback message if the user screws up the input, see react-bootstrap.github.io/forms/validation/ */}
						<Form.Control.Feedback type="invalid">
							Please provide your number plate.
						</Form.Control.Feedback>
					</Form.Group>

					<Form.Group className="mb-3" controlId="formDescription">
						<Form.Label>Description</Form.Label>
						<Form.Control
							name="description"
							type="text" // Standard HTML input type, for valid values check www.w3schools.com/html/html_form_input_types.asp
							as="textarea"
							rows={4}
							required
						/>
						{/* Display feedback message if the user screws up the input, see react-bootstrap.github.io/forms/validation/ */}
						<Form.Control.Feedback type="invalid">
							Please provide a description.
						</Form.Control.Feedback>
					</Form.Group>

					<LocationInput className="mb-3" />

					{/* Include date automatically */}
					<Form.Control name="dateTime" type="hidden" required value={Date.now()} />

					{/* type="submit" automatically runs onSubmit, which runs this.submitForm */}
					<LargeButton className="mb-3" variant="primary" type="submit" icon="arrow-right">
						Submit
					</LargeButton>
				</Form>
			</Container>
		);
	}
}

export default RequestCallout;