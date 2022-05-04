import React from "react";

// Basic link, goes to Google Maps
class LocationLink extends React.Component {

	render() {
		return (
			<a
				className="text-body"
				href={`https://www.google.com/maps?q=${this.props.latitude},${this.props.longitude}`}
				target="_blank"
				rel="noopener noreferrer"
				{...this.props}
			>
				{this.props.latitude}, {this.props.longitude}
			</a>
		);
	}
}

export default LocationLink;