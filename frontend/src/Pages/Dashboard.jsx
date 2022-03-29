import React from "react";
import { Navigate } from "react-router-dom";
import { backendGetUserInfo } from "../api";
import Header from "../Components/Header";

class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loggedIn: true,
			category: ""
		}
	}

	componentDidMount() {
		// Redirect to /login if user isn't logged in yet
		backendGetUserInfo()
			.then(info => this.setState({ category: info.category }))
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
				<Header 
					text={this.state.category ? `Your user category is: ${this.state.category}` : "Loading..."}
					center="true"
				/>
			</div>
		);
	}
}

export default Dashboard;