import React from "react";

import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// <Container> adds padding to the sides of the page content, makes it look nicer
import Container from "react-bootstrap/Container";

import { backendGetCallouts } from "../api.jsx";

// SET THIS TO USERS CURRENT LOCATION KALEB

class MechanicLocation extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			callouts: null,
			calloutID: null,
			/* PLACEHOLDER POSITIONS, WILL BE REPLACED WHEN  */
			customerPos: [-34.3990937, 150.8983734],
			mechanicPos: [-34.3990938, 150.2983736]
		};
	}

	polyLine = [this.customerPosition, this.mechanicPosition];

	//KALEBS A BIT OF AN IDIOT HE'LL PROBABLY FIGURE OUT HOW TO DO THIS PROPERLY LATER LOL OMG
	componentDidMount() {
		backendGetCallouts()
			.then(res => this.setState({
				callouts: res
			})).catch(() => this.setState({
				// Redirect to /login if user isn't logged in yet
				loggedIn: false
			}));

			console.log(this.state.callouts)
	}

	render() {
		return (
			<Container>
				<MapContainer center={this.state.customerPos} zoom={20} style={{ width: "100%", height: "256px" }}>
					{/* Use a free OpenStreetMap image server to avoid API costs */}
					<TileLayer
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					/>
					{/* Customer Position Marker */}
					<Marker position={this.state.customerPos} />

					{/* Mechanic Position Marker */}
					<Marker position={this.state.mechanicPos} />

					{/* PolyLine draws a line between two points, feed in positions in array, Color can be changed with a hex value or default colors like red */}
					<Polyline color="#FF449E" positions={[this.state.customerPos, this.state.mechanicPos]}/>

				</MapContainer>
			</Container>
		);
	}
}

export default MechanicLocation;