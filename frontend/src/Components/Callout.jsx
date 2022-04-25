import React from "react";

import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";

import { backendUploadImage } from "../api.jsx";

class Callout extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			images: props.callout.images, // Images if any were uploaded
			error: null // Display failure message if an error occurs
		}
	}

	loadImage = (event) => {
		// ensure at least one image was attached
		if (event.target.files.length === 0) return;
		// Get form element manually
		const form = document.getElementById("imageForm");
		backendUploadImage(new FormData(form))
			.then(res => this.setState({
				// Add preview for uploaded image
				images: [...this.state.images, res.uuid]
			})).catch(res => this.setState({
				// Show error message
				error: `Error: ${res.status} (${res.statusText})`
			}));
	}

	render() {
		return (
			<Card {...this.props} theme="primary">
				<Card.Header>
					<span>
						Callout {this.props.index} ({this.props.callout.status})
					</span>
					<span className="float-end">
						{new Date(this.props.callout.dateTime).toLocaleString("en-US")}
					</span>
				</Card.Header>
				<Card.Body>
					<Table borderless>
						<thead>
							<tr>
								<th>Assigned to</th>
								<th>Number Plate</th>
								<th>Latitude</th>
								<th>Longitude</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>{this.props.callout.assignedTo ? this.props.callout.assignedTo : "None"}</td>
								<td>{this.props.callout.numberPlate}</td>
								<td>{this.props.callout.locationLat}</td>
								<td>{this.props.callout.locationLong}</td>
							</tr>
						</tbody>
					</Table>

					{/* Display an error message if required */}
					{this.state.error ? <Alert variant="danger">{this.state.error}</Alert> : null}

					{/* Allow user to attach images to each callout */}
					<Form noValidate id="imageForm">
						<Form.Group controlId="formImage">
							<Form.Label>Attach photos below:</Form.Label>
							<Form.Control name="image" type="file" accept="image/jpeg" capture onChange={this.loadImage} />
							<Form.Control name="calloutid" type="hidden" value={this.props.callout.uuid} />
							{/* Display preview of attached images */}
							{
								this.state.images.map((image, index) =>
									<Image src={`/api/v1/image/${image}`} key={index} thumbnail width={256}/>
								)
							}
						</Form.Group>
					</Form>
				</Card.Body>
			</Card>
		);
	}
}

export default Callout;