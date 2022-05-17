import React from "react";
import { Navigate } from "react-router-dom";

// <Container> adds padding to the sides of the page content, makes it look nicer
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";

import CustomSpinner from "../Components/CustomSpinner";
import URLPartGrabber from "../Components/URLPartGrabber";
import LargeButton from "../Components/LargeButton";
import CustomRating from "../Components/CustomRating";

// api.jsx contains utility functions for getting or sending data from the frontend to the backend
// For example, sending form data or getting user info
import { backendGetCallout, backendReview } from "../api.jsx";

class CalloutReview extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			error: null, // Error message to display if required
			callout: null, // Callout JSON data, may not trigger page update
			validated: false,
			reviewed: false,
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
			backendReview(new FormData(form))
				.then(() => this.setState({
					// Redirect to /dashboard
					reviewed: true
				})).catch(res => this.setState({
					// Show error message
					error: `Error: ${res.status} (${res.statusText})`
				}));
		}
		// Show validation messages if required
		this.setState({ validated: true });
	}

	loadCallout = (params) => {
		backendGetCallout(params.id).then(res => (
			this.setState({ callout: res })
		)).catch(res => this.setState({
			error: `Error: ${res.status} (${res.statusText})`
		}));
	}
	
	render() {
		return (
			<Container>
				{/* Get callout ID from URL */}
				<URLPartGrabber onload={this.loadCallout}/>

				{/* Show error message if required */}
				{this.state.error && <Alert variant="danger">{this.state.error}</Alert>}
				
				{
					this.state.callout
					? <>
						{/* Redirect to regular callout page once paid */}
						{this.state.reviewed && <Navigate to={`/callout/${this.state.callout.uuid}`}/>}

						<h2 className="mb-4">Callout on {new Date(parseInt(this.state.callout.dateTime)).toLocaleString("en-US")}</h2>
						<Form noValidate validated={this.state.validated} onSubmit={this.submitForm}>
							<Form.Group controlId="formReviewRating" className="mb-2">
								<Form.Label className="mb-3">Rating</Form.Label>
								<div className="mb-3">
									<CustomRating
										size={25}
										initialRating={this.state.rating}
										onChange={this.handleRatingChange}
									/>
									<span className="ms-2">{this.state.ratingLabel}</span>
								</div>
							</Form.Group>

							<Form.Group controlId="formReviewText" className="mb-3">
								<Form.Label className="mb-3">Review</Form.Label>
								<Form.Control
									name="description"
									input="text"
									as="textarea"
									rows={4}
									required
								/>
								{/* Display feedback message if the user screws up the input, see react-bootstrap.github.io/forms/validation/ */}
								<Form.Control.Feedback type="invalid">
									Please provide a review description.
								</Form.Control.Feedback>
							</Form.Group>

							{/* Include rating in form submission automatically */}
							<Form.Control name="rating" type="hidden" value={this.state.rating} required />

							{/* Include callout ID in form submission automatically */}
							<Form.Control name="calloutId" type="hidden" value={this.state.callout.uuid} required />

							{/* Include date automatically */}
							<Form.Control name="dateTime" type="hidden" value={Date.now()} required />

							{/* type="submit" automatically runs onSubmit, which runs this.submitForm */}
							<LargeButton className="mb-3" variant="primary" type="submit" icon="arrow-right">
								Submit
							</LargeButton>
						</Form>
					</>
					: <CustomSpinner label="Loading callout details..."/>
				}
			</Container>
		);
	}
}

export default CalloutReview;