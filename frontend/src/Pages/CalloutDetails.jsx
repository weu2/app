import React from "react";
import { Link, useParams } from "react-router-dom";

// <Container> adds padding to the sides of the page content, makes it look nicer
import Container from "react-bootstrap/Container";

// <Alert> is useful for displaying success or error messages, see react-bootstrap.github.io/components/alerts/
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Image from "react-bootstrap/Image";

import MapSingleMarker from "../Components/MapSingleMarker";

// api.jsx contains utility functions for getting or sending data from the frontend to the backend
// For example, sending form data or getting user info
import { backendGetCallout, backendUpdateCallout } from "../api.jsx";

// This is a React function instead of a React class because useParams() requires it
function CalloutDetails() {
	const { id } = useParams();
	const [error, setError] = React.useState(null);
	const [callout, setCallout] = React.useState(null);
	const [status, setStatus] = React.useState(null);

	const updateCallout = (_status) => {
		backendUpdateCallout(id, _status)
			.then(() => {
				setStatus(_status);
			}).catch(res => {
				setError(`Error: ${res.status} (${res.statusText})`);
			})
	};

	React.useEffect(() => {
		backendGetCallout(id)
			.then(res => {
				setStatus(res.status);
				setCallout(res);
			}).catch(res => {
				setError(`Error: ${res.status} (${res.statusText})`);
			});
	}, [id, setCallout]);
	
	return (
		<Container>
			{/* Show error message if required */}
			{error ? <Alert variant="danger">{error}</Alert> : null}
			{callout ?
			<div>
				<h2 className="mb-4">Callout on {new Date(parseInt(callout.dateTime)).toLocaleString("en-US")}</h2>
				<MapSingleMarker
					position={[
						callout.locationLat,
						callout.locationLong
					]}
					style={{ width: "100%", height: "256px" }}
				/>
				<Table bordered striped>
					<tbody>
						<tr>
							<th>Location</th>
							<td>
								<a
									className="text-body"
									href={`https://www.google.com/maps?q=${callout.locationLat},${callout.locationLong}`}
									target="_blank"
									rel="noopener noreferrer"
								>
									{callout.locationLat}, {callout.locationLong}
								</a>
							</td>
						</tr>
						<tr>
							<th>Status</th>
							<td>{status.toUpperCase()}</td>
						</tr>
						<tr>
							<th>Assigned To</th>
							<td>{callout.assignedTo ? callout.assignedTo : "None"}</td>
						</tr>
						<tr>
							<th>Number Plate</th>
							<td>{callout.numberPlate}</td>
						</tr>
						<tr>
							<th>Description</th>
							<td>{callout.description}</td>
						</tr>
						{
							callout.images && callout.images.length
							? <tr>
								<td colSpan={2}>
									{callout.images.map((image, index) =>
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
						status === "new"
						? <>
							<Col>
								<Button variant="success" style={{ width: "100%" }} className="mb-3" onClick={() => updateCallout("accepted")}>
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
						status === "accepted"
						? <Button variant="success" className="mb-3" onClick={() => updateCallout("inprogress")}>
							Arrived on site
						</Button> : null
					}
					{ // In progress callouts can be marked as finished
						status === "inprogress"
						? <Button variant="success" className="mb-3" onClick={() => updateCallout("finished")}>
							Finished working
						</Button> : null
					}
				</Row>
			</div>
			: <Alert variant="info">Loading callout details...</Alert>}
		</Container>
	);
}

export default CalloutDetails;