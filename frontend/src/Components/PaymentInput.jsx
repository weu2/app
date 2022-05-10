import React from "react";

import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// This class validates itself when placed within a <Form> element due to min and max
 // FormData(form) is used to retrieve data within the form, including this class
class PaymentInput extends React.Component {

	render() {
		return (
			<div {...this.props}>
				<Form.Group className="mb-3" controlId="cardNumber">
					<Form.Label>Card Number</Form.Label>
					<Form.Control
						name="cardNumber"
						type="number" // Standard HTML input type, for valid values check www.w3schools.com/html/html_form_input_types.asp
						autoComplete="cc-number" // autocomplete is not essential, but for suggested values check developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
						min="0"
						max="9999999999999999"
						onInput={e => {e.target.value = e.target.value.slice(0, 16)}}
						required
					/>
					{/* Display feedback message if the user screws up the input, see react-bootstrap.github.io/forms/validation/ */}
					<Form.Control.Feedback type="invalid">
						Invalid card number. Must be a 16 digit number.
					</Form.Control.Feedback>
				</Form.Group>

				<Row>
					<Col>
						<Form.Label>Expiration Date</Form.Label>
						<Row>
							<Col>
								<Form.Group className="mb-3" controlId="cardMonth">
									<Form.Control
										name="cardExpMonth"
										type="number" // Standard HTML input type, for valid values check www.w3schools.com/html/html_form_input_types.asp
										autoComplete="cc-exp-month" // autocomplete is not essential, but for suggested values check developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
										placeholder="MM"
										min="1"
										max="12"
										onInput={e => {e.target.value = e.target.value.slice(0, 2)}}
										required
									/>
									{/* Display feedback message if the user screws up the input, see react-bootstrap.github.io/forms/validation/ */}
									<Form.Control.Feedback type="invalid">
										Invalid expiration month. Must be a number between 1 and 12.
									</Form.Control.Feedback>
								</Form.Group>
							</Col>
							<Col>
								<Form.Group className="mb-3" controlId="cardMonth">
									<Form.Control
										name="cardExpYear"
										type="number" // Standard HTML input type, for valid values check www.w3schools.com/html/html_form_input_types.asp
										autoComplete="cc-exp-year" // autocomplete is not essential, but for suggested values check developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
										placeholder="YY"
										min="0"
										max="99"
										onInput={e => {e.target.value = e.target.value.slice(0, 2)}}
										required
									/>
									{/* Display feedback message if the user screws up the input, see react-bootstrap.github.io/forms/validation/ */}
									<Form.Control.Feedback type="invalid">
										Invalid expiration year. Must be a 2 digit number.
									</Form.Control.Feedback>
								</Form.Group>
							</Col>
						</Row>
					</Col>
					<Col>
						<Form.Group className="mb-3" controlId="cvc">
							<Form.Label>CVC</Form.Label>
							<Form.Control
								name="cardCVC"
								type="number" // Standard HTML input type, for valid values check www.w3schools.com/html/html_form_input_types.asp
								min="0"
								max="999"
								onInput={e => {e.target.value = e.target.value.slice(0, 3)}}
								autoComplete="cc-csc" // autocomplete is not essential, but for suggested values check developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
								required
							/>
							{/* Display feedback message if the user screws up the input, see react-bootstrap.github.io/forms/validation/ */}
							<Form.Control.Feedback type="invalid">
								Invalid CVC. Must be a 3 digit number.
							</Form.Control.Feedback>
						</Form.Group>
					</Col>
				</Row>
			</div>
		);
	}
}

export default PaymentInput;