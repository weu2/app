import React from "react";
import { Navigate } from "react-router-dom";

// <Container> adds padding to the sides of the page content, makes it look nicer
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import CalloutListed from "./CalloutListed";
import { getLocation, getDistance } from "./LocationTracker";

class CalloutList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			loggedIn: true, // Assume user can view page to avoid redirecting early
			sortBy: null, // Sort order defaults to newest first
			callouts: null, // Store all listed callouts
			userType: null // Affects the display of callouts
		}
	}

	calculateDistances(callouts, position) {
		if (!position) return callouts;
		callouts.forEach(callout => {
			callout.distance = getDistance(
				position[0],
				position[1],
				parseFloat(callout.locationLat),
				parseFloat(callout.locationLong)
			);
		});
		return callouts;
	}

	componentDidMount() {
		this.props.endpoint()
			.then(res => {
				this.setState({
					userType: res.type,
					sortBy: res.type === "PROFESSIONAL" ? "closest" : "newest",
					callouts: res.callouts,
				});
				// Attempt to get location on page load, may not work before user interaction but worth a try
				getLocation().then(pos => this.setState({
					callouts: this.calculateDistances(res.callouts, pos)
				}));
			}).catch(() => this.setState({
				// Redirect to /login if user isn't logged in yet
				loggedIn: false
			}));
	}

	sortCallouts() {
		switch (this.state.sortBy) {
			case "closest":
				this.state.callouts.sort((a, b) => a.distance - b.distance);
				break;
			case "furthest":
				this.state.callouts.sort((a, b) => b.distance - a.distance);
				break;
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
		// Create a <CalloutListed> component to display each callout
		return this.state.callouts.map(callout =>
			<CalloutListed
				customer={this.state.userType === "CUSTOMER" ? 1 : 0}
				className="mb-3"
				callout={callout}
				key={callout.uuid}
			/>
		);
	}

	displayHelp() {
		switch (this.state.userType) {
			case "CUSTOMER":
				return this.props.customerhelp;
			case "PROFESSIONAL":
				return this.props.professionalhelp;
			default:
				return "Loading user info...";
		}
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
						<h2>{this.props.title}</h2>
					</Col>
					{
						this.state.callouts && this.state.callouts.length
						? <Col sm>
							<Form.Group as={Row} controlId="formSort">
								<Form.Label column sm={2}>Sort by</Form.Label>
								<Col>
									<Form.Select onChange={e => this.setState({ sortBy: e.target.value })}>
										{ // Professionals have distance sorting abilities
											this.state.userType === "PROFESSIONAL" ? <>
												<option value="closest">Closest to furthest</option>
												<option value="furthest">Furthest to closest</option>
											</> : null
										}
										<option value="newest">Newest to oldest</option>
										<option value="oldest">Oldest to newest</option>
									</Form.Select>
								</Col>
							</Form.Group>
						</Col>
						: null
					}
				</Row>

				{ // Display callouts if they exist
					this.state.callouts && this.state.callouts.length
					? this.generateCallouts()
					: this.displayHelp()
				}
			</Container>
		);
	}
}

export default CalloutList;