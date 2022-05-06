import React from "react";
import { Link } from "react-router-dom";

import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import MapNearbyProfessionals from "./MapNearbyProfessionals";
import MapCalloutAndMe from "./MapCalloutAndMe";
import LocationLink from "./LocationLink";
import LargeButton from "./LargeButton";

// Card for rendering each callout along with basic details
class CalloutListed extends React.Component {

	render() {
		return (
			<Card {...this.props}>
				<Card.Header>
					Callout on {new Date(parseInt(this.props.callout.dateTime)).toLocaleString("en-US")}
				</Card.Header>
				<Card.Body>
					<Row>
						<Col sm={7}>
							<Table borderless>
								<tbody>
									<tr>
										<th>Status</th>
										<td>{this.props.callout.status.toUpperCase()}</td>
									</tr>
									<tr>
										<th>Assigned To</th>
										<td>{
											this.props.callout.assignedTo
											? this.props.callout.assignedTo
											: "None"
										}</td>
									</tr>
									<tr>
										<th>Number Plate</th>
										<td>{this.props.callout.numberPlate}</td>
									</tr>
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
												this.props.callout.distance === undefined
												? "Unknown"
												: `${this.props.callout.distance.toFixed(3)} km`
											}</td>
										</tr>
									}
									
								</tbody>
							</Table>
							<Link to={`/callout/${this.props.callout.uuid}`}>
								<LargeButton variant="primary" icon="arrow-right">More info</LargeButton>
							</Link>
						</Col>
						<Col sm>
							{
								this.props.customer
								? <MapNearbyProfessionals
									uuid={this.props.callout.uuid}
									position={[this.props.callout.locationLat, this.props.callout.locationLong]}
									style={{ width: "100%", height: "100%", minHeight: "128px" }}
								/>
								// Display two markers for customers and mechanics
								: <MapCalloutAndMe
									position={[this.props.callout.locationLat, this.props.callout.locationLong]}
									style={{ width: "100%", height: "100%", minHeight: "128px" }}
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