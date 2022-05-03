import React from "react";
import { Navigate } from "react-router-dom";

// <Alert> is useful for displaying success or error messages, see react-bootstrap.github.io/components/alerts/
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// <Container> adds padding to the sides of the page content, makes it look nicer
import Container from "react-bootstrap/Container";

// <LargeButton> is a subclass of React Bootstrap's <Button> with an icon added to the right side
import LargeButton from "../Components/LargeButton";
import LocationInput from "../Components/LocationInput";

// api.jsx contains utility functions for getting or sending data from the frontend to the backend
// For example, sending form data or getting user info
import { backendRegister } from "../api.jsx";

class Register extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			submitted: false, // Redirect to /login on submit
			error: null, // Display failure message if an error occurs
			validated: false, // Shows feedback messages to show the user if they screwed up the form, see react-bootstrap.github.io/forms/validation/
			userType: "", // Form is shown after selecting a user type
		};
	}

	submitForm = (event) => {
		// Prevent form submission from refreshing the page, since we send the data manually
		event.preventDefault();

		const form = event.currentTarget;
		if (form.checkValidity()) {
			// Manually send form data to backend
			backendRegister(new FormData(form))
				.then(() => this.setState({
					// Redirect to /login
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
				<h2 className="mb-4">Register</h2>

				{/* Redirect to /login once the user submits */}
				{this.state.submitted ? <Navigate to="/login"/> : null}

				{/* Display an error message if required */}
				{this.state.error ? <Alert variant="danger">{this.state.error}</Alert> : null}

				{this.state.userType

				// Form validation and submission is done manually, see react-bootstrap.github.io/forms/validation/ */}
				? <Form noValidate validated={this.state.validated} onSubmit={this.submitForm}>

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

					<Form.Group className="mb-3" controlId="formPassword">
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

					<Row>
						<Form.Group as={Col} className="mb-3" controlId="formFirstName">
							<Form.Label>First Name</Form.Label>
							<Form.Control
								name="firstName"
								type="text" // Standard HTML input type, for valid values check www.w3schools.com/html/html_form_input_types.asp
								autoComplete="given-name" // autocomplete is not essential, but for suggested values check developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
								required
							/>
							{/* Display feedback message if the user screws up the input, see react-bootstrap.github.io/forms/validation/ */}
							<Form.Control.Feedback type="invalid">
								Please provide your first name.
							</Form.Control.Feedback>
						</Form.Group>

						<Form.Group as={Col} className="mb-3" controlId="formLastName">
							<Form.Label>Last Name</Form.Label>
							<Form.Control
								name="lastName"
								type="text" // Standard HTML input type, for valid values check www.w3schools.com/html/html_form_input_types.asp
								autoComplete="family-name" // autocomplete is not essential, but for suggested values check developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
								required
							/>
							{/* Display feedback message if the user screws up the input, see react-bootstrap.github.io/forms/validation/ */}
							<Form.Control.Feedback type="invalid">
								Please provide your last name.
							</Form.Control.Feedback>
						</Form.Group>
					</Row>

					<Form.Group className="mb-3" controlId="formAddress">
						<Form.Label>Address</Form.Label>
						<Form.Control
							name="address"
							type="text" // Standard HTML input type, for valid values check www.w3schools.com/html/html_form_input_types.asp
							autoComplete="street-address" // autocomplete is not essential, but for suggested values check developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
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
							autoComplete="tel" // autocomplete is not essential, but for suggested values check developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
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
							autoComplete="license" // autocomplete is not essential, but for suggested values check developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
							required
						/>
						{/* Display feedback message if the user screws up the input, see react-bootstrap.github.io/forms/validation/ */}
						<Form.Control.Feedback type="invalid">
							Please provide your license number.
						</Form.Control.Feedback>
					</Form.Group>

					{/* Force service professionals to provide a location */}
					{
						this.state.userType === "PROFESSIONAL"
						? <LocationInput className="mb-3" />
						: null
					}

					{/* Include user type automatically */}
					<Form.Control name="type" type="hidden" required value={this.state.userType} />

					{/* type="submit" automatically runs onSubmit, which runs this.submitForm */}
					<LargeButton className="mb-3" variant="primary" type="submit" icon="arrow-right">
						Submit
					</LargeButton>
				</Form>
				: <div>
					<p>I am a...</p>
					<LargeButton
						variant="primary"
						icon="arrow-right"
						className="mb-3"
						onClick={() => this.setState({ userType: "CUSTOMER" })}
					>
						Customer
					</LargeButton>
					<LargeButton
						variant="primary"
						icon="arrow-right"
						className="mb-3"
						onClick={() => this.setState({ userType: "PROFESSIONAL" })}
					>
						Service Professional
					</LargeButton>
				</div>}

			</Container>
		);
	}
}

export default Register;
