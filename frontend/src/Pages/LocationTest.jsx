import React from "react";
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";
import "./LocationTest.css";

const containerStyle = { width: "720px", height: "540px" };

function LocationTest() {
	const [status, setStatus] = React.useState("Waiting for location...");
	const [center, setCenter] = React.useState(null);
	const [url, setURL] = React.useState(window.location.href);

	React.useEffect(() => {
		fetch("/api/v1/ip")
			.then(res => res.json())
			.then(data => setURL(`${window.location.protocol}//${data.ip}:${window.location.port}${window.location.pathname}`));
	}, []);

	// Ensure geolocation API exists
	if (!("geolocation" in navigator)) {
		setStatus("Error: Geolocation is not supported on your browser!");
	}
	
	navigator.geolocation.getCurrentPosition(pos => {
		setStatus("Got your location! (Roughly)");
		setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
	}, error => {
		setStatus(`Error: ${error.message}`);
	}, {
		enableHighAccuracy: true
	});

	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: "AIzaSyC9KNOh8CqX4VnjJ94hrB26PFlzTKCwNH8"
	});

	return (
		<div className="LocationTest">
			<h1>{status}</h1>
			<p>Latitude: {center ? center.lat : "Unknown"}</p>
			<p>Longitude: {center ? center.lng : "Unknown"}</p>
			{(isLoaded && center) ?
				<GoogleMap
					mapContainerStyle={containerStyle}
					center={center}
					zoom={20}
					mapTypeId="satellite"
				>
					<Marker position={center} />
				</GoogleMap> :
				<p>Loading map...</p>
			}
			<p>Eventually this page needs a URL which can be opened on other devices</p>
			<p><a href={url} target="_blank" rel="noreferrer noopener">{url}</a> doesn't work yet</p>
		</div>
	);
}

export default React.memo(LocationTest);