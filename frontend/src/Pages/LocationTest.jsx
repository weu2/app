import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// <Alert> is useful for displaying success or error messages, see react-bootstrap.github.io/components/alerts/
import Alert from "react-bootstrap/Alert";

// <Button> is a general purpose button with many different styles, see react-bootstrap.github.io/components/buttons/
import Button from "react-bootstrap/Button";

// <Container> adds padding to the sides of the page content, makes it look nicer
import Container from "react-bootstrap/Container";

// api.jsx contains utility functions for getting or sending data from the frontend to the backend
// For example, sending form data or getting user info
import { backendGetURL } from "../api.jsx";

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

class LocationTest extends React.Component {

	constructor(props) {
		super(props); // Call React.Component's constructor as well as our own constructor
		this.state = { // "this.state" variables automatically update the website whenever they get changed
			position: null, // Stores a [latitude, longitude] array for the map
			url: window.location.href, // May eventually store a publically accessible URL for the website
			status: "Waiting for location...", // Display info message to update the user
			error: null // Display failure message if an error occurs
		};
	}

	componentDidMount() {
		// Try to generate a publically accessible URL for the website, doesn't work yet though
		backendGetURL().then(res => this.setState({
			url: `${window.location.protocol}//${res.ip}:${window.location.port}${window.location.pathname}`
		})).catch(console.error);
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
		// Use watchPosition() if you want to update the position every few seconds
		navigator.geolocation.getCurrentPosition(pos => this.setState({
			status: "Got your location! (Roughly)", // More accurate on mobile
			position: [
				pos.coords.latitude,
				pos.coords.longitude
			]
		}), error => this.setState({
			error: `Error: ${error.message}`
		}), {
			enableHighAccuracy: true // Might improve the accuracy on mobile
		});
	}

	render() {
		return (
			// <Container> adds padding around the website content, makes it look nicer
			<Container>
				{/* "mb-4" is a Bootstrap CSS class for setting margin-bottom, see getbootstrap.com/docs/5.1/utilities/spacing/ */}
				<h2 className="mb-4">Location Test</h2>
				<Button className="mb-3" onClick={this.getLocation}>Get my location</Button>
				<p>This is way more accurate on devices with a GPS (like a phone)</p>
				<p>
					{/* Display the latitude once it exists */}
					Latitude: {this.state.position ? this.state.position[0] : "Unknown"}
					<br/>
					{/* Display the longitude once it exists */}
					Longitude: {this.state.position ? this.state.position[1] : "Unknown"}
				</p>
				{/* variant="info" means an <Alert> is blue, variant="danger" means an <Alert> is red
					See react-bootstrap.github.io/components/alerts/ for more details */}
				<Alert variant={this.state.error ? "danger" : "info"}>
					{/* Display the error if one exists, otherwise show the regular status */}
					{this.state.error ? this.state.error : this.state.status}
				</Alert>
				{/* Display the map once the position is determined */}
				{this.state.position ?
					// The map uses a public tileset from OpenStreetMap to avoid API costs
					<MapContainer style={{ width: "720px", height: "540px" }} center={this.state.position} zoom={20}>
						<TileLayer
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						/>
						{/* Place a marker on the position to make it clearer */}
						<Marker position={this.state.position} />
					</MapContainer> : null
				}
				<p>Eventually this page needs a public URL so multiple devices can be tracked at once</p>
				{/* Public URL doesn't work yet, not sure how to use HTTPS */}
				<p>
					<a href={this.state.url} target="_blank" rel="noreferrer noopener">{this.state.url}</a> doesn't work yet
				</p>
			</Container>
		)
	}
}

export default LocationTest;
