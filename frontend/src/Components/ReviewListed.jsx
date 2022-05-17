import React from "react";

import Card from "react-bootstrap/Card";

import CustomRating from "./CustomRating";

// Card for rendering each review along with basic details
class ReviewListed extends React.Component {

	render() {
		return (
			<Card {...this.props}>
				<Card.Header>
					Review on {new Date(parseInt(this.props.details.review.dateTime)).toLocaleString("en-US")}
				</Card.Header>
				<Card.Body>
					<Card.Title className="mb-0 mt-1">Serviced by {this.props.details.professional}</Card.Title>
					<CustomRating
						size={25}
						className="mt-3 mb-3"
						initialRating={parseFloat(this.props.details.review.rating)}
						readonly
					/>
					<blockquote className="blockquote mb-1">
						<p className="mb-4">
							"{this.props.details.review.description}"
						</p>
						<footer className="blockquote-footer fst-italic">
							{this.props.details.customer}
						</footer>
					</blockquote>
				</Card.Body>
			</Card>
		);
	}
}

export default ReviewListed;