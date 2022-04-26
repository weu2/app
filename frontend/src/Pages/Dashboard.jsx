import React from "react";
import { Navigate, Link } from "react-router-dom";

// <Container> adds padding to the sides of the page content, makes it look nicer
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Callout from "../Components/Callout";

// api.jsx contains utility functions for getting or sending data from the frontend to the backend
// For example, sending form data or getting user info
import { backendGetCallouts } from "../api.jsx";

class Dashboard extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			loggedIn: true, // Assume user can view page to avoid redirecting early
			sortBy: "newest", // Sort order defaults to newest first
			callouts: null // Store all listed callouts
		}
	}

	componentDidMount() {
		backendGetCallouts()
			.then(res => this.setState({
				callouts: res
			})).catch(() => this.setState({
				// Redirect to /login if user isn't logged in yet
				loggedIn: false
			}));
	}

	sortCallouts() {
		// Currently only two sorting modes, both operate on strings
		switch (this.state.sortBy) {
			case "oldest":
				this.state.callouts.sort((a, b) => a.dateTime.localeCompare(b.dateTime));
				break;
			case "newest":
			default:
				this.state.callouts.sort((a, b) => b.dateTime.localeCompare(a.dateTime));
				break;
		}
	}

	generateCallouts() {
		// Ensure callouts are sorted before rendering
		this.sortCallouts();
		// Create a <Callout> component to display each callout
		return this.state.callouts.map((callout, index) =>
			<Callout className="mb-3" callout={callout} key={callout.uuid} index={index + 1} />
		);
	}

	updateSort = (event) => {
		this.setState({
			sortBy: event.target.value
		});
	}

	render() {
		return (
			// <Container> adds padding around the website content, makes it look nicer
			<Container>
				{/* Redirect to /login if the user is not logged in yet */}
				{this.state.loggedIn ? null : <Navigate to="/login"/>}

				{/* "mb-3" is a Bootstrap CSS class for setting margin-bottom, see getbootstrap.com/docs/5.1/utilities/spacing/ */}
				<Row className="mb-3">
					<Col>
						<h2>Dashboard</h2>
					</Col>
					{
						this.state.callouts && this.state.callouts.length
						? <Col sm>
							<Form.Group as={Row} controlId="formSort">
								<Form.Label column sm={2}>Sort by</Form.Label>
								<Col>
									<Form.Select onChange={this.updateSort}>
										<option defaultValue value="newest">Newest to oldest</option>
										<option value="oldest">Oldest to newest</option>
									</Form.Select>
								</Col>
							</Form.Group>
						</Col>
						: null
					}
				</Row>

				{/* Display callouts if they exist */}
				{
					this.state.callouts && this.state.callouts.length
					? this.generateCallouts()
					: <div>
						<p>
							Callouts will be listed here.
						</p>
						<p>
							Use the top menu to <Link to="/requestcallout" className="text-decoration-none">request a callout.</Link>
						</p>
					</div>
				}
			</Container>
		);
	}
}

export default Dashboard;