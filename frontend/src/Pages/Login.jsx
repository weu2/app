import React from "react";
import "./RegisterTest.css";

class Login extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: ""
		};
	}

	submitForm(e) {
		e.preventDefault();
		const details = {
			user: this.state.username,
			pwd: this.state.password
		};
		fetch("/api/v1/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(details)
		})
		.then(r => r.text())
		.then(console.log);
	}

	render() {
		return (
			<div className="Register">
				<div className="Register-Content">
					<h1>Login</h1>
					<form onSubmit={this.submitForm.bind(this)}>
						<div>
							<label htmlFor="username">Username</label>
							<input
								name="username"
								type="text"
								required={true}
								autoComplete="username"
								value={this.state.username}
								onChange={e => this.setState({ username: e.target.value })}
							/>
						</div>
						<div>
							<label htmlFor="password">Password</label>
							<input
								name="pwd"
								type="password"
								required={true}
								autoComplete="current-password"
								value={this.state.password}
								onChange={e => this.setState({ password: e.target.value })}
							/>
						</div>
						<button className="Register-NextButton" type="submit">Login</button>
					</form>
				</div>
			</div>
		)
	}
}

export default Login;