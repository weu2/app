import React from "react";
import { MapContainer, TileLayer, Tooltip } from "react-leaflet";

import CustomMarker from "./CustomMarker";

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

				{/* Place a marker on the callout position */}
				<CustomMarker icon="self" position={this.props.position}>
					<Tooltip direction="top">Callout Location</Tooltip>
				</CustomMarker>

				{ // Place a marker on each service professional
					this.state.nearby.map((pro, index) =>
						<CustomMarker icon="mechanic" position={pro.position} key={index}>
							<Tooltip direction="top">{pro.name}</Tooltip>
						</CustomMarker>
					)
				}
			</MapContainer>
		);
	}
}

export default MapNearbyProfessionals;