import React from "react";
import { Navigate } from "react-router-dom";

import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import LargeButton from "../Components/LargeButton";

import { backendRegister } from "../api.jsx";

class Register extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			email: null,
			firstName: null,
			lastName: null,
			address: null,
			phoneNumber: null,
			license: null,
			password: null,
			type: null,
			registered: false,
			error: null,
			validated: false
		};
	}

	submitForm = (event) => {
		event.preventDefault();
		const form = event.currentTarget;
		if (form.checkValidity()) {
			backendRegister(
				this.state.email,
				this.state.firstName, 
				this.state.lastName,
				this.state.address,
				this.state.phoneNumber,
				this.state.license,
				this.state.password,
				this.state.type
			).then(() => this.setState({
				registered: true
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
				<h2 className="mb-4">Register</h2>
				{this.state.registered ? <Navigate to="/login"/> : null}
				{this.state.error ? <Alert variant="danger">{this.state.error}</Alert> : null}
				<Form noValidate validated={this.state.validated} onSubmit={this.submitForm}>
					<Form.Group className="mb-3" key="inline-radio">
						<Form.Label>I am a:</Form.Label>
						<Form.Check
							name="type"
							type="radio"
							label="Customer"
							value="CUSTOMER"
							id="inline-radio-1"
							onChange={this.changeHandler}
							required
						/>
						<Form.Check
							name="type"
							type="radio"
							label="Service Professional"
							value="PROFESSIONAL"
							id="inline-radio-2"
							onChange={this.changeHandler}
							required
						/>
					</Form.Group>
					<Form.Group className="mb-3" controlId="formEmail">
						<Form.Label>Email</Form.Label>
						<Form.Control
							name="email"
							type="email"
							autoComplete="email"
							onChange={this.changeHandler}
							required
						/>
						<Form.Control.Feedback type="invalid">
							Please provide an email.
						</Form.Control.Feedback>
					</Form.Group>
					<Form.Group className="mb-3" controlId="formPassword">
						<Form.Label>Password</Form.Label>
						<Form.Control
							name="password"
							type="password"
							autoComplete="current-password"
							onChange={this.changeHandler}
							required
						/>
						<Form.Control.Feedback type="invalid">
							Please choose a password.
						</Form.Control.Feedback>
					</Form.Group>
					<Form.Group className="mb-3" controlId="formFirstName">
						<Form.Label>First Name</Form.Label>
						<Form.Control
							name="firstName"
							type="text"
							autoComplete="given-name"
							onChange={this.changeHandler}
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
							required
						/>
						<Form.Control.Feedback type="invalid">
							Please provide your license number.
						</Form.Control.Feedback>
					</Form.Group>
					<LargeButton variant="primary" type="submit" icon="arrow-right">
						Submit
					</LargeButton>
				</Form>
			</Container>
		);
	}
}

export default Register;
