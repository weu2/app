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
import { backendGetUserInfo, backendUpdate } from "../api.jsx";

class Profile extends React.Component {

	constructor(props) {
		super(props); // Call React.Component's constructor as well as our own constructor
		this.state = { // "this.state" variables automatically update the website whenever they get changed
			email: "", // To autofill inputs from existing user info
			firstName: "",
			lastName: "",
			address: "",
			phoneNumber: "",
			license: "",
			error: null, // Display failure message if an error occurs
			loggedIn: true, // Assume the user is not logged in yet
			updated: false, // Displays an "updated" alert when the details are updated successfully
			validated: false // Shows feedback messages to show the user if they screwed up the form, see react-bootstrap.github.io/forms/validation/
		};
	}

	componentDidMount() {
		backendGetUserInfo()
			.then(res => this.setState({
				email: res.email, // Autofill inputs from existing user info
				firstName: res.firstName,
				lastName: res.lastName,
				address: res.address,
				phoneNumber: res.phoneNumber,
				license: res.license
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
			backendUpdate(new FormData(form))
				.then(() => this.setState({
					// Show "updated" alert
					updated: true
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
				<h2 className="mb-4">My Profile</h2>

				{/* Redirect to /login if the user is not logged in yet */}
				{this.state.loggedIn ? null : <Navigate to="/login"/>}

				{/* Show alert to indicate their account was updated */}
				{this.state.updated ? <Alert variant="success">Updated your profile!</Alert> : null}

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
							autoComplete="email"
							defaultValue={this.state.email}
							required
						/>
						{/* Display feedback message if the user screws up the input, see react-bootstrap.github.io/forms/validation/ */}
						<Form.Control.Feedback type="invalid">
							Please provide an email.
						</Form.Control.Feedback>
					</Form.Group>

					<Form.Group className="mb-3" controlId="formFirstName">
						<Form.Label>First Name</Form.Label>
						<Form.Control
							name="firstName"
							type="text" // Standard HTML input type, for valid values check www.w3schools.com/html/html_form_input_types.asp
							autoComplete="given-name"
							defaultValue={this.state.firstName}
							required
						/>
						{/* Display feedback message if the user screws up the input, see react-bootstrap.github.io/forms/validation/ */}
						<Form.Control.Feedback type="invalid">
							Please provide your first name.
						</Form.Control.Feedback>
					</Form.Group>

					<Form.Group className="mb-3" controlId="formLastName">
						<Form.Label>Last Name</Form.Label>
						<Form.Control
							name="lastName"
							type="text" // Standard HTML input type, for valid values check www.w3schools.com/html/html_form_input_types.asp
							autoComplete="family-name"
							defaultValue={this.state.lastName}
							required
						/>
						{/* Display feedback message if the user screws up the input, see react-bootstrap.github.io/forms/validation/ */}
						<Form.Control.Feedback type="invalid">
							Please provide your last name.
						</Form.Control.Feedback>
					</Form.Group>

					<Form.Group className="mb-3" controlId="formAddress">
						<Form.Label>Address</Form.Label>
						<Form.Control
							name="address"
							type="text" // Standard HTML input type, for valid values check www.w3schools.com/html/html_form_input_types.asp
							autoComplete="street-address"
							defaultValue={this.state.address}
							required
						/>
						{/* Display feedback message if the user screws up the input, see react-bootstrap.github.io/forms/validation/ */}
						<Form.Control.Feedback type="invalid">
							Please provide your address.
						</Form.Control.Feedback>
					</Form.Group>

					<Form.Group className="mb-3" controlId="formPhoneNumber">
						<Form.Label>Phone Number</Form.Label>
						<Form.Control
							name="phoneNumber"
							type="tel" // Standard HTML input type, for valid values check www.w3schools.com/html/html_form_input_types.asp
							autoComplete="tel"
							defaultValue={this.state.phoneNumber}
							required
						/>
						{/* Display feedback message if the user screws up the input, see react-bootstrap.github.io/forms/validation/ */}
						<Form.Control.Feedback type="invalid">
							Please provide your phone number.
						</Form.Control.Feedback>
					</Form.Group>

					<Form.Group className="mb-4" controlId="formLicense">
						<Form.Label>License Number</Form.Label>
						<Form.Control
							name="license"
							type="number" // Standard HTML input type, for valid values check www.w3schools.com/html/html_form_input_types.asp
							autoComplete="license"
							defaultValue={this.state.license}
							required
						/>
						{/* Display feedback message if the user screws up the input, see react-bootstrap.github.io/forms/validation/ */}
						<Form.Control.Feedback type="invalid">
							Please provide your license number.
						</Form.Control.Feedback>
					</Form.Group>

					{/* type="submit" automatically runs onSubmit, which runs this.submitForm */}
					<LargeButton variant="primary" type="submit" icon="arrow-right">
						Update
					</LargeButton>
				</Form>
			</Container>
		);
	}
}

export default Profile;