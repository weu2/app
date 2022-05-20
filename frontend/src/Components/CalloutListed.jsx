import React from "react";
import { Link } from "react-router-dom";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import MapNearbyProfessionals from "./MapNearbyProfessionals";
import MapCalloutAndMe from "./MapCalloutAndMe";
import LocationLink from "./LocationLink";
import LargeButton from "./LargeButton";
import CustomRating from "./CustomRating";

// api.jsx contains utility functions for getting or sending data from the frontend to the backend
// For example, sending form data or getting user info
import { backendGetCalloutAssignee, backendUpdateCallout } from "../api.jsx";

// Card for rendering each callout along with basic details
class CalloutListed extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			assigneeName: "None", // Assigned service professional name
			status: props.callout.status, // To force UI update when callout is cancelled
			price: props.callout.price, // To force UI update when callout is cancelled
			error: null
		};
	}

	componentDidMount() {
		// Try to get name of assigned service professional
		if (this.props.callout.assignedTo) {
			backendGetCalloutAssignee(this.props.callout.uuid)
				.then(res => this.setState({
					assigneeName: res.name
				}));
		}
	}

	defaultButton() {
		return (
			<Link to={`/callout/${this.props.callout.uuid}`}>
				<LargeButton variant="primary" icon="arrow-right">
					More Info
				</LargeButton>
			</Link>
		);
	}

	denyCallout = () => {
		backendUpdateCallout(this.props.callout.uuid, "new")
			.then(callout => this.setState({
				assigneeName: "None",
				status: callout.status,
				price: callout.price
			})).catch(res => this.setState({
				error: `Error: ${res.status} (${res.statusText})`
			}));
	}

	customerButton() {
		if (this.state.price && !this.props.callout.paymentComplete) {
			// Force customer to pay for callout
			return (<>
				{/* Display an error message if required */}
				{this.state.error && <Alert variant="danger">{this.state.error}</Alert>}
				<Row>
					<Col>
						<Link to={`/callout/${this.props.callout.uuid}/pay`}>
							<Button variant="success" className="w-100">
								Accept Price
							</Button>
						</Link>
					</Col>
					<Col>
						<Button variant="danger" className="w-100" onClick={this.denyCallout}>
							Deny Price
						</Button>
					</Col>
				</Row>
			</>);
		} else if (this.state.status === "finished" && !this.props.callout.review) {
			// Force customer to review callout
			return (
				<Link to={`/callout/${this.props.callout.uuid}/review`}>
					<LargeButton variant="primary" icon="arrow-right">
						Write Review
					</LargeButton>
				</Link>
			);
		} else {
			return this.defaultButton();
		}
	}

	render() {
		return (
			<Card {...this.props}>
				<Card.Header>
					Callout on {new Date(parseInt(this.props.callout.dateTime)).toLocaleString("en-US")}
				</Card.Header>
				<Card.Body className="pb-1">
					<Row>
						<Col sm={7} className="mb-3">
							<Table borderless>
								<tbody>
									{
										this.props.callout.review
										&& <tr>
											<th>Rating</th>
											<td>
												<CustomRating
													size={20}
													initialRating={parseFloat(this.props.callout.review.rating)}
													readonly
												/>
											</td>
										</tr>
									}
									{
										this.props.customer
										? <tr>
											<th>Location</th>
											<td>
												<LocationLink
													latitude={this.props.callout.locationLat}
													longitude={this.props.callout.locationLong}
												/>
											</td>
										</tr>
										: <tr>
											<th>Distance</th>
											<td>{
												typeof this.props.callout.distance === "number"
												? `${this.props.callout.distance.toFixed(3)} km`
												: "Unknown"
											}</td>
										</tr>
									}
									<tr>
										<th>Status</th>
										<td>{this.state.status.toUpperCase()}</td>
									</tr>
									<tr>
										<th>Number Plate</th>
										<td>{this.props.callout.numberPlate}</td>
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
											: "Waiting for service professional to accept"
										}</td>
									</tr>
									{
										(this.state.price && !this.props.callout.paymentComplete)
										? <tr>
											<th>Payment Provided</th>
											<td>No</td>
										</tr>
										: null
									}
									{
										(this.state.status === "finished" && !this.props.callout.review)
										? <tr>
											<th>Review Provided</th>
											<td>No</td>
										</tr>
										: null
									}
								</tbody>
							</Table>
							{this.props.customer ? this.customerButton() : this.defaultButton()}
						</Col>
						<Col sm className="mb-3">
							{
								this.props.customer
								? <MapNearbyProfessionals
									uuid={this.props.callout.uuid}
									position={[this.props.callout.locationLat, this.props.callout.locationLong]}
									className="w-100 h-100"
									style={{ minHeight: "128px" }}
								/>
								// Display two markers for customers and mechanics
								: <MapCalloutAndMe
									position={[this.props.callout.locationLat, this.props.callout.locationLong]}
									className="w-100 h-100"
									style={{ minHeight: "128px" }}
								/>
							}
						</Col>
					</Row>
				</Card.Body>
			</Card>
		);
	}
}

export default CalloutListed;