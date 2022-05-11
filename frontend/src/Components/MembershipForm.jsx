import React from "react";

import Form from "react-bootstrap/Form";

// <LargeButton> is a subclass of React Bootstrap's <Button> with an icon added to the right side
import LargeButton from "../Components/LargeButton";
import PaymentInput from "../Components/PaymentInput";

class MembershipForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			basePrice: 80,
			duration: 1,
			validated: false
		};
	}

	submitForm = (event) => {
		// Prevent form submission from refreshing the page, since we send the data manually
		event.preventDefault();

		const form = event.currentTarget;
		if (form.checkValidity()) {
			// TODO: Manually send form data to backend
			//backendCreateCallout(new FormData(form))
				//.then(() => this.setState({
					// Redirect to /dashboard
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

				<Form.Group className="mb-3" controlId="membershipDuration">
					<Form.Label>Membership Duration (Months)</Form.Label>
					<Form.Control
						name="membershipDuration"
						type="number" // Standard HTML input type, for valid values check www.w3schools.com/html/html_form_input_types.asp
						min="1"
						defaultValue={this.state.duration}
						onInput={event => this.setState({ duration: event.target.value })}
						required
					/>
					{/* Display feedback message if the user screws up the input, see react-bootstrap.github.io/forms/validation/ */}
					<Form.Control.Feedback type="invalid">
						Invalid card number. Must be a 16 digit number.
					</Form.Control.Feedback>
				</Form.Group>

				<h5 className="mb-4">Price: ${this.state.basePrice.toFixed(2)} x {this.state.duration} = ${(this.state.basePrice * this.state.duration).toFixed(2)}</h5>

				<PaymentInput className="mb-2" />

				<LargeButton className="mb-3" variant="primary" type="submit" icon="arrow-right" onClick={this.renewMembership}>
					{this.props.label}
				</LargeButton>
			</Form>
		);
	}
}

export default MembershipForm;