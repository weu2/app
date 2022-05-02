import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

// api.jsx contains utility functions for getting or sending data from the frontend to the backend
// For example, sending form data or getting user info
import { backendGetNearbyProfessionals } from "../api.jsx";

class MapNearbyProfessionals extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			nearby: [] // Array of nearby service professionals
		};
	}

	componentDidMount() {
		backendGetNearbyProfessionals(this.props.uuid)
			.then(res => this.setState({
				nearby: res
			}));
	}

	render() {
		return (
			<MapContainer {...this.props} center={this.props.position} zoom={16}>
				{/* Use a free OpenStreetMap image server to avoid API costs */}
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>

				{/* Place a marker on the customer position */}
				<Marker position={this.props.position}>
					<Popup>Your Location</Popup>
				</Marker>

				{/* Place a marker on each service professional */}
				{
					this.state.nearby.map((pro, index) =>
						<Marker position={pro.position} key={index}>
							<Popup>{pro.name}</Popup>
						</Marker>
					)
				}
			</MapContainer>
		);
	}
}

export default MapNearbyProfessionals;