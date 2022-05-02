import React from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";

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