import React from "react";
import { Link } from "react-router-dom";

// <Container> adds padding to the sides of the page content, makes it look nicer
import Container from "react-bootstrap/Container";

// <Alert> is useful for displaying success or error messages, see react-bootstrap.github.io/components/alerts/
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Image from "react-bootstrap/Image";

import MapCalloutAndMe from "../Components/MapCalloutAndMe";
import { getLocation, getDistance } from "../Components/LocationTracker";

// api.jsx contains utility functions for getting or sending data from the frontend to the backend
// For example, sending form data or getting user info
import { backendGetCallout, backendUpdateCallout } from "../api.jsx";

class CalloutDetails extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			// useParams would be better, but doesn't work with React classes
			id: decodeURIComponent(document.location.pathname.split("/").pop()),
			error: null, // Error message to display if required
			callout: null, // Callout JSON data, may not trigger page update
			status: null, // Status of the callout, e.g. "NEW", "INPROGRESS", "FINISHED"
			assignedName: null, // Assigned service professional name, triggers page update
			distance: null // Distance to callout in kilometers
		};
	}

	componentDidMount() {
		backendGetCallout(this.state.id)
			.then(res => {
				this.setState({
					status: res.status,
					assignedName: res.assignedName,
					callout: res
				});

				// Attempt to get location on page load, may not work before user interaction but worth a try
				getLocation(navigator).then(pos => this.setState({
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
				assignedName: callout.assignedName
			})).catch(res => this.setState({
				error: `Error: ${res.status} (${res.statusText})`
			}));
	};
	
	render() {
		return (
			<Container>
				{/* Show error message if required */}
				{this.state.error ? <Alert variant="danger">{this.state.error}</Alert> : null}
				{this.state.callout ?
				<div>
					<h2 className="mb-4">Callout on {new Date(parseInt(this.state.callout.dateTime)).toLocaleString("en-US")}</h2>
					<MapCalloutAndMe
						position={[this.state.callout.locationLat, this.state.callout.locationLong]}
						style={{ width: "100%", height: "256px" }}
					/>
					<Table bordered striped>
						<tbody>
							<tr>
								<th>Location</th>
								<td>
									<a
										className="text-body"
										href={`https://www.google.com/maps?q=${this.state.callout.locationLat},${this.state.callout.locationLong}`}
										target="_blank"
										rel="noopener noreferrer"
									>
										{this.state.callout.locationLat}, {this.state.callout.locationLong}
									</a>
								</td>
							</tr>
							<tr>
								<th>Distance</th>
								<td>{
									this.state.distance === null
									? "Unknown"
									: `${this.state.distance.toFixed(3)} km`
								}</td>
							</tr>
							<tr>
								<th>Status</th>
								<td>{this.state.status.toUpperCase()}</td>
							</tr>
							<tr>
								<th>Assigned To</th>
								<td>{this.state.assignedName ? this.state.assignedName : "None"}</td>
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
					<Row>
						{ // New callouts can be accepted or denied
							this.state.status === "new"
							? <>
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
							</> : null
						}
						{ // Accepted callouts can be marked as in progress
							this.state.status === "accepted"
							? <Button
								variant="success"
								className="mb-3"
								onClick={() => this.updateCallout("inprogress")}
							>
								Arrived on site
							</Button> : null
						}
						{ // In progress callouts can be marked as finished
							this.state.status === "inprogress"
							? <Button
								variant="success"
								className="mb-3"
								onClick={() => this.updateCallout("finished")}
							>
								Finished working
							</Button> : null
						}
					</Row>
				</div>
				: <Alert variant="info">Loading callout details...</Alert>}
			</Container>
		);
	}
}

export default CalloutDetails;