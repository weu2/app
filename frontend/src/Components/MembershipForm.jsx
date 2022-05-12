import React from "react";

import Form from "react-bootstrap/Form";

class MembershipForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			basePrice: 80, // Price per month
			duration: 1, // Membership duration in months
			validated: false
		};
	}

	render() {
		return (
			<>
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
				</Form.Group>
				<h5 className="mb-4">Price: ${this.state.basePrice.toFixed(2)} x {this.state.duration} = ${(this.state.basePrice * this.state.duration).toFixed(2)}</h5>
				<p>TODO: Add PayPal stuff here</p>
			</>
		);
	}
}

export default MembershipForm;