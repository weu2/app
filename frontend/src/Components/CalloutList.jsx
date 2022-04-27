import React from "react";
import { Navigate, Link } from "react-router-dom";

// <Container> adds padding to the sides of the page content, makes it look nicer
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import CalloutListed from "../Components/CalloutListed";

class CalloutList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			loggedIn: true, // Assume user can view page to avoid redirecting early
			sortBy: null, // Sort order defaults to newest first
			callouts: null, // Store all listed callouts
			userType: null, // Affects the display of callouts
			mechanicPos: null // Only provided if the user is a professional
		}
	}

	calculateDistances(callouts, mechanicPos) {
		if (!mechanicPos) return callouts;
		callouts.forEach(callout => {
			const dLat = mechanicPos[0] - parseFloat(callout.locationLat);
			const dLong = mechanicPos[1] - parseFloat(callout.locationLong);
			const degrees = Math.sqrt((dLat * dLat) + (dLong * dLong));
			callout.distance = degrees * 110.574; // store distance for display and sorting on frontend
		});
		return callouts;
	}

	componentDidMount() {
		this.props.endpoint()
			.then(res => this.setState({
				userType: res.type,
				sortBy: res.type === "PROFESSIONAL" ? "closest" : "newest",
				callouts: this.calculateDistances(res.callouts, res.position),
				mechanicPos: res.position
			})).catch(() => this.setState({
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
				mechanicpos={this.state.mechanicPos}
			/>
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
						<h2>{this.props.title}</h2>
					</Col>
					{
						this.state.callouts && this.state.callouts.length
						? <Col sm>
							<Form.Group as={Row} controlId="formSort">
								<Form.Label column sm={2}>Sort by</Form.Label>
								<Col>
									<Form.Select onChange={this.updateSort}>
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

				{/* Display callouts if they exist */}
				{
					this.state.callouts && this.state.callouts.length
					? this.generateCallouts()
					: (
						this.state.userType === "CUSTOMER"
						? <>
							<p>Callouts you opened will be listed here.</p>
							<p>
								Use the top menu to <Link to="/requestcallout" className="text-decoration-none">request a callout.</Link>
							</p>
						</>
						: <>
							<p>Callouts you accepted will be listed here.</p>
							<p>
								Use the top menu to <Link to="/findcallouts" className="text-decoration-none">find new callouts.</Link>
							</p>
						</>
					)
				}
			</Container>
		);
	}
}

export default CalloutList;