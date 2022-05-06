import React from "react";

import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import MapMyLocation from "./MapMyLocation";

import { getLocation } from "./LocationTracker";

class LocationInput extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			position: [0, 0] // Array of [latitude, longitude]
		};
	}

	componentDidMount() {
		// Attempt to get location on page load, may not work before user interaction but worth a try
		getLocation().then(pos => this.setState({
			position: pos
		}));
	}

	setLatitude = (event) => {
		this.setState(state => {
			return {
				position: [event.target.value, state.position[1]]
			}
		});
	}

	setLongitude = (event) => {
		this.setState(state => {
			return {
				position: [state.position[0], event.target.value]
			}
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
							value={this.state.position[0]}
							onChange={this.setLatitude} // Ensure the marker changes position when this value is changed
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
							value={this.state.position[1]}
							onChange={this.setLongitude} // Ensure the marker changes position when this value is changed
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
			<MapMyLocation
				position={this.state.position}
				setposition={pos => this.setState({ position: pos })}
				style={{ width: "100%", height: "256px" }}
			/>
		</div>
	}
}

export default LocationInput;