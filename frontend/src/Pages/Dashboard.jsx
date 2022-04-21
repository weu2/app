import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";

import Container from "react-bootstrap/Container";

import { backendGetUserInfo } from "../api.jsx";



class Dashboard extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			loggedIn: true,
			data: null
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

	openRequestCallout(){
		
		console.log("ADD NAVIGATION HERE KALEB");
	}

	render() {
		return (
			<Container>
				{this.state.loggedIn ? null : <Navigate to="/login"/>}
				<h1 className="mb-4">Dashboard Test</h1>

				<div className="mb-3">
					<Button variant="primary" 
					onClick={this.openRequestCallout}>Request Callout</Button>
				</div>

			</Container>
		);
	}
}

export default Dashboard;