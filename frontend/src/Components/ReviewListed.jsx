import React from "react";

import ReactStars from "react-rating-stars-component";

import Card from "react-bootstrap/Card";

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
					<ReactStars
						count={5}
						size={40}
						edit={false}
						activeColor="#FF449E"
						value={parseFloat(this.props.details.review.rating)}
					/>
					<blockquote className="blockquote mt-1 mb-1">
						<p className="mb-4">
							{this.props.details.review.description}
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