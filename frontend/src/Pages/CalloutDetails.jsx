import React from "react";
import { Link, Navigate } from "react-router-dom";

// <Container> adds padding to the sides of the page content, makes it look nicer
import Container from "react-bootstrap/Container";

// <Alert> is useful for displaying success or error messages, see react-bootstrap.github.io/components/alerts/
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Image from "react-bootstrap/Image";

import LocationLink from "../Components/LocationLink";
import MapCalloutAndMe from "../Components/MapCalloutAndMe";
import MapNearbyProfessionals from "../Components/MapNearbyProfessionals";
import { getLocation, getDistance } from "../Components/LocationTracker";

// api.jsx contains utility functions for getting or sending data from the frontend to the backend
// For example, sending form data or getting user info
import { backendGetCallout, backendUpdateCallout, backendGetUserInfo } from "../api.jsx";

class CalloutDetails extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			// useParams would be better, but doesn't work with React classes
			id: decodeURIComponent(document.location.pathname.split("/").pop()),
			error: null, // Error message to display if required
			callout: null, // Callout JSON data, may not trigger page update
			status: null, // Status of the callout, e.g. "NEW", "INPROGRESS", "FINISHED"
			assignedTo: null, // Assigned service professional name, triggers page update
			distance: null, // Distance to callout in kilometers
			loggedIn: true, // Assume user can view page to avoid redirecting early
			userType: null, // CUSTOMER or PROFESSIONAL
			nearby: null // Array of nearby service professionals
		};
	}

	componentDidMount() {

		backendGetUserInfo()
			.then(res => this.setState({
				userType: res.type
			})).catch(() => this.setState({
				// Redirect to /login if user isn't logged in yet
				loggedIn: false
			}));

		backendGetCallout(this.state.id)
			.then(res => {
				this.setState({
					status: res.status,
					assignedTo: res.assignedTo,
					callout: res
				});

				// Attempt to get location on page load, may not work before user interaction but worth a try
				getLocation().then(pos => this.setState({
					distance: getDistance(
						pos[0],
						pos[1],
						parseFloat(res.locationLat),
						parseFloat(res.locationLong)
					)
				}));
			}).catch(res => this.setState({
				error: `Error: ${res.status} (${res.statusText})`
			}));
	}

	updateCallout = (status) => {
		backendUpdateCallout(this.state.id, status)
			.then(callout => this.setState({
				status: status,
				assignedTo: callout.assignedTo
			})).catch(res => this.setState({
				error: `Error: ${res.status} (${res.statusText})`
			}));
	};

	drawCalloutButtons() {
		switch (this.state.status) {
			case "new":
				return (
					<Row>
						<Col>
							<Button
								variant="success"
								style={{ width: "100%" }}
								className="mb-3"
								onClick={() => this.updateCallout("accepted")}
							>
								Accept
							</Button>
						</Col>
						<Col>
							<Link to="/findcallouts">
								<Button
									variant="danger"
									style={{ width: "100%" }}
									className="mb-3"
								>
									Deny
								</Button>
							</Link>
						</Col>
					</Row>
				);
			case "accepted":
				return (
					<Row>
						<Button
							variant="success"
							className="mb-3"
							onClick={() => this.updateCallout("inprogress")}
						>
							Arrived on site
						</Button>
					</Row>
				);
			case "inprogress":
				return (
					<Row>
						<Button
							variant="success"
							className="mb-3"
							onClick={() => this.updateCallout("finished")}
						>
							Finished working
						</Button>
					</Row>
				);
			case "finished":
			default:
				return null;
		}
	}
	
	render() {
		return (
			<Container>
				{/* Show error message if required */}
				{this.state.error ? <Alert variant="danger">{this.state.error}</Alert> : null}

				{/* Redirect to /login if the user cannot view this page */}
				{this.state.loggedIn ? null : <Navigate to="/login"/>}

				{this.state.callout ?
				<>
					<h2 className="mb-4">Callout on {new Date(parseInt(this.state.callout.dateTime)).toLocaleString("en-US")}</h2>
					{
						this.state.userType === "CUSTOMER"
						? <MapNearbyProfessionals
							uuid={this.state.id}
							position={[this.state.callout.locationLat, this.state.callout.locationLong]}
							style={{ width: "100%", height: "256px" }}
							ondata={nearby => this.setState({ nearby: nearby })}
						/>
						: <MapCalloutAndMe
							position={[this.state.callout.locationLat, this.state.callout.locationLong]}
							style={{ width: "100%", height: "256px" }}
						/>
					}
					<Table bordered striped>
						<tbody>
							<tr>
								<th>Location</th>
								<td>
									<LocationLink
										latitude={this.state.callout.locationLat}
										longitude={this.state.callout.locationLong}
									/>
								</td>
							</tr>
							{
								this.state.userType === "PROFESSIONAL"
								? <tr>
									<th>Distance</th>
									<td>{
										this.state.distance === null
										? "Unknown"
										: `${this.state.distance.toFixed(3)} km`
									}</td>
								</tr>
								: null
							}
							<tr>
								<th>Status</th>
								<td>{this.state.status.toUpperCase()}</td>
							</tr>
							<tr>
								<th>Assigned To</th>
								<td>{this.state.assignedTo ? this.state.assignedTo : "None"}</td>
							</tr>
							<tr>
								<th>Number Plate</th>
								<td>{this.state.callout.numberPlate}</td>
							</tr>
							<tr>
								<th>Description</th>
								<td>{this.state.callout.description}</td>
							</tr>
							{
								this.state.callout.images && this.state.callout.images.length
								? <tr>
									<td colSpan={2}>
										{this.state.callout.images.map((image, index) =>
											<Image
												src={`/api/v1/image/${image}`}
												key={index}
												width={256}
												thumbnail
											/>
										)}
									</td>
								</tr>
								: null
							}
						</tbody>
					</Table>
					{
						this.state.userType === "PROFESSIONAL"
						? this.drawCalloutButtons()
						: null
					}
					{
						this.state.nearby
						? <>
							<h4 className="mt-4 mb-3">Nearby Professionals</h4>
							<Table striped bordered hover>
								<thead>
									<tr>
										<th>Name</th>
										<th>Location</th>
										<th>Distance</th>
									</tr>
								</thead>
								<tbody>{
									this.state.nearby.map((pro, index) =>
										<tr key={index}>
											<td>{pro.name}</td>
											<td>
												<LocationLink
													latitude={pro.position[0]}
													longitude={pro.position[1]}
												/>
											</td>
											<td>{pro.distance.toFixed(3)} km</td>
										</tr>
									)
								}</tbody>
							</Table>
						</> : null
					}
				</>
				: <Alert variant="info">Loading callout details...</Alert>}
			</Container>
		);
	}
}

export default CalloutDetails;