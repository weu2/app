import React from "react";

import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";	

import LargeButton from "./LargeButton";
import PaymentInput from "./PaymentInput";

// api.jsx contains utility functions for getting or sending data from the frontend to the backend
// For example, sending form data or getting user info
import { backendPayOnDemand, backendPreFetchPaymentInformation, backendCreatePayment, backendCapturePayment } from "../api.jsx";

class OnDemandForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			validated: false,
			error: null,
			initialOptions : null,
			paypalClientToken : ""
		}
		backendPreFetchPaymentInformation().then(res => {
            this.setState({
				initialOptions : {
					"client-id": res.clientId,
			    	currency: "AUD",
			    	intent: "capture"
				},
				paypalClientToken:res.clientToken
			});
		});
	}

	// submitForm = (event) => {
	// 	// Prevent form submission from refreshing the page, since we send the data manually
	// 	event.preventDefault();

	// 	const form = event.currentTarget;
	// 	if (form.checkValidity()) {
	// 		// Manually send form data to backend
	// 		backendPayOnDemand(new FormData(form))
	// 			.then(() => window.location.reload())
	// 			.catch(async(res) => this.setState({
	// 				// Show error message
	// 				error: `Error: ${res.status} (${res.statusText}) ${await res.text()}`
	// 			}));
	// 	}
	// 	// Show validation messages if required
	// 	this.setState({ validated: true });
	// }

	render() {
		return (
			<Form noValidate validated={this.state.validated} onSubmit={this.submitForm}>

				{/* Display an error message if required */}
				{this.state.error && <Alert variant="danger">{this.state.error}</Alert>}
				
				<h5 className="mb-4">FOR THE PURPOSES OF THIS APP THIS USES PAYPAL'S SANDBOX ENVIRONMENT, PLEASE DO NOT USE YOUR *REAL* PAYPAL ACCOUNT</h5>
				<h5 className="mb-4">SB Email: sb-spkqx16304132@personal.example.com</h5>
				<h5 className="mb-4">SB Password: uiYy7B$T</h5>
				
				<h5 className="mb-4">Price: ${parseFloat(this.props.callout.price).toFixed(2)}</h5>

				{
					this.state.initialOptions 
					&&
					<PayPalScriptProvider options={ this.state.initialOptions }>
	            		<PayPalButtons 
	            			style={{ layout: "vertical" }}
	            			createOrder={
	            				(data, actions) => {
				                    //return ;
	            					return backendCreatePayment(this.props.callout.uuid)
	            						.then(res => res.id);
				                }
	            			}
	            			onApprove={
	            				(data, actions) => {
	            					return backendCapturePayment(this.props.callout.uuid)
	            						.then(res => res.id);
	            				}
	            			} />
	        		</PayPalScriptProvider>
        		}

				{/* Include callout ID automatically 
				<PaymentInput className="mb-2" />
				
				<Form.Control name="calloutId" type="hidden" required value={this.props.callout.uuid} />

				<LargeButton
					type="submit"
					variant="primary"
					icon="arrow-right"
				>
					Complete Payment
				</LargeButton>*/}
			</Form>
		);
	}
}

export default OnDemandForm;