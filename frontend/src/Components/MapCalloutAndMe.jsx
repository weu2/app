import React from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Polyline, Tooltip, useMap } from "react-leaflet";

import CustomMarker from "./CustomMarker";
import { getLocation } from "./LocationTracker";

// Internal class for updating map bounds when the second position loads
function MapBoundsListener(props) {
	useMap().fitBounds(props.bounds);
	return null;
}

class MapCalloutAndMe extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			myPosition: props.position // Array of [latitude, longitude]
		};
	}

	componentDidMount() {
		getLocation(navigator)
			.then(pos => this.setState({
				myPosition: pos
			}));
	}

	render() {
		const bounds = L.latLngBounds([this.props.position, this.state.myPosition]).pad(0.2);
		return (
			// Calculate bounding box to fit both markers
			<MapContainer {...this.props} bounds={bounds} zoom={16}>
				{/* Use a free OpenStreetMap image server to avoid API costs */}
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>

				{/* Position Marker */}
				<CustomMarker icon="self" position={this.state.myPosition}>
					<Tooltip direction="top">Your Location</Tooltip>
				</CustomMarker>

				{/* Callout Marker */}
				<CustomMarker icon="callout" position={this.props.position}>
					<Tooltip direction="top">Callout Location</Tooltip>
				</CustomMarker>

				{/* PolyLine draws a line between two points, feed in positions in array, Color can be changed with a hex value or default colors like red */}
				<Polyline color="#FF449E" positions={[this.props.position, this.state.myPosition]}/>

				{/* Update map bounds after location is detected */}
				<MapBoundsListener bounds={bounds} />

			</MapContainer>
		);
	}
}

export default MapCalloutAndMe;