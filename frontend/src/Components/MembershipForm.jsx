import React from "react";

import Alert from "react-bootstrap/Alert";

import CustomSpinner from "../Components/CustomSpinner";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// api.jsx contains utility functions for getting or sending data from the frontend to the backend
// For example, sending form data or getting user info
import { backendPreFetchPaymentInformation } from "../api.jsx";

class MembershipForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			initialOptions: null, // Initial PayPal settings
			error: null // Error message to display if required
		};
	}

	componentDidMount() {
		backendPreFetchPaymentInformation().then(res => (
			this.setState({
				initialOptions: {
					"client-id": res.clientId,
					"currency": "AUD",
					"intent": "capture",
					"data-client-token": res.clientToken,
					"vault": true
				}
			})
		));
	}

	render() {
		return (<>
				{/* Show error message if required */}
				{this.state.error && <Alert variant="danger">{this.state.error}</Alert>}

				{
					this.state.initialOptions
					? <PayPalScriptProvider options={this.state.initialOptions}>
						<PayPalButtons
							style={{ layout: "vertical", label: "subscribe" }}
							createSubscription={
								(data, actions) => { // P-5NL64788VY579522XMKBXB6Q
									console.log(data);
									console.log(actions);
									return false;
								}
							}
							onApprove={
								(data, actions) => {
									console.log(data);
									console.log(actions);
									return false;
								}
							}
							onCancel={
								(data) => {
									console.log(data);
									return false;
								}
							}
							onError = {
								(err) => {
									this.setState({
										error: "Error: PayPal could not process your payment!"
									});
								}
							}/>
					</PayPalScriptProvider>
					: <CustomSpinner label="Loading PayPal..."/>
				}
		</>);
	}
}

export default MembershipForm;