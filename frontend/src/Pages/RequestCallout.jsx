import React from "react";
import { Navigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// <Container> adds padding to the sides of the page content, makes it look nicer
import Container from "react-bootstrap/Container";

// <Alert> is useful for displaying success or error messages, see react-bootstrap.github.io/components/alerts/
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// <LargeButton> is a subclass of React Bootstrap's <Button> with an icon added to the right side
import LargeButton from "../Components/LargeButton";

// api.jsx contains utility functions for getting or sending data from the frontend to the backend
// For example, sending form data or getting user info
import { backendGetUserInfo, backendCreateCallout } from "../api.jsx";

// Fix marker icon not loading (see github.com/PaulLeCam/react-leaflet/issues/808)
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconUrl: markerIcon,
	iconRetinaUrl: markerIcon2x,
	shadowUrl: markerShadow,
});

class RequestCallout extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			loggedIn: true, // Assume user can view page to avoid redirecting early
			validated: false, // Shows feedback messages to show the user if they screwed up the form, see react-bootstrap.github.io/forms/validation/
			position: null, // Array of [latitude, longitude]
			error: null, // Display failure message if an error occurs
			submitted: false // Redirects to /dashboard
		}
	}

	componentDidMount() {
		backendGetUserInfo()
			.then(res => this.setState({
				// Redirect to /login if user isn't a customer
				loggedIn: res.type === "CUSTOMER"
			})).catch(() => this.setState({
				// Redirect to /login if user isn't logged in yet
				loggedIn: false
			}));

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


	submitForm = (event) => {
		// Prevent form submission from refreshing the page, since we send the data manually
		event.preventDefault();

		const form = event.currentTarget;
		if (form.checkValidity()) {
			// Manually send form data to backend
			backendCreateCallout(new FormData(form))
				.then(() => this.setState({
					// Redirect to /dashboard
					submitted: true
				})).catch(async(res) => this.setState({
					// Show error message
					error: `Error: ${res.status} (${res.statusText}) ${await res.text()}`
				}));
		}
		// Show validation messages if required
		this.setState({ validated: true });
	}

	render() {
		return (
			// <Container> adds padding around the website content, makes it look nicer
			<Container>
				{/* "mb-4" is a Bootstrap CSS class for setting margin-bottom, see getbootstrap.com/docs/5.1/utilities/spacing/ */}
				<h2 className="mb-4">Request Callout</h2>

				{/* Redirect to /login if the user cannot view this page */}
				{this.state.loggedIn ? null : <Navigate to="/login"/>}

				{/* Redirect to /dashboard after form submission */}
				{this.state.submitted ? <Navigate to="/dashboard"/> : null}

				{/* Display an error message if required */}
				{this.state.error ? <Alert variant="danger">{this.state.error}</Alert> : null}

				{/* Form validation and submission is done manually, see react-bootstrap.github.io/forms/validation/ */}
				<Form noValidate validated={this.state.validated} onSubmit={this.submitForm}>

					{/* Each form group typically contains one label and one input, see react-bootstrap.github.io/forms/overview/ */}
					<Form.Group className="mb-3" controlId="formNumberPlate">
						<Form.Label>Number Plate</Form.Label>
						<Form.Control
							name="numberPlate"
							type="text" // Standard HTML input type, for valid values check www.w3schools.com/html/html_form_input_types.asp
							autoComplete="numberplate" // autocomplete is not essential, but for suggested values check developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
							required
						/>
						{/* Display feedback message if the user screws up the input, see react-bootstrap.github.io/forms/validation/ */}
						<Form.Control.Feedback type="invalid">
							Please provide your number plate.
						</Form.Control.Feedback>
					</Form.Group>
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
						? <MapContainer className="mb-3" style={{ width: "100%", height: "270px" }} center={this.state.position} zoom={20}>
							<TileLayer
								attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
								url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
							/>
							{/* Place a marker on the position to make it clearer */}
							<Marker position={this.state.position} />
						</MapContainer>
						: <Button variant="secondary" onClick={this.getLocation}>Get position</Button>
					}
					{/* Include date automatically */}
					<Form.Control name="dateTime" type="hidden" value={new Date()} />

					{/* type="submit" automatically runs onSubmit, which runs this.submitForm */}
					<LargeButton variant="primary" type="submit" icon="arrow-right">
						Submit
					</LargeButton>
				</Form>
			</Container>
		);
	}
}

export default RequestCallout;