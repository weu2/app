import React from "react";
import { Navigate } from "react-router-dom";

import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import LargeButton from "../Components/LargeButton";

import { backendGetUserInfo, backendUpdate } from "../api.jsx";

class Profile extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			email: "",
			firstName: "",
			lastName: "",
			address: "",
			phoneNumber: "",
			license: "",
			error: null,
			loggedIn: true,
			updated: false,
			validated: false
		};
	}

	componentDidMount() {
		// Redirect to /login if user isn't logged in yet
		backendGetUserInfo()
			.then(res => this.setState({
				email: res.email,
				firstName: res.firstName,
				lastName: res.lastName,
				address: res.address,
				phoneNumber: res.phoneNumber,
				license: res.license
			})).catch(() => this.setState({
				loggedIn: false
			}));
	}

	submitForm = (event) => {
		event.preventDefault();
		const form = event.currentTarget;
		if (form.checkValidity()) {
			backendUpdate(
				this.state.email,
				this.state.firstName, 
				this.state.lastName,
				this.state.address,
				this.state.phoneNumber,
				this.state.license
			).then(() => this.setState({
				updated: true
			})).catch(async(res) => this.setState({
				error: `Error: ${res.status} (${res.statusText}) ${await res.text()}`
			}));
		}
		// Show validation messages if required
		this.setState({ validated: true });
	}

	changeHandler = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	}

	render() {
		return (
			<Container>
				<h2 className="mb-4">My Profile</h2>
				{this.state.loggedIn ? null : <Navigate to="/login"/>}
				{this.state.updated ? <Alert variant="success">Updated your profile!</Alert> : null}
				{this.state.error ? <Alert variant="danger">{this.state.error}</Alert> : null}
				<Form noValidate validated={this.state.validated} onSubmit={this.submitForm}>
					<Form.Group className="mb-3" controlId="formEmail">
						<Form.Label>Email</Form.Label>
						<Form.Control
							name="email"
							type="email"
							autoComplete="email"
							onChange={this.changeHandler}
							value={this.state.email}
							required
						/>
						<Form.Control.Feedback type="invalid">
							Please provide an email.
						</Form.Control.Feedback>
					</Form.Group>
					<Form.Group className="mb-3" controlId="formFirstName">
						<Form.Label>First Name</Form.Label>
						<Form.Control
							name="firstName"
							type="text"
							autoComplete="given-name"
							onChange={this.changeHandler}
							value={this.state.firstName}
							required
						/>
						<Form.Control.Feedback type="invalid">
							Please provide your first name.
						</Form.Control.Feedback>
					</Form.Group>
					<Form.Group className="mb-3" controlId="formLastName">
						<Form.Label>Last Name</Form.Label>
						<Form.Control
							name="lastName"
							type="text"
							autoComplete="family-name"
							onChange={this.changeHandler}
							value={this.state.lastName}
							required
						/>
						<Form.Control.Feedback type="invalid">
							Please provide your last name.
						</Form.Control.Feedback>
					</Form.Group>
					<Form.Group className="mb-3" controlId="formAddress">
						<Form.Label>Address</Form.Label>
						<Form.Control
							name="address"
							type="text"
							autoComplete="street-address"
							onChange={this.changeHandler}
							value={this.state.address}
							required
						/>
						<Form.Control.Feedback type="invalid">
							Please provide your address.
						</Form.Control.Feedback>
					</Form.Group>
					<Form.Group className="mb-3" controlId="formPhoneNumber">
						<Form.Label>Phone Number</Form.Label>
						<Form.Control
							name="phoneNumber"
							type="tel"
							autoComplete="tel"
							onChange={this.changeHandler}
							value={this.state.phoneNumber}
							required
						/>
						<Form.Control.Feedback type="invalid">
							Please provide your phone number.
						</Form.Control.Feedback>
					</Form.Group>
					<Form.Group className="mb-4" controlId="formLicense">
						<Form.Label>License Number</Form.Label>
						<Form.Control
							name="license"
							type="number"
							autoComplete="license"
							onChange={this.changeHandler}
							value={this.state.license}
							required
						/>
						<Form.Control.Feedback type="invalid">
							Please provide your license number.
						</Form.Control.Feedback>
					</Form.Group>
					<LargeButton variant="primary" type="submit" icon="arrow-right">
						Update
					</LargeButton>
				</Form>
			</Container>
		);
	}
}

export default Profile;