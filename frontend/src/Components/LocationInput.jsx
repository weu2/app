import React from "react";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import SingleMarkerMap from "../Components/SingleMarkerMap";

class LocationInput extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			position: null, // Array of [latitude, longitude]
		};
	}

	componentDidMount() {
		// Attempt to get location on page load, may not work before user interaction but worth a try
		this.getLocation();
	}

	getLocation = () => {
		// Ensure geolocation API exists
		if (!("geolocation" in navigator)) {
			this.setState({
				error: "Error: Geolocation is not supported on your browser!"
			});
			return;
		}
		
		// This uses the Web Geolocation API, see www.w3schools.com/html/html5_geolocation.asp
		navigator.geolocation.getCurrentPosition(pos => {
			const coords = [pos.coords.latitude, pos.coords.longitude];
			// Update state
			this.setState({
				status: "Got your location! (Roughly)", // More accurate on mobile
				position: coords
			});
		}, error => this.setState({
			error: `Error: ${error.message}`
		}), {
			enableHighAccuracy: true // May improve the accuracy on mobile
		});
	}

	render() {
		return <div {...this.props}>
			<Row>
				<Col>
					<Form.Group className="mb-3" controlId="formLatitude">
						<Form.Label>Latitude</Form.Label>
						<Form.Control
							name="locationLat"
							type="number" // Standard HTML input type, for valid values check www.w3schools.com/html/html_form_input_types.asp
							value={this.state.position ? this.state.position[0] : ""}
							onChange={e => this.setState({
								position: [e.target.value, this.state.position[1]] // Ensure the marker changes position when this value is changed
							})}
							step="0.0001"
							required
						/>
						{/* Display feedback message if the user screws up the input, see react-bootstrap.github.io/forms/validation/ */}
						<Form.Control.Feedback type="invalid">
							Please provide a latitude.
						</Form.Control.Feedback>
					</Form.Group>
				</Col>
				<Col>
					<Form.Group className="mb-3" controlId="formLongitude">
						<Form.Label>Longitude</Form.Label>
						<Form.Control
							name="locationLong"
							type="number" // Standard HTML input type, for valid values check www.w3schools.com/html/html_form_input_types.asp
							value={this.state.position ? this.state.position[1] : ""}
							onChange={e => this.setState({
								position: [this.state.position[0], e.target.value]// Ensure the marker changes position when this value is changed
							})}
							step="0.0001"
							required
						/>
						{/* Display feedback message if the user screws up the input, see react-bootstrap.github.io/forms/validation/ */}
						<Form.Control.Feedback type="invalid">
							Please provide a longitude.
						</Form.Control.Feedback>
					</Form.Group>
				</Col>
			</Row>
			{
				this.state.position
				? <SingleMarkerMap
					position={this.state.position}
					style={{ width: "100%", height: "192px" }}
				/> : <Button variant="secondary" onClick={this.getLocation}>Get position</Button>
			}
		</div>
	}
}

export default LocationInput;