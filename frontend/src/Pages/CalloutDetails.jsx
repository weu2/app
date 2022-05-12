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
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Spinner from "react-bootstrap/Spinner";

import LocationLink from "../Components/LocationLink";
import UrlPartGrabber from "../Components/UrlPartGrabber";
import MapCalloutAndMe from "../Components/MapCalloutAndMe";
import MapNearbyProfessionals from "../Components/MapNearbyProfessionals";
import CalloutImageInput from "../Components/CalloutImageInput";
import { getLocation, getDistance } from "../Components/LocationTracker";

// api.jsx contains utility functions for getting or sending data from the frontend to the backend
// For example, sending form data or getting user info
import { backendGetCallout, backendUpdateCallout, backendGetUserInfo, backendGetCalloutAssignee } from "../api.jsx";

class CalloutDetails extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			error: null, // Error message to display if required
			callout: null, // Callout JSON data, may not trigger page update
			status: null, // Status of the callout, e.g. "NEW", "INPROGRESS", "FINISHED"
			price: null, // Price of callout as received from database
			assigneeName: "None", // Assigned service professional name
			distance: null, // Distance to callout in kilometers
			loggedIn: true, // Assume user can view page to avoid redirecting early
			userType: null, // CUSTOMER or PROFESSIONAL
			userName: "You", // Name to display to service professionals
			nearby: null, // Array of nearby service professionals
			inputPrice: "120" // Price of callout as displayed in input
		};
	}

	componentDidMount() {
		backendGetUserInfo()
			.then(res => this.setState({
				userType: res.type,
				userName: `${res.firstName} ${res.lastName}`
			})).catch(() => this.setState({
				// Redirect to /login if user isn't logged in yet
				loggedIn: false
			}));
	}

	loadCallout = (params) => {
		backendGetCallout(params.id).then(res => {
			this.setState({
				status: res.status,
				price: res.price,
				callout: res
			});

			if (res.assignedTo) {
				backendGetCalloutAssignee(params.id)
					.then(res => this.setState({
						assigneeName: res.name
					}));
			}

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
		backendUpdateCallout(this.state.callout.uuid, status, this.state.inputPrice)
			.then(callout => this.setState({
				status: callout.status,
				price: callout.price,
				assigneeName: this.state.userName
			})).catch(res => this.setState({
				error: `Error: ${res.status} (${res.statusText})`
			}));
	};

	drawCalloutButtons() {
		switch (this.state.status) {
			case "new":
				return (<>
					<Row className="mb-3">
						<Form.Group controlId="formPrice">
							<Form.Label>Please provide your service fee:</Form.Label>
							<InputGroup>
								<InputGroup.Text>$</InputGroup.Text>
								<Form.Control
									name="price"
									type="number"
									value={this.state.inputPrice}
									onInput={e => this.setState({ inputPrice: e.target.value })}
									required
								/>
							</InputGroup>
						</Form.Group>
					</Row>
					<Row>
						<Col>
							<Button
								variant="success"
								className="mb-3 w-100"
								onClick={() => this.updateCallout("accepted")}
							>
								Accept
							</Button>
						</Col>
						<Col>
							<Link to="/findcallouts">
								<Button variant="danger" className="mb-3 w-100">
									Deny
								</Button>
							</Link>
						</Col>
					</Row>
				</>);
			case "accepted":
				return (
					<Button
						variant="success"
						className="mb-3 w-100"
						onClick={() => this.updateCallout("inprogress")}
					>
						Arrived on site
					</Button>
				);
			case "inprogress":
				return (
					<Button
						variant="success"
						className="mb-3 w-100"
						onClick={() => this.updateCallout("finished")}
					>
						Finished working
					</Button>
				);
			case "finished":
			default:
				return null;
		}
	}

	showDetails() {
		return (
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
						&& <tr>
							<th>Distance</th>
							<td>{
								this.state.distance === null
								? "Unknown"
								: `${this.state.distance.toFixed(3)} km`
							}</td>
						</tr>
					}
					<tr>
						<th>Status</th>
						<td>{this.state.status.toUpperCase()}</td>
					</tr>
					<tr>
						<th>Number Plate</th>
						<td>{this.state.callout.numberPlate}</td>
					</tr>
					<tr>
						<th>Assigned To</th>
						<td>{this.state.assigneeName}</td>
					</tr>
					<tr>
						<th>Price</th>
						<td>{
							this.state.price
							? `$${parseFloat(this.state.price).toFixed(2)}`
							: "Waiting for service professional"
						}</td>
					</tr>
					{
						this.state.price
						&& <tr>
							<th>Payment Provided</th>
							<td>{this.state.callout.paymentComplete ? "Yes" : "No"}</td>
						</tr>
					}
					<tr>
						<th>Description</th>
						<td>{this.state.callout.description}</td>
					</tr>
					{
						(this.state.userType === "CUSTOMER" || (this.state.callout.images && this.state.callout.images.length))
						? <tr>
							<td className="p-0" colSpan={2}>
								<CalloutImageInput
									callout={this.state.callout}
									customer={this.state.userType === "CUSTOMER" ? 1 : 0}
								/>
							</td>
						</tr>
						: null
					}
				</tbody>
			</Table>
		);
	}

	showMap() {
		return (
			this.state.userType === "CUSTOMER"
			? <MapNearbyProfessionals
				uuid={this.state.callout.uuid}
				position={[this.state.callout.locationLat, this.state.callout.locationLong]}
				className="w-100"
				style={{ height: "256px" }}
				ondata={nearby => this.setState({ nearby: nearby })}
			/>
			: <MapCalloutAndMe
				position={[this.state.callout.locationLat, this.state.callout.locationLong]}
				className="w-100"
				style={{ height: "256px" }}
			/>
		);
	}

	showNearby() {
		return (
			(this.state.nearby && this.state.nearby.length)
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
			</>
			: null
		);
	}
	
	render() {
		return (
			<Container>
				{/* Get callout ID from URL */}
				<UrlPartGrabber onload={this.loadCallout}/>

				{/* Show error message if required */}
				{this.state.error && <Alert variant="danger">{this.state.error}</Alert>}

				{/* Redirect to /login if the user cannot view this page */}
				{!this.state.loggedIn && <Navigate to="/login"/>}

				{
					this.state.callout
					? <>
						<h2 className="mb-4">Callout on {new Date(parseInt(this.state.callout.dateTime)).toLocaleString("en-US")}</h2>
						{this.showMap()}
						{this.showDetails()}
						{this.state.userType === "PROFESSIONAL" && this.drawCalloutButtons()}
						{this.showNearby()}
					</>
					: <Spinner variant="primary" animation="border" role="status">
						<span className="visually-hidden">Loading callout details...</span>
					</Spinner>
				}
			</Container>
		);
	}
}

export default CalloutDetails;