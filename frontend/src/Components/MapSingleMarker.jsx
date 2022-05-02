import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

// Internal class for setting position when map is clicked
function MapClickListener(props) {
	useMapEvents({
		click(event) {
			// Trigger parent update
			props.setstate([event.latlng.lat, event.latlng.lng]);
		}
	});
	return null;
}

// For a static position, you can set the "position" property

// For a dynamic position, you can set the "state" and "setstate" properties
// This ensures the position is shared between the parent and child
// It assumes the position is stored in the parent as "this.state.position"

class MapSingleMarker extends React.Component {

	render() {
		return (
			<MapContainer {...this.props} center={this.props.position ?? this.props.state.position} zoom={20}>
				{/* Use a free OpenStreetMap image server to avoid API costs */}
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>

				{/* Allow the map to be clicked to set the position */}
				{this.props.setstate ? <MapClickListener setstate={this.props.setstate} /> : null}

				{/* Place a marker on the position to make it clearer */}
				<Marker position={this.props.position ?? this.props.state.position} />
			</MapContainer>
		);
	}
}

export default MapSingleMarker;