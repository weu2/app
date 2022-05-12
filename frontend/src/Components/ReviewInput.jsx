import React from "react";
import ReactStars from "react-rating-stars-component";

import Form from "react-bootstrap/Form";
import LargeButton from "./LargeButton";

class ReviewInput extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			validated: false,
			rating: 0,
			ratingLabel: ""
		};
	}

	handleRatingChange = (rating) => {
		let ratingLabel = "";
		switch (rating) {
			case 0:
			default:
				ratingLabel = "Terrible";
				break;
			case 1:
				ratingLabel = "Not Great";
				break;
			case 2:
				ratingLabel = "Mediocre";
				break;
			case 3:
				ratingLabel = "Good";
				break;
			case 4:
				ratingLabel = "Great";
				break;
			case 5:
				ratingLabel = "Awesome";
				break;
		}
		this.setState({
			rating: rating,
			ratingLabel: ratingLabel
		});
	}

	submitForm = (event) => {
		// Prevent form submission from refreshing the page, since we send the data manually
		event.preventDefault();

		const form = event.currentTarget;
		if (form.checkValidity()) {
			// Manually send form data to backend
			//backendRegister(new FormData(form))
				//.then(() => this.setState({
					// Redirect to /login
					//submitted: true
				//})).catch(async(res) => this.setState({
					// Show error message
					//error: `Error: ${res.status} (${res.statusText}) ${await res.text()}`
				//}));
		}
		// Show validation messages if required
		this.setState({ validated: true });
	}
 
	render() {
		return (
			<Form noValidate validated={this.state.validated} onSubmit={this.submitForm}>
				<Form.Group controlId="formReviewRating" className="mb-2">
					<Form.Label className="mb-0">Rating</Form.Label>
					<div className="position-relative">
						{/* Stars are locked to block display so had to position the text manually */}
						<span className="position-absolute" style={{ top: 20, left: 180 }}>
							{this.state.ratingLabel}
						</span>
						<ReactStars
							count={5}
							size={40}
							onChange={this.handleRatingChange}
							activeColor="#FF449E"
						/>
					</div>
				</Form.Group>

				<Form.Group controlId="formReviewText" className="mb-3">
					<Form.Label className="mb-3">Review</Form.Label>
					<Form.Control
						name="reviewText"
						input="text"
						as="textarea"
						rows={4}
						required
					/>
				</Form.Group>

				{/*Hidden field makes acessing easier later*/}
				<Form.Control type="hidden" name="reviewScore" value={this.state.rating} required />

				{/* type="submit" automatically runs onSubmit, which runs this.submitForm */}
				<LargeButton className="mb-3" variant="primary" type="submit" icon="arrow-right">
					Submit
				</LargeButton>
			</Form>
		);
	}
}

export default ReviewInput;