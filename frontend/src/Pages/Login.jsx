import React from "react";
import {Navigate} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

import { backendLogin } from "../api.jsx";
import "./RegisterTest.css";

class Login extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			email: "",
			password: "",
			status:""
		};
	}

	submitForm(e) {
		e.preventDefault();
		backendLogin(
			this.state.email,
			this.state.password
		).then(json => this.setState({status:json.status}));
	}

	render() {
		return (
			<div className="Register">
				<div className="Register-Content">
					<h1>Login</h1>
					<div>{this.state.status === "ok" ? (<Navigate to="/dashboard"/>) : this.state.status}</div>
					<form onSubmit={this.submitForm.bind(this)}>
						<div>
							<label htmlFor="email">Email</label>
							<input
								className="form-input"
								name="email"
								type="email"
								required={true}
								autoComplete="email"
								placeholder="davo@gmail.com"
								value={this.state.email}
								onChange={e => this.setState({ email: e.target.value })}
							/>
						</div>
						<div>
							<label htmlFor="password">Password</label>
							<input
								className="form-input"
								name="pwd"
								type="password"
								required={true}
								autoComplete="current-password"
								value={this.state.password}
								onChange={e => this.setState({ password: e.target.value })}
							/>
						</div>
						<button className="btn btn-primary btn-bevel Register-NextButton" type="submit">
							Login<FontAwesomeIcon icon={faArrowRight} />
						</button>
					</form>
				</div>
			</div>
		);
	}
}

export default Login;