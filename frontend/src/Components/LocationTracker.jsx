import React from "react";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

// api.jsx contains utility functions for getting or sending data from the frontend to the backend
// For example, sending form data or getting user info
import { backendTrackLocation } from "../api.jsx";

// Cached variable updates every few seconds
let cachedLocation = null;

function liveUpdate(latitude, longitude) {
	// Only run once the user is logged in
	if (!document.cookie.includes("claim")) return;
	const formData = new FormData();
	formData.set("locationLat", latitude);
	formData.set("locationLong", longitude);
	backendTrackLocation(formData);
}

export function getLocation() {
	return new Promise((res, rej) => {
		// Return cached result since watchPosition updates it
		if (cachedLocation) {
			res(cachedLocation);
			return;
		}

		// Ensure geolocation API exists
		if (!("geolocation" in navigator)) {
			rej("Geolocation is not supported on your browser!");
			return;
		}
		
		// This uses the Web Geolocation API, see www.w3schools.com/html/html5_geolocation.asp
		navigator.geolocation.watchPosition(pos => {
			// Update cached location every few seconds
			const coords = [pos.coords.latitude, pos.coords.longitude];
			liveUpdate(pos.coords.latitude, pos.coords.longitude);
			cachedLocation = coords;
			res(coords);
		}, error => {
			rej(error.message);
		}, {
			enableHighAccuracy: true // May improve the accuracy on mobile
		});
	});
}

export function getDistance(latitude1, longitude1, latitude2, longitude2) {
	// get delta
	const dLat = latitude1 - latitude2;
	const dLong = longitude1 - longitude2;
	// convert to km
	const latKm = dLat * 110.574;
	const longKm = 111.320 * Math.cos(dLat) * dLong;
	// year 8 math
	const distance = Math.sqrt((latKm * latKm) + (longKm * longKm));
	return distance;
}

class LocationTracker extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			error: null // Display failure message if an error occurs
		};
	}

	componentDidMount() {
		// Attempt to get location on page load, may not work before user interaction but worth a try
		this.fetchLocation();
	}

	fetchLocation = () => {
		getLocation().then(() => this.setState({
			error: null
		})).catch(err => this.setState({
			error: err
		}));
	}

	render() {
		return (
			<Modal size="lg" show={this.state.error} onHide={() => this.setState({ error: null })} centered>
				<Modal.Header closeButton>
					<Modal.Title>{this.state.error}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p className="mb-3">This website works best with location access enabled.</p>
					<Button variant="primary" className="mb-3" onClick={this.fetchLocation}>
						Retry location access
					</Button>
				</Modal.Body>
			</Modal>
		);
	}
}

export default LocationTracker;