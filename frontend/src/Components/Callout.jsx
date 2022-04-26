import React from "react";

import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import SingleMarkerMap from "./SingleMarkerMap";
import CalloutImageInput from "./CalloutImageInput";

// Card for rendering each callout along with basic details
class Callout extends React.Component {

	render() {
		return (
			<Card {...this.props}>
				<Card.Header>
					Callout on {new Date(parseInt(this.props.callout.dateTime)).toLocaleString("en-US")}
				</Card.Header>
				<Card.Body>
					<Row className="mb-3">
						<Col sm={7}>
							<Table borderless>
								<tbody>
									<tr>
										<th>Status</th>
										<td>{this.props.callout.status.toUpperCase()}</td>
									</tr>
									<tr>
										<th>Assigned To</th>
										<td>{this.props.callout.assignedTo ? this.props.callout.assignedTo : "None"}</td>
									</tr>
									<tr>
										<th>Number Plate</th>
										<td>{this.props.callout.numberPlate}</td>
									</tr>
									<tr>
										<th>Location</th>
										<td>
											<a
												href={`https://www.google.com/maps?q=${this.props.callout.locationLat},${this.props.callout.locationLong}`}
												target="_blank"
												rel="noopener noreferrer"
												className="text-decoration-none"
											>
												{this.props.callout.locationLat}, {this.props.callout.locationLong}
											</a>
										</td>
									</tr>
								</tbody>
							</Table>

							{/* Allow user to attach images to each callout */}
							<CalloutImageInput callout={this.props.callout} />
						</Col>
						<Col sm>
							<SingleMarkerMap
								position={[
									this.props.callout.locationLat,
									this.props.callout.locationLong
								]}
								style={{ width: "100%", height: "100%", minHeight: "128px" }}
							/>
						</Col>
					</Row>
				</Card.Body>
			</Card>
		);
	}
}

export default Callout;