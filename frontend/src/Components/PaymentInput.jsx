import React from "react";

import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// This class validates itself when placed within a <Form> element due to min and max
 // FormData(form) is used to retrieve data within the form, including this class
class PaymentInput extends React.Component {

	constructor(props) {
		super(props);
		// Use state variables to manually validate input length
		// Even though these are true, the form won't submit
		this.state = {
			cardNumberValid: true,
			cardExpMonthValid: true,
			cardExpYearValid: true,
			cardCVCValid: true
		};
	}

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
						step="1"
						isInvalid={!this.state.cardNumberValid}
						onInput={e => {
							e.target.value = e.target.value.slice(0, 16);
							this.setState({
								cardNumberValid: e.target.value.length === 16
							});
						}}
						required
					/>
					{/* Display feedback message if the user screws up the input, see react-bootstrap.github.io/forms/validation/ */}
					<Form.Control.Feedback type="invalid">
						Must be a 16 digit number.
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
										step="1"
										isInvalid={!this.state.cardExpMonthValid}
										onInput={e => {
											e.target.value = e.target.value.slice(0, 2);
											const numberValue = parseInt(e.target.value);
											this.setState({
												cardExpMonthValid: e.target.value.length === 2 && numberValue >= 1 && numberValue <= 12
											});
										}}
										required
									/>
									{/* Display feedback message if the user screws up the input, see react-bootstrap.github.io/forms/validation/ */}
									<Form.Control.Feedback type="invalid">
										Must be a 2 digit number between 01 and 12.
									</Form.Control.Feedback>
								</Form.Group>
							</Col>
							<Col>
								<Form.Group className="mb-3" controlId="cardYear">
									<Form.Control
										name="cardExpYear"
										type="number" // Standard HTML input type, for valid values check www.w3schools.com/html/html_form_input_types.asp
										autoComplete="cc-exp-year" // autocomplete is not essential, but for suggested values check developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
										placeholder="YY"
										min="0"
										max="99"
										step="1"
										isInvalid={!this.state.cardExpYearValid}
										onInput={e => {
											e.target.value = e.target.value.slice(0, 2);
											this.setState({
												cardExpYearValid: e.target.value.length === 2
											});
										}}
										required
									/>
									{/* Display feedback message if the user screws up the input, see react-bootstrap.github.io/forms/validation/ */}
									<Form.Control.Feedback type="invalid">
										Must be a 2 digit number.
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
								step="1"
								isInvalid={!this.state.cardCVCValid}
								onInput={e => {
									e.target.value = e.target.value.slice(0, 3);
									this.setState({
										cardCVCValid: e.target.value.length === 3
									});
								}}
								autoComplete="cc-csc" // autocomplete is not essential, but for suggested values check developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
								required
							/>
							{/* Display feedback message if the user screws up the input, see react-bootstrap.github.io/forms/validation/ */}
							<Form.Control.Feedback type="invalid">
								Must be a 3 digit number.
							</Form.Control.Feedback>
						</Form.Group>
					</Col>
				</Row>
			</div>
		);
	}
}

export default PaymentInput;