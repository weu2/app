import React from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Replace marker icon and fix icon not loading (see github.com/PaulLeCam/react-leaflet/issues/808)
// todo later: give each marker a different color
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

class MapCustomerProfessional extends React.Component {

	render() {
		return (
			// Calculate bounding box to fit both markers
			<MapContainer {...this.props} bounds={L.latLngBounds([this.props.customerpos, this.props.professionalpos]).pad(0.2)} zoom={20}>
				{/* Use a free OpenStreetMap image server to avoid API costs */}
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				{/* Customer Position Marker */}
				<Marker position={this.props.customerpos}>
					<Popup>Customer</Popup>
				</Marker>

				{/* Service Professional Position Marker */}
				<Marker position={this.props.professionalpos}>
					<Popup>Service Professional</Popup>
				</Marker>

				{/* PolyLine draws a line between two points, feed in positions in array, Color can be changed with a hex value or default colors like red */}
				<Polyline color="#FF449E" positions={[this.props.customerpos, this.props.professionalpos]}/>

			</MapContainer>
		);
	}
}

export default MapCustomerProfessional;