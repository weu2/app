import React from "react";
import { Navigate } from "react-router-dom";

// <Container> adds padding to the sides of the page content, makes it look nicer
import Container from "react-bootstrap/Container";

import CustomSpinner from "../Components/CustomSpinner";
import LargeButton from "../Components/LargeButton";

// api.jsx contains utility functions for getting or sending data from the frontend to the backend
// For example, sending form data or getting user info
import { backendGetReportTypes, backendGetReport } from "../api.jsx";

class Reports extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			types: null,
			loggedIn: true
		};
	}

	componentDidMount() {
		backendGetReportTypes()
			.then(res => this.setState({
				types: res
			})).catch(() => this.setState({
				loggedIn: false
			}));
	}

	makeReport(reportType) {
		backendGetReport(reportType)
			.then(res => {
				window.open(URL.createObjectURL(res));
			});
	}
	
	render() {
		return (
			<Container>
				<h2 className="mb-4">Reports</h2>

				{/* Redirect to /login if not logged in */}
				{!this.state.loggedIn && <Navigate to="/login"/>}
				{
					this.state.types
					? this.state.types.map(type =>
						<LargeButton key={type} className="mb-3" icon="arrow-right" onClick={() => this.makeReport(type)}>
							{`Download ${type} report`}
						</LargeButton>
					)
					: <CustomSpinner label="Loading report types..."/>
				}
			</Container>
		);
	}
}

export default Reports;