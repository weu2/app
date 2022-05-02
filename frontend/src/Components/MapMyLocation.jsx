import React from "react";
import { MapContainer, TileLayer, useMapEvent } from "react-leaflet";

import CustomMarker from "./CustomMarker";

// Internal class for setting position when map is clicked
function MapClickListener(props) {
	const map = useMapEvent("click", (event) => {
		// Trigger parent update
		props.onclick([event.latlng.lat, event.latlng.lng]);
	});
	// Update view whenever location changes
	map.setView(props.position, map.getZoom());
	return null;
}

class MapSingleMarker extends React.Component {

	render() {
		return (
			<MapContainer {...this.props} center={this.props.position} zoom={16}>
				{/* Use a free OpenStreetMap image server to avoid API costs */}
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>

				{/* Allow the map to be clicked to set the position */}
				<MapClickListener onclick={this.props.setposition} position={this.props.position} />

				{/* Place a marker on the position to make it clearer */}
				<CustomMarker icon="self" position={this.props.position} />
			</MapContainer>
		);
	}
}

export default MapSingleMarker;