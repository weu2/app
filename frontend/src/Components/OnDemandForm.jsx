import React from "react";

import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";

import LargeButton from "./LargeButton";
import PaymentInput from "./PaymentInput";

// api.jsx contains utility functions for getting or sending data from the frontend to the backend
// For example, sending form data or getting user info
import { backendPayOnDemand } from "../api.jsx";

class OnDemandForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			validated: false,
			error: null
		}
	}

	submitForm = (event) => {
		// Prevent form submission from refreshing the page, since we send the data manually
		event.preventDefault();

		const form = event.currentTarget;
		if (form.checkValidity()) {
			// Manually send form data to backend
			backendPayOnDemand(new FormData(form))
				.then(() => window.location.reload())
				.catch(async(res) => this.setState({
					// Show error message
					error: `Error: ${res.status} (${res.statusText}) ${await res.text()}`
				}));
		}
		// Show validation messages if required
		this.setState({ validated: true });
	}

	render() {
		return (
			<Form noValidate validated={this.state.validated} onSubmit={this.submitForm}>

				{/* Display an error message if required */}
				{this.state.error && <Alert variant="danger">{this.state.error}</Alert>}

				<h5 className="mb-4">Price: ${parseFloat(this.props.callout.price).toFixed(2)}</h5>
				<PaymentInput className="mb-2" />

				{/* Include callout ID automatically */}
				<Form.Control name="calloutId" type="hidden" required value={this.props.callout.uuid} />

				<LargeButton
					type="submit"
					variant="primary"
					icon="arrow-right"
				>
					Complete Payment
				</LargeButton>
			</Form>
		);
	}
}

export default OnDemandForm;