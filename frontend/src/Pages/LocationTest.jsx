import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { backendGetURL } from "../api.jsx";
import "./LocationTest.css";

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

function LocationTest() {
	const [status, setStatus] = React.useState("Waiting for location...");
	const [position, setPosition] = React.useState(null);
	const [url, setURL] = React.useState(window.location.href);

	React.useEffect(() => {
		
		backendGetURL().then(res => setURL(
			`${window.location.protocol}//${res.ip}:${window.location.port}${window.location.pathname}`
		)).catch(console.error);

		// Ensure geolocation API exists
		if (!("geolocation" in navigator)) {
			setStatus("Error: Geolocation is not supported on your browser!");
		}
		
		navigator.geolocation.watchPosition(pos => {
			setStatus("Got your location! (Roughly)");
			setPosition([pos.coords.latitude, pos.coords.longitude]);
		}, error => {
			setStatus(`Error: ${error.message}`);
		}, {
			enableHighAccuracy: true
		});
	}, []);

	return (
		<div className="LocationTest">
			<h1>{status}</h1>
			<p>This is way more accurate on devices with a GPS (like a phone)</p>
			<p>Latitude: {position ? position[0] : "Unknown"}</p>
			<p>Longitude: {position ? position[1] : "Unknown"}</p>
			{position ?
				<MapContainer className="LocationTest-MapContainer" center={position} zoom={20}>
					<TileLayer
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					/>
					<Marker position={position} />
				</MapContainer>
				: <p>Waiting for location...</p>
			}
			<p>Eventually this page needs a public URL so multiple devices can be tracked at once</p>
			<p><a href={url} target="_blank" rel="noreferrer noopener">{url}</a> doesn't work yet</p>
		</div>
	);
}

export default React.memo(LocationTest);
