import React from "react";
import { Navigate } from "react-router-dom";
import { backendGetInfo } from "../api";
import Header from "../Components/Header";

class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loggedin : true,
			info : ""
		}
	}

	componentDidMount() {
		backendGetInfo()
			.then( info => this.setState({info : info.category }))
			.catch(() => this.setState({loggedin:false}) ); 
	}

	render() {
		return (
			<div>
				<div>{this.state.loggedin ? "" : <Navigate to="/"/>}</div>
				<Header 
					text="dashboard lol" 
					center="true"
				/>
				<Header 
					text={!this.state.info ?  "Loading" : "Your user category is: " + this.state.info}
					center="true"
				/>
			</div>
		);
	}
}

export default Dashboard;