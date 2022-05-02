import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";

class MapStaticLocation extends React.Component {

	render() {
		return (
			<MapContainer {...this.props} center={this.props.position} zoom={16}>
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

export default MapStaticLocation;