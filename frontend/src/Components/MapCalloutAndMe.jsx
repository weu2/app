import React from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";

import { getLocation } from "./LocationTracker";

// Internal class for updating map bounds when the second position loads
function MapLocationListener(props) {
	const map = useMap();
	React.useEffect(() => {
		// Attempt to get location on page load, may not work before user interaction but worth a try
		getLocation(navigator)
			.then(pos => {
				// Resize map to fit
				map.fitBounds(L.latLngBounds([props.position, pos]).pad(0.2));
				// Trigger parent update
				props.onupdate(pos);
			});
	}, [map, props]);
	return null;
}

class MapCalloutAndMe extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			myPosition: props.position // Array of [latitude, longitude]
		};
	}

	render() {
		return (
			// Calculate bounding box to fit both markers
			<MapContainer {...this.props} bounds={L.latLngBounds([this.props.position, this.state.myPosition]).pad(0.2)} zoom={16}>
				{/* Use a free OpenStreetMap image server to avoid API costs */}
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>

				{/* Service Professional Position Marker */}
				<Marker position={this.state.myPosition}>
					<Popup>Service Professional</Popup>
				</Marker>

				{/* Customer Position Marker */}
				<Marker position={this.props.position}>
					<Popup>Customer</Popup>
				</Marker>

				{/* PolyLine draws a line between two points, feed in positions in array, Color can be changed with a hex value or default colors like red */}
				<Polyline color="#FF449E" positions={[this.props.position, this.state.myPosition]}/>

				{/* Update map bounds after location is detected */}
				<MapLocationListener {...this.props} onupdate={pos => this.setState({ myPosition: pos })}/>

			</MapContainer>
		);
	}
}

export default MapCalloutAndMe;