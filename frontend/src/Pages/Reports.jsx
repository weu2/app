import React from "react";

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
			types: null
		};
	}

	componentDidMount() {
		backendGetReportTypes()
			.then(res => this.setState({
				types: res
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
			{
				this.state.types 
				?
				this.state.types.map(e => <LargeButton className="mb-3" icon="arrow-right" key={e} onClick={() => this.makeReport(e)}>{`Generate and download ${e} report`}</LargeButton>)
				:
				<CustomSpinner label="Loading callout details..."/>
			}
			</Container>
		);
	}
}

export default Reports;