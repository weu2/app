import React from "react";
import { Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

import { backendRegister } from "../api.jsx";
import "./Register.css";

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
			page: 0,
			status: null
		};
	}

	submitForm(e) {
		e.preventDefault();
		backendRegister(
			this.state.email,
			this.state.firstName, 
			this.state.lastName,
			this.state.address,
			this.state.phoneNumber,
			this.state.license,
			this.state.password,
			this.state.type
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
							onClick={() => this.setState({ type: "CUSTOMER", page: this.state.page + 1 })}
							className="btn btn-primary btn-shadow Register-CategoryButton"
						>
							Customer<FontAwesomeIcon icon={faArrowRight} />
						</button>
						<button
							onClick={() => this.setState({ type: "PROFESSIONAL", page: this.state.page + 1 })}
							className="btn btn-primary btn-shadow Register-CategoryButton"
						>
							Service Professional<FontAwesomeIcon icon={faArrowRight} />
						</button>
					</div>
					<form onSubmit={this.submitForm.bind(this)}>
						<div style={this.state.page === 1 ? null : { display: "none" }}>
							{this.state.status === "OK" ? <Navigate to="/login"/> : <div>{this.state.status}</div>}
							<div>
								<label htmlFor="email">Email</label>
								<input
									id="email"
									className="form-input"
									type="email"
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
									autoComplete="current-password"
									onChange={e => this.setState({ password: e.target.value })}
								/>
							</div>
							<div>
								<label htmlFor="firstName">First Name</label>
								<input
									id="firstName"
									className="form-input"
									type="text"
									autoComplete="given-name"
									onChange={e => this.setState({ firstName: e.target.value })}
								/>
							</div>
							<div>
								<label htmlFor="lastName">Last Name</label>
								<input
									id="lastName"
									className="form-input"
									type="text"
									autoComplete="family-name"
									onChange={e => this.setState({ lastName: e.target.value })}
								/>
							</div>
							<div>
								<label htmlFor="address">Address</label>
								<input
									id="address"
									className="form-input"
									type="text"
									autoComplete="street-address"
									onChange={e => this.setState({ address: e.target.value })}
								/>
							</div>
							<div>
								<label htmlFor="phone">Phone Number</label>
								<input
									id="phone"
									className="form-input"
									type="tel"
									autoComplete="tel"
									onChange={e => this.setState({ phoneNumber: e.target.value })}
								/>
							</div>
							<div>
								<label htmlFor="license">License Number</label>
								<input
									id="license"
									className="form-input"
									type="number"
									autoComplete="license"
									onChange={e => this.setState({ license: e.target.value })}
								/>
							</div>
							<button className="btn btn-primary btn-shadow Register-SubmitButton" type="submit">
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
