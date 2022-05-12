import React from "react";

// <Container> adds padding to the sides of the page content, makes it look nicer
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import ReviewListed from "../Components/ReviewListed";

// api.jsx contains utility functions for getting or sending data from the frontend to the backend
// For example, sending form data or getting user info
import { backendGetReviews } from "../api.jsx";

class ReviewList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			sortBy: "newest",
			reviews: null, // All reviews from all customers
			error: null // Display failure message if an error occurs
		};
	}

	componentDidMount() {
		backendGetReviews()
			.then(res => this.setState({
				reviews: res
			})).catch(res => this.setState({
				// Show error message
				error: `Error: ${res.status} (${res.statusText})`
			}));
	}

	sortReviews() {
		switch (this.state.sortBy) {
			case "ratingasc":
				this.state.reviews.sort((a, b) => a.rating - b.rating);
				break;
			case "ratingdesc":
				this.state.reviews.sort((a, b) => b.rating - a.rating);
				break;
			case "oldest":
				this.state.reviews.sort((a, b) => a.dateTime.localeCompare(b.dateTime));
				break;
			case "newest":
			default:
				this.state.reviews.sort((a, b) => b.dateTime.localeCompare(a.dateTime));
				break;
		}
	}

	generateReviews() {
		// Ensure reviews are sorted before rendering
		this.sortReviews();
		// Create a <ReviewListed> component to display each review
		return this.state.reviews.map(review =>
			<ReviewListed
				key={review.uuid}
				review={review}
				className="mb-3"
			/>
		);
	}

	render() {
		return (
			// <Container> adds padding around the website content, makes it look nicer
			<Container>
				{/* "mb-4" is a Bootstrap CSS class for setting margin-bottom, see getbootstrap.com/docs/5.1/utilities/spacing/ */}
				<Row className="mb-3">
					<Col>
						<h2>Reviews</h2>
					</Col>
					{
						(this.state.reviews && this.state.reviews.length)
						? <Col sm>
							<Form.Group as={Row} controlId="formSort">
								<Form.Label column sm={2}>Sort by</Form.Label>
								<Col>
									<Form.Select onChange={e => this.setState({ sortBy: e.target.value })}>
										<option value="newest" defaultValue>Newest to oldest</option>
										<option value="oldest">Oldest to newest</option>
										<option value="ratingdesc">Highest to lowest rating</option>
										<option value="ratingasc">Lowest to highest rating</option>
									</Form.Select>
								</Col>
							</Form.Group>
						</Col>
						: null
					}
				</Row>

				{/* Display an error message if required */}
				{this.state.error && <Alert variant="danger">{this.state.error}</Alert>}

				{ // Display reviews if they exist
					this.state.reviews
					? (
						this.state.reviews.length
						? this.generateReviews()
						: <>
							<p>No reviews have been submitted yet.</p>
							<p>Please check back later.</p>
						</>
					)
					: <Spinner variant="primary" animation="border" role="status">
						<span className="visually-hidden">Loading reviews...</span>
					</Spinner>
				}
			</Container>
		);
	}
}

export default ReviewList;