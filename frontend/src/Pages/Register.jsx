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
import { backendRegister } from "../api.jsx";

class Register extends React.Component {

	constructor(props) {
		super(props); // Call React.Component's constructor as well as our own constructor
		this.state = { // "this.state" variables automatically update the website whenever they get changed
			email: null, // Updated to match the value of the input <Form.Control name="email">
			firstName: null, // Updated to match the value of the input <Form.Control name="firstName">
			lastName: null, // Updated to match the value of the input <Form.Control name="lastName">
			address: null, // Updated to match the value of the input <Form.Control name="address">
			phoneNumber: null, // Updated to match the value of the input <Form.Control name="phoneNumber">
			license: null, // Updated to match the value of the input <Form.Control name="license">
			password: null, // Updated to match the value of the input <Form.Control name="password">
			type: null, // Updated to match the value of the radio buttons <Form.Check name="type">
			registered: false, // Assume the user has not registered yet
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
			backendRegister(
				// State variables are updated to match their relevant input
				this.state.email,
				this.state.firstName,
				this.state.lastName,
				this.state.address,
				this.state.phoneNumber,
				this.state.license,
				this.state.password,
				this.state.type
			).then(() => this.setState({
				// Redirect to /login
				registered: true
			})).catch(async(res) => this.setState({
				// Show error message
				error: `Error: ${res.status} (${res.statusText}) ${await res.text()}`
			}));
		}
		// Show validation messages if required
		this.setState({ validated: true });
	}

	changeHandler = (event) => {
		// Updates the relevant "this.state" variable to match its input
		// For example, <Form.Control name="email"> runs this.setState({ email: event.target.value });
		// This means the value of "this.state.email" will correctly match the input named "email"
		// This generalises for all inputs, as long as the their "name" matches a "this.state" variable
		this.setState({ [event.target.name]: event.target.value });
	}

	render() {
		return (
			// <Container> adds padding around the website content, makes it look nicer
			<Container>
				{/* "mb-4" is a Bootstrap CSS class for setting margin-bottom, see getbootstrap.com/docs/5.1/utilities/spacing/ */}
				<h2 className="mb-4">Register</h2>

				{/* Redirect to /login once the user has registered */}
				{this.state.registered ? <Navigate to="/login"/> : null}

				{/* Display an error message if required */}
				{this.state.error ? <Alert variant="danger">{this.state.error}</Alert> : null}

				{/* Form validation and submission is done manually, see react-bootstrap.github.io/forms/validation/ */}
				<Form noValidate validated={this.state.validated} onSubmit={this.submitForm}>

					{/* Each form group typically contains one label and one input, see react-bootstrap.github.io/forms/overview/ */}
					<Form.Group className="mb-3" key="inline-radio">
						<Form.Label>I am a:</Form.Label>
						<Form.Check
							name="type" // Name must correspond to a value in the "this.state" object for the change handler to work
							type="radio" // Standard HTML input type, for valid values check www.w3schools.com/html/html_form_input_types.asp
							label="Customer"
							value="CUSTOMER" // Valid account types are "CUSTOMER" and "PROFESSIONAL"
							id="inline-radio-1" // Ensure clicking the label toggles the input
							onChange={this.changeHandler} // Change handler takes the control's name and sets it to the matching variable in the "this.state" object
							required
						/>
						<Form.Check
							name="type" // Name must correspond to a value in the "this.state" object for the change handler to work
							type="radio" // Standard HTML input type, for valid values check www.w3schools.com/html/html_form_input_types.asp
							label="Service Professional"
							value="PROFESSIONAL" // Valid account types are "CUSTOMER" and "PROFESSIONAL"
							id="inline-radio-2" // Ensure clicking the label toggles the input
							onChange={this.changeHandler} // Change handler takes the control's name and sets it to the matching variable in the "this.state" object
							required
						/>
					</Form.Group>

					<Form.Group className="mb-3" controlId="formEmail">
						<Form.Label>Email</Form.Label>
						<Form.Control
							name="email" // Name must correspond to a value in the "this.state" object for the change handler to work
							type="email" // Standard HTML input type, for valid values check www.w3schools.com/html/html_form_input_types.asp
							autoComplete="email" // autocomplete is not essential, but for suggested values check developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
							onChange={this.changeHandler} // Change handler takes the control's name and sets it to the matching variable in the "this.state" object
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
							name="password" // Name must correspond to a value in the "this.state" object for the change handler to work
							type="password" // Standard HTML input type, for valid values check www.w3schools.com/html/html_form_input_types.asp
							autoComplete="current-password" // autocomplete is not essential, but for suggested values check developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
							onChange={this.changeHandler} // Change handler takes the control's name and sets it to the matching variable in the "this.state" object
							required
						/>
						{/* Display feedback message if the user screws up the input, see react-bootstrap.github.io/forms/validation/ */}
						<Form.Control.Feedback type="invalid">
							Please choose a password.
						</Form.Control.Feedback>
					</Form.Group>

					<Form.Group className="mb-3" controlId="formFirstName">
						<Form.Label>First Name</Form.Label>
						<Form.Control
							name="firstName" // Name must correspond to a value in the "this.state" object for the change handler to work
							type="text" // Standard HTML input type, for valid values check www.w3schools.com/html/html_form_input_types.asp
							autoComplete="given-name" // autocomplete is not essential, but for suggested values check developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
							onChange={this.changeHandler} // Change handler takes the control's name and sets it to the matching variable in the "this.state" object
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
							name="lastName" // Name must correspond to a value in the "this.state" object for the change handler to work
							type="text" // Standard HTML input type, for valid values check www.w3schools.com/html/html_form_input_types.asp
							autoComplete="family-name" // autocomplete is not essential, but for suggested values check developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
							onChange={this.changeHandler} // Change handler takes the control's name and sets it to the matching variable in the "this.state" object
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
							name="address" // Name must correspond to a value in the "this.state" object for the change handler to work
							type="text" // Standard HTML input type, for valid values check www.w3schools.com/html/html_form_input_types.asp
							autoComplete="street-address" // autocomplete is not essential, but for suggested values check developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
							onChange={this.changeHandler} // Change handler takes the control's name and sets it to the matching variable in the "this.state" object
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
							name="phoneNumber" // Name must correspond to a value in the "this.state" object for the change handler to work
							type="tel" // Standard HTML input type, for valid values check www.w3schools.com/html/html_form_input_types.asp
							autoComplete="tel" // autocomplete is not essential, but for suggested values check developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
							onChange={this.changeHandler} // Change handler takes the control's name and sets it to the matching variable in the "this.state" object
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
							name="license" // Name must correspond to a value in the "this.state" object for the change handler to work
							type="number" // Standard HTML input type, for valid values check www.w3schools.com/html/html_form_input_types.asp
							autoComplete="license" // autocomplete is not essential, but for suggested values check developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
							onChange={this.changeHandler} // Change handler takes the control's name and sets it to the matching variable in the "this.state" object
							required
						/>
						{/* Display feedback message if the user screws up the input, see react-bootstrap.github.io/forms/validation/ */}
						<Form.Control.Feedback type="invalid">
							Please provide your license number.
						</Form.Control.Feedback>
					</Form.Group>

					{/* type="submit" automatically runs onSubmit, which runs this.submitForm */}
					<LargeButton variant="primary" type="submit" icon="arrow-right">
						Submit
					</LargeButton>
				</Form>
			</Container>
		);
	}
}

export default Register;
