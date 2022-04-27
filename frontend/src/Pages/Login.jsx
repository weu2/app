import React from "react";
import { Navigate } from "react-router-dom";

// <Alert> is useful for displaying success or error messages, see react-bootstrap.github.io/components/alerts/
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";

// <Container> adds padding to the sides of the page content, makes it look nicer
import Container from "react-bootstrap/Container";

// <LargeButton> is a subclass of React Bootstrap's <Button> with an icon added to the right side
import LargeButton from "../Components/LargeButton";

// api.jsx contains utility functions for getting or sending data from the frontend to the backend
// For example, sending form data or getting user info
import { backendLogin } from "../api.jsx";

class Login extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			loggedIn: false, // Assume the user is not logged in yet, redirect later
			error: null, // Display failure message if an error occurs
			validated: false // Shows feedback messages to show the user if they screwed up the form, see react-bootstrap.github.io/forms/validation/
		};
	}

	submitForm = (event) => {
		// Prevent form submission from refreshing the page, since we send the data manually
		event.preventDefault();

		const form = event.currentTarget;
		if (form.checkValidity()) {
			// Manually send form data to backend
			backendLogin(new FormData(form))
				.then(() => {
					this.setState({
						// Redirect to /dashboard
						loggedIn: true
					})
					// Send user info to the navigation bar
					document.dispatchEvent(new Event("loggedIn"));
				}).catch(async(res) => this.setState({
					// Show error message
					error: `Error: ${res.status} (${res.statusText}) ${await res.text()}`
				}));
		}
		// Show feedback messages if required, see react-bootstrap.github.io/forms/validation/
		this.setState({ validated: true });
	}

	render() {
		return (
			// <Container> adds padding around the website content, makes it look nicer
			<Container>
				{/* "mb-4" is a Bootstrap CSS class for setting margin-bottom, see getbootstrap.com/docs/5.1/utilities/spacing/ */}
				<h2 className="mb-4">Login</h2>

				{/* Redirect to /dashboard once the user has logged in */}
				{this.state.loggedIn ? <Navigate to="/dashboard"/> : null}

				{/* Display an error message if required */}
				{this.state.error ? <Alert variant="danger">{this.state.error}</Alert> : null}

				{/* Form validation and submission is done manually, see react-bootstrap.github.io/forms/validation/ */}
				<Form noValidate validated={this.state.validated} onSubmit={this.submitForm}>

					{/* Each form group typically contains one label and one input, see react-bootstrap.github.io/forms/overview/ */}
					<Form.Group className="mb-3" controlId="formEmail">
						<Form.Label>Email</Form.Label>
						<Form.Control
							name="email"
							type="email" // Standard HTML input type, for valid values check www.w3schools.com/html/html_form_input_types.asp
							autoComplete="email" // autocomplete is not essential, but for suggested values check developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
							required
						/>
						{/* Display feedback message if the user screws up the input, see react-bootstrap.github.io/forms/validation/ */}
						<Form.Control.Feedback type="invalid">
							Please provide an email.
						</Form.Control.Feedback>
					</Form.Group>

					<Form.Group className="mb-4" controlId="formPassword">
						<Form.Label>Password</Form.Label>
						<Form.Control
							name="password"
							type="password" // Standard HTML input type, for valid values check www.w3schools.com/html/html_form_input_types.asp
							autoComplete="current-password" // autocomplete is not essential, but for suggested values check developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
							required
						/>
						{/* Display feedback message if the user screws up the input, see react-bootstrap.github.io/forms/validation/ */}
						<Form.Control.Feedback type="invalid">
							Please choose a password.
						</Form.Control.Feedback>
					</Form.Group>

					{/* type="submit" automatically runs onSubmit, which runs this.submitForm */}
					<LargeButton variant="primary" type="submit" icon="arrow-right">
						Login
					</LargeButton>
				</Form>
			</Container>
		);
	}
}

export default Login;