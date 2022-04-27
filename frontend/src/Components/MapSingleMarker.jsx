import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Replace marker icon and fix icon not loading (see github.com/PaulLeCam/react-leaflet/issues/808)
import L from "leaflet";
import marker from "./marker.png";
import marker2x from "./marker_2x.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconUrl: marker,
	iconRetinaUrl: marker2x,
	shadowUrl: null,
	iconSize: [50, 50],
	iconAnchor: [25, 50]
});

class MapSingleMarker extends React.Component {
	
	render() {
		return (
			<MapContainer {...this.props} center={this.props.position} zoom={20}>
				{/* Use a free OpenStreetMap image server to avoid API costs */}
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				{/* Place a marker on the position to make it clearer */}
				<Marker position={this.props.position} />
			</MapContainer>
		);
	} 
}

export default MapSingleMarker;