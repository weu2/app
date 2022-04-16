import React from "react";
import { Navigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";

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

	buildTable = (data) => {
		return (
			<Table striped bordered hover>
				<thead>
					<tr>
						<th>Key</th>
						<th>Value</th>
					</tr>
				</thead>
				<tbody>{
					Object.entries(data).map(elem => 
						<tr key={elem[0]}>
							<td>{elem[0]}</td>
							<td>{
								typeof elem[1] === "string"
								? elem[1]
								: JSON.stringify(elem[1])
							}</td>
						</tr>
					)
				}</tbody>
			</Table>
		);
	}

	render() {
		return (
			<Container>
				{this.state.loggedIn ? null : <Navigate to="/login"/>}
				<h1 class="mb-4">Dashboard Test</h1>
				{this.state.data ? this.buildTable(this.state.data) : null}
			</Container>
		);
	}
}

export default Dashboard;