import React from "react";
import { Marker } from "react-leaflet";
import L from "leaflet";

// Customize marker icons and fix icons not loading (see github.com/PaulLeCam/react-leaflet/issues/808)
import self from "../Assets/markerself.png";
import self2x from "../Assets/markerself_2x.png";

import mechanic from "../Assets/markermechanic.png";
import mechanic2x from "../Assets/markermechanic_2x.png";

import callout from "../Assets/markercallout.png";
import callout2x from "../Assets/markercallout_2x.png";

const iconSelf = new L.Icon({
	iconUrl: self,
	iconRetinaUrl: self2x,
	iconSize: [50, 50],
	iconAnchor: [25, 50],
	popupAnchor: [0, -50],
	tooltipAnchor: [0, -50]
});

const iconMechanic = new L.Icon({
	iconUrl: mechanic,
	iconRetinaUrl: mechanic2x,
	iconSize: [50, 50],
	iconAnchor: [25, 50],
	popupAnchor: [0, -50],
	tooltipAnchor: [0, -50]
});

const iconCallout = new L.Icon({
	iconUrl: callout,
	iconRetinaUrl: callout2x,
	iconSize: [50, 50],
	iconAnchor: [25, 50],
	popupAnchor: [0, -50],
	tooltipAnchor: [0, -50]
});

class CustomMarker extends React.Component {

	getIcon(name) {
		switch (name) {
			case "self":
			default:
				return iconSelf;
			case "mechanic":
				return iconMechanic;
			case "callout":
				return iconCallout;
		}
	}

	render() {
		return <Marker {...this.props} icon={this.getIcon(this.props.icon)}>
			{this.props.children}
		</Marker>
	}
}

export default CustomMarker;