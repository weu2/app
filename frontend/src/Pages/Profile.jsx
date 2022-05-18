import React from "react";
import { Navigate } from "react-router-dom";

// <Alert> is useful for displaying success or error messages, see react-bootstrap.github.io/components/alerts/
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// <Container> adds padding to the sides of the page content, makes it look nicer
import Container from "react-bootstrap/Container";

// api.jsx contains utility functions for getting or sending data from the frontend to the backend
// For example, sending form data or getting user info
import { backendGetUserInfo, backendUpdate } from "../api.jsx";

class Profile extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			type: "Unknown", // To autofill inputs from existing user info
			email: "",
			firstName: "",
			lastName: "",
			address: "",
			phoneNumber: "",
			license: "",
			pushNotif: false,
			error: null, // Display failure message if an error occurs
			loggedIn: true, // Assume the user is not logged in yet
			updated: false, // Displays an "updated" alert when the details are updated successfully
			validated: false, // Shows feedback messages to show the user if they screwed up the form, see react-bootstrap.github.io/forms/validation/
			changedForm: false // Show update button only once user changes form
		};
	}

	componentDidMount() {
		backendGetUserInfo()
			.then(res => this.setState({
				type: res.type, // Autofill inputs from existing user info
				email: res.email,
				firstName: res.firstName,
				lastName: res.lastName,
				address: res.address,
				phoneNumber: res.phoneNumber,
				license: res.license,
				pushNotif: res.pushNotif !== null
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
				.then(() => {
					// Show "updated" alert
					this.setState({ updated: true });
					// Update the name label in the navigation bar
					document.dispatchEvent(new Event("updateInfo"));
				}).catch(async(res) => this.setState({
					error: `Error: ${res.status} (${res.statusText}) ${await res.text()}`
				}));
		}
		// Show validation messages if required
		this.setState({ validated: true });
	}

	submitNotifs = (event) => {
		// Manually send form data to backend
		const formData = new FormData();
		formData.set(event.target.name, event.target.checked);
		backendUpdate(formData)
			.then(() => this.setState({
				updated: true // Show "updated" alert
			})).catch(async(res) => this.setState({
				error: `Error: ${res.status} (${res.statusText}) ${await res.text()}`
			}));
	}

	changedForm = () => {
		this.setState({ changedForm: true });
	}

	updateNotifs = (event) => {
		this.setState({ pushNotif: event.target.checked });

		if (event.target.checked) {
			Notification.requestPermission().then((status) => {
				if (Notification.permission === "granted") {
					this.submitNotifs(event);
				} else {
					this.setState({
						pushNotif: false,
						error: "Error: Cannot enable notifications, please check your browser permissions"
					});
				}
			});
		} else {
			this.submitNotifs(event);
		}
	}

	render() {
		return (
			// <Container> adds padding around the website content, makes it look nicer
			<Container>
				<div>
					{/* "mb-4" is a Bootstrap CSS class for setting margin-bottom, see getbootstrap.com/docs/5.1/utilities/spacing/ */}
					<h2 className="mb-4">My Profile</h2>

					{/* Redirect to /login if the user is not logged in yet */}
					{!this.state.loggedIn && <Navigate to="/login"/>}

					{/* Show alert to indicate their account was updated */}
					{this.state.updated && <Alert variant="success">Updated your profile!</Alert>}

					{/* Display an error message if required */}
					{this.state.error && <Alert variant="danger">{this.state.error}</Alert>}

					{/* Show account type for debugging purposes */}
					<p>Type: {this.state.type}</p>

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
								onChange={this.changedForm}
								required
							/>
							{/* Display feedback message if the user screws up the input, see react-bootstrap.github.io/forms/validation/ */}
							<Form.Control.Feedback type="invalid">
								Please provide an email.
							</Form.Control.Feedback>
						</Form.Group>

						<Row>
							<Form.Group as={Col} className="mb-3" controlId="formFirstName">
								<Form.Label>First Name</Form.Label>
								<Form.Control
									name="firstName"
									type="text" // Standard HTML input type, for valid values check www.w3schools.com/html/html_form_input_types.asp
									autoComplete="given-name"
									defaultValue={this.state.firstName}
									onChange={this.changedForm}
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
									autoComplete="family-name"
									defaultValue={this.state.lastName}
									onChange={this.changedForm}
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
								autoComplete="street-address"
								defaultValue={this.state.address}
								onChange={this.changedForm}
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
								onChange={this.changedForm}
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
								onChange={this.changedForm}
								required
							/>
							{/* Display feedback message if the user screws up the input, see react-bootstrap.github.io/forms/validation/ */}
							<Form.Control.Feedback type="invalid">
								Please provide your license number.
							</Form.Control.Feedback>
						</Form.Group>

						{ // type="submit" automatically runs onSubmit, which runs this.submitForm
							this.state.changedForm
							&& <Button variant="primary" type="submit">Update</Button>
						}
					</Form>
				</div>
				{
					('Notification' in window && navigator.serviceWorker)
					? <div>
						<h2 className="mb-4 mt-5">Notification Settings</h2>
						<Form.Check
							className="mb-3"
							id="pushNotif"
							type="switch" // Custom Bootstrap type, see react-bootstrap.github.io/forms/checks-radios/
							name="pushNotif"
							checked={this.state.pushNotif}
							label="Push Notifications"
							onChange={this.updateNotifs}
						/>
					</div>
					: null
				}
			</Container>
		);
	}
}

export default Profile;