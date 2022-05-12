import React from "react";

import ReactStars from "react-rating-stars-component";

import Card from "react-bootstrap/Card";

// api.jsx contains utility functions for getting or sending data from the frontend to the backend
// For example, sending form data or getting user info
import { backendGetReviewInfo } from "../api.jsx";

// Card for rendering each review along with basic details
class ReviewListed extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			customer: "Unknown customer",
			professional: "unknown professional"
		};
	}

	componentDidMount() {
		backendGetReviewInfo(this.props.review.uuid)
			.then(res => this.setState({
				customer: res.customer,
				professional: res.professional
			}));
	}

	render() {
		return (
			<Card {...this.props}>
				<Card.Header>
					Review on {new Date(parseInt(this.props.review.dateTime)).toLocaleString("en-US")}
				</Card.Header>
				<Card.Body>
					<Card.Title className="mb-0">Serviced by {this.state.professional}</Card.Title>
					<ReactStars
						count={5}
						size={40}
						edit={false}
						activeColor="#FF449E"
						value={parseFloat(this.props.review.rating)}
					/>
					<blockquote className="blockquote mt-1 mb-1">
						<p className="mb-4">
							{this.props.review.description}
						</p>
						<footer className="blockquote-footer fst-italic">
							{this.state.customer}
						</footer>
					</blockquote>
					
				</Card.Body>
			</Card>
		);
	}
}

export default ReviewListed;