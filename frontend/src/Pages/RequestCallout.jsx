import React from "react";
import { Navigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import LargeButton from "../Components/LargeButton";

import Container from "react-bootstrap/Container";

import { backendGetUserInfo } from "../api.jsx";

class Dashboard extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			loggedIn: true,
			data: null,
			registrationNum : null,
			date: null
		}
	}

	componentDidMount() {
		// Redirect to /login if user isn't logged in yet
		backendGetUserInfo()
			.then(res => this.setState({
				data: res
			})).catch(() => this.setState({
				loggedIn: false
			}));
	}

	changeHandler = (event) =>{
		this.setState({date: new Date()})
		this.setState({ [event.target.name]: event.target.value });
	}

	render() {
		return (
			<Container>
				{this.state.loggedIn ? null : <Navigate to="/login"/>}
				<h1 className="mb-4">Request Callout</h1>
				{/* From class diagram we need these variables
					id - get from backend
					Date - find automatically
							vehicle - entered by user
					Customer - from page data
					Service professional - found by system
					cost - calculated by system
					locationLat - found by system
					locationLong - found by system
				*/}
				
				<Form noValidate validated={this.state.validated} onSubmit={this.submitForm}>
					<Form.Group className="mb-3">
				
						<Form.Label>Vehicle Registration Number</Form.Label>
						<Form.Control
							name="registrationNum"
							type="registrationNum"
							autoComplete="registrationNum"
							onChange={this.changeHandler}
							required
						/>
					{/* display the current date */}
					<Form.Label>Date: {(new Date().toLocaleString() + "").substring(0, 10)}</Form.Label>

					<Form.Text className="text-muted"><p>TO DO: LOCATION HERE</p></Form.Text>

					</Form.Group>

					{/* TO DO
						Update state
						Pass variables to back end
						Navigate to next page*/}
					<LargeButton variant="primary" type="submit" icon="arrow-right">
						Request Callout
					</LargeButton>
				</Form>

			</Container>
		);
	}
}

export default Dashboard;