import React from "react";

import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";	

// api.jsx contains utility functions for getting or sending data from the frontend to the backend
// For example, sending form data or getting user info
import { backendPreFetchPaymentInformation, backendCreatePayment, backendCapturePayment } from "../api.jsx";

class OnDemandForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			initialOptions: null,
			paypalClientToken: ""
		}
	}

	componentDidMount() {
		backendPreFetchPaymentInformation().then(res => {
			this.setState({
				initialOptions : {
					"client-id": res.clientId,
					"currency": "AUD",
					"intent": "capture",
					"data-client-token": res.clientToken
				}
			});
		});
	}

	render() {
		return (
			<>
				<h5 className="mb-4">Price: ${parseFloat(this.props.callout.price).toFixed(2)}</h5>
				<p>For the purposes of this app, please don't use your real paypal account!</p>
				<Table bordered>
					<tbody>
						<tr>
							<th>Email</th>
							<td>sb-spkqx16304132@personal.example.com</td>
						</tr>
						<tr>
							<th>Password</th>
							<td>uiYy7B$T</td>
						</tr>
					</tbody>
				</Table>
				{
					this.state.initialOptions
					? <PayPalScriptProvider options={this.state.initialOptions}>
						<PayPalButtons 
							style={{ layout: "vertical" }}
							createOrder={
								(data, actions) => {
									return backendCreatePayment(this.props.callout.uuid)
										.then(res => res.id);
								}
							}
							onApprove={
								(data, actions) => {
									return backendCapturePayment(this.props.callout.uuid)
										.then(res => {
											window.location.reload();
											return res.id;
										});
								}
							}/>
					</PayPalScriptProvider>
					: <Spinner animation="border" />
				}
			</>
		);
	}
}

export default OnDemandForm;