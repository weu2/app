import React from "react";
import { Navigate } from "react-router-dom";
import { backendGetUserInfo } from "../api";
import Header from "../Components/Header";

class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loggedIn: true,
			info: null
		}
	}

	componentDidMount() {
		// Redirect to /login if user isn't logged in yet
		backendGetUserInfo()
			.then(res => this.setState({ info: JSON.stringify(res, null, "\t") }))
			.catch(() => this.setState({ loggedIn: false }));
	}

	render() {
		return (
			<div>
				{this.state.loggedIn ? null : <Navigate to="/login"/>}
				<Header 
					text="dashboard test page"
					center="true"
				/>
				{this.state.info ? <p>{this.state.info}</p> : null}
			</div>
		);
	}
}

export default Dashboard;