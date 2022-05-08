import React from 'react'
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import LargeButton from "../Components/LargeButton";

class PaymentComponent extends React.Component {
    
    
	constructor(props) {
		super(props)
		this.state = {
			Price: 72,
            cardNumber: null,
            cardName: null,
            cardExpire: null,
            cvc: null

		};
	}

    validateCardInfo(){

        //console.log("Card Num: " + this.state.cardNumber +"\nName: " + this.state.cardName +"\nExpire: " + this.state.cardExpire + "\ncvc: " + this.state.cvc);

        //console.log("HA IT WORKS");
        //check components arnt null
        if (this.state.cardNumber == null || this.state.cardExpire == null || this.state.cardName == null || this.state.cvc == null){
            console.log("null component");
            return false;
        }

        //check card number valid
        if (this.state.cardNumber.length != 16){ //check card number is right length
            console.log("Invalid card number");
            return false;
        }

        //check expiry date
        var enteredDate = Date.parse(this.state.cardExpire +"-01");
        var today = new Date();

        if (enteredDate < today){ //check experation date is not before today
            console.log("Invalid Date");
            return false;
        }

        //check cvc
        if (this.state.cvc.length != 3){ //check the length of the cvc is 3
            console.log("Invalid cvc");
            return false;
        }else if (isNaN(this.state.cvc)){ //check the cvc is a number
            console.log("Invalid cvc");
            return false;
        }


        return true;
    }
    

  render(){return (
    <Container>

        <h4>Payment Details</h4>
        <h5>Price: ${this.state.Price}</h5>
                {/* Input for the users card number */}
                <Form.Group className="mb-3" controlId="cardNumber">
                    <Form.Label>Card Number</Form.Label>
                    <Form.Control
							name="cardNumber"
							type="number" // Standard HTML input type, for valid values check www.w3schools.com/html/html_form_input_types.asp
							autoComplete="cardNumber" // autocomplete is not essential, but for suggested values check developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
							required
                            onChange={e => this.setState({ cardNumber: e.target.value })}
						/>
						{/* Display feedback message if the user screws up the input, see react-bootstrap.github.io/forms/validation/ */}
						<Form.Control.Feedback type="invalid">
							Please provide your Card Number.
						</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="cardName">
                    <Form.Label>Card Holders' Name</Form.Label>
                    <Form.Control
							name="cardName"
							type="text" // Standard HTML input type, for valid values check www.w3schools.com/html/html_form_input_types.asp
							autoComplete="cardName" // autocomplete is not essential, but for suggested values check developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
							required
                            onChange={e => this.setState({ cardName: e.target.value })}
						/>
						{/* Display feedback message if the user screws up the input, see react-bootstrap.github.io/forms/validation/ */}
						<Form.Control.Feedback type="invalid">
							Please provide Card Holders' Name.
						</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="cardExpire">
                    <Form.Label>Expiration Date</Form.Label>
                    <Form.Control
							name="expireDate"
							type="month" // Standard HTML input type, for valid values check www.w3schools.com/html/html_form_input_types.asp
							autoComplete="expireDate" // autocomplete is not essential, but for suggested values check developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
							required
                            onChange={e => this.setState({ cardExpire: e.target.value })}
						/>
						{/* Display feedback message if the user screws up the input, see react-bootstrap.github.io/forms/validation/ */}
						<Form.Control.Feedback type="invalid">
							Please provide your Card Expiration Date.
						</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="cvc">
                    <Form.Label>CVC</Form.Label>
                    <Form.Control
							name="cvc"
							type="password" // Standard HTML input type, for valid values check www.w3schools.com/html/html_form_input_types.asp
							autoComplete="cvc" // autocomplete is not essential, but for suggested values check developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
							required
                            onChange={e => this.setState({ cvc: e.target.value })}
						/>
						{/* Display feedback message if the user screws up the input, see react-bootstrap.github.io/forms/validation/ */}
						<Form.Control.Feedback type="invalid">
							Please provide cards cvc
						</Form.Control.Feedback>
                    </Form.Group>

                <br/>

	</Container>
  )}
}

export default PaymentComponent
