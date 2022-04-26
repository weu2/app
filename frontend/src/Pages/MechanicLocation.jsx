import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline  } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Replace marker icon and fix icon not loading (see github.com/PaulLeCam/react-leaflet/issues/808)
import L from "leaflet";



// <Container> adds padding to the sides of the page content, makes it look nicer
import Container from "react-bootstrap/Container";


import { backendGetCallouts } from "../api.jsx";

{/* SET THIS TO USERS CURRENT LOCATION KALEB */}

const ZOOM = 20;


class MechanicLocation extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
            callouts: null,
            calloutID: null,
            customerPos: null,
            mechanicPos: null
		};
	}
    /* PLACEHOLDER POSITIONS, WILL BE REPLACED WHEN  */
    customerPosition = [-34.3990937, 150.8983734];
   
    mechanicPosition = [-34.3990938, 150.2983736];

    polyLine =[this.customerPosition, this.mechanicPosition]

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
                <MapContainer center={this.customerPosition} zoom={ZOOM} style={{ width: "828px", height: "1792px" }}>
				{/* Use a free OpenStreetMap image server to avoid API costs */}
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
                    {/* Customer Position Marker */}
                    <Marker position={this.customerPosition} />

                    {/* Mechanic Position Marker */}
                    <Marker position={this.mechanicPosition} />

                    {/* PolyLine draws a line between two points, feed in positions in array, Color can be changed with a hex value or default colors like red */}
                    <Polyline color="#FF449E" positions={this.polyLine}/>

			    </MapContainer>
		    </Container>
		);
	}
}

export default MechanicLocation;