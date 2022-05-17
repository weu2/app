import React from "react";
import Rating from "react-rating";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

class CustomRating extends React.Component {

	render() {
		return <Rating
			{...this.props}
			emptySymbol={<FontAwesomeIcon icon={faStar} className="text-muted" style={{ fontSize: this.props.size }} />}
			fullSymbol={<FontAwesomeIcon icon={faStar} className="text-primary" style={{ fontSize: this.props.size }} />}
		/>
	}
}

export default CustomRating;