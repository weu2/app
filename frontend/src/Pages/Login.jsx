import React from "react";
import { Navigate } from "react-router-dom";

import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import LargeButton from "../Components/LargeButton";

import { backendLogin } from "../api.jsx";

class Login extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			email: null,
			password: null,
			loggedIn: false,
			error: null
		};
	}

	submitForm = (event) => {
		event.preventDefault();
		const form = event.currentTarget;
		if (form.checkValidity()) {
			backendLogin(
				this.state.email,
				this.state.password
			).then(() => this.setState({
				loggedIn: true
			})).catch(async(res) => this.setState({
				error: `Error: ${res.status} (${res.statusText}) ${await res.text()}`
			}));
		}
	}

	changeHandler = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	}

	render() {
		return (
			<Container>
				<h2 className="mb-4">Login</h2>
				{this.state.loggedIn ? <Navigate to="/dashboard"/> : null}
				{this.state.error ? <Alert variant="danger">{this.state.error}</Alert> : null}
				<Form noValidate onSubmit={this.submitForm}>
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
					<Form.Group className="mb-4" controlId="formPassword">
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
					<LargeButton variant="primary" type="submit" icon="arrow-right">
						Login
					</LargeButton>
				</Form>
			</Container>
		);
	}
}

export default Login;