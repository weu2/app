import React from "react";
import { Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

import { backendLogin } from "../api.jsx";
import "./Register.css";

class Login extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			email: null,
			password: null,
			loggedIn: false,
			status: null
		};
	}

	submitForm(e) {
		e.preventDefault();
		backendLogin(this.state.email, this.state.password)
			.then(() => this.setState({ loggedIn: true }))
			.catch(res => this.setState({ status: `Error: ${res}` }));
	}

	render() {
		return (
			<div className="Register">
				<div className="Register-Content">
					<h1>Login</h1>
					<form onSubmit={this.submitForm.bind(this)}>
						<div>{this.state.loggedIn ? <Navigate to="/dashboard"/> : this.state.status}</div>
						<div>
							<label htmlFor="email">Email</label>
							<input
								id="email"
								className="form-input"
								type="email"
								required={true}
								autoComplete="email"
								onChange={e => this.setState({ email: e.target.value })}
							/>
						</div>
						<div>
							<label htmlFor="password">Password</label>
							<input
								id="password"
								className="form-input"
								type="password"
								required={true}
								autoComplete="current-password"
								onChange={e => this.setState({ password: e.target.value })}
							/>
						</div>
						<button className="btn btn-primary btn-shadow Register-SubmitButton" type="submit">
							Login<FontAwesomeIcon icon={faArrowRight} />
						</button>
					</form>
				</div>
			</div>
		);
	}
}

export default Login;