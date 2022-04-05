import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

import { backendRegister } from "../api.jsx";
import "./Register.css";

class Register extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			type: null,
			firstName: null,
			lastName: null,
			email: null,
			password: null,
			page: 0,
			status: null
		};
	}

	submitForm(e) {
		e.preventDefault();
		backendRegister(
			this.state.email,
			this.state.password,
			this.state.type,
			this.state.firstName,
			this.state.lastName
		).then(res => this.setState({ status: res }))
		.catch(res => this.setState({ status: `Error: ${res}` }));
	}

	render() {
		return (
			<div className="Register">
				<div className="Register-Content">
					<h1>Register</h1>
					{
						(this.state.page > 0) ?
						<button className="btn Register-BackButton" onClick={() => this.setState({ page: this.state.page - 1 })}>
							<FontAwesomeIcon icon={faChevronLeft} /> Back
						</button> : null
					}
					<div style={this.state.page === 0 ? null : { display: "none" }}>
						<h2>I am a...</h2>
						<button
							onClick={() => this.setState({ type: "customer", page: this.state.page + 1 })}
							className="btn btn-primary btn-bevel Register-CategoryButton"
						>
							Customer<FontAwesomeIcon icon={faArrowRight} />
						</button>
						<button
							onClick={() => this.setState({ type: "professional", page: this.state.page + 1 })}
							className="btn btn-primary btn-bevel Register-CategoryButton"
						>
							Service Professional<FontAwesomeIcon icon={faArrowRight} />
						</button>
					</div>
					<form onSubmit={this.submitForm.bind(this)}>
						<div style={this.state.page === 1 ? null : { display: "none" }}>
							<div>{this.state.status}</div>
							<div>
								<label htmlFor="firstName">First Name</label>
								<input
									className="form-input"
									type="text"
									autoComplete="given-name"
									onChange={e => this.setState({ firstName: e.target.value })}
								/>
							</div>
							<div>
								<label htmlFor="lastName">Last Name</label>
								<input
									className="form-input"
									type="text"
									autoComplete="family-name"
									onChange={e => this.setState({ lastName: e.target.value })}
								/>
							</div>
							<div>
								<label htmlFor="email">Email</label>
								<input
									className="form-input"
									type="email"
									autoComplete="email"
									onChange={e => this.setState({ email: e.target.value })}
								/>
							</div>
							<div>
								<label htmlFor="password">Password</label>
								<input
									className="form-input"
									type="password"
									autoComplete="current-password"
									onChange={e => this.setState({ password: e.target.value })}
								/>
							</div>
							<button className="btn btn-primary btn-bevel Register-SubmitButton" type="submit">
								Submit<FontAwesomeIcon icon={faArrowRight} />
							</button>
						</div>
					</form>
				</div>
			</div>
		);
	}
}

export default Register;
