import React from "react";
import { Navigate } from "react-router-dom";

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

	render() {
		return (
			<Container>
				{this.state.loggedIn ? null : <Navigate to="/login"/>}
				<h1 className="mb-4">Dashboard Test</h1>
			</Container>
		);
	}
}

export default Dashboard;