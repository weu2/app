import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

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
		super(props);
		this.state = {
			position: null,
			url: window.location.href,
			status: "Waiting for location...",
			error: null
		};
	}

	componentDidMount() {
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
		
		// Use watchPosition() to update the position every few seconds
		navigator.geolocation.getCurrentPosition(pos => this.setState({
			status: "Got your location! (Roughly)",
			position: [pos.coords.latitude, pos.coords.longitude]
		}), error => this.setState({
			error: `Error: ${error.message}`
		}), {
			enableHighAccuracy: true
		});
	}

	render() {
		return (
			<Container>
				<h2 className="mb-4">Location Test</h2>
				<Button className="mb-3" onClick={this.getLocation} size="med">Get my location</Button>
				<p>This is way more accurate on devices with a GPS (like a phone)</p>
				<p>
					Latitude: {this.state.position ? this.state.position[0] : "Unknown"}
					<br/>
					Longitude: {this.state.position ? this.state.position[1] : "Unknown"}
				</p>
				<Alert variant={this.state.error ? "warning" : "info"}>
					{this.state.error ? this.state.error : this.state.status}
				</Alert>
				{this.state.position ?
					<MapContainer style={{ width: "720px", height: "540px" }} center={this.state.position} zoom={20}>
						<TileLayer
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						/>
						<Marker position={this.state.position} />
					</MapContainer> : null
				}
				<p>Eventually this page needs a public URL so multiple devices can be tracked at once</p>
				<p><a href={this.state.url} target="_blank" rel="noreferrer noopener">{this.state.url}</a> doesn't work yet</p>
			</Container>
		)
	}
}

export default LocationTest;
