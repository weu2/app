import React from "react";

import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";	

// api.jsx contains utility functions for getting or sending data from the frontend to the backend
// For example, sending form data or getting user info
import { backendPreFetchPaymentInformation, backendCreatePayment, backendCapturePayment, backendCancelPayment } from "../api.jsx";

class OnDemandForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			initialOptions: null,
			paypalClientToken: "",
			error: null
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
				{this.state.error && <Alert variant="danger">{this.state.error}</Alert>}
				<h5 className="mb-4">Price: ${parseFloat(this.props.callout.price).toFixed(2)}</h5>
				<p>For the purposes of this app, we are only using PayPal's sandbox environment and thus you must use this login provided.</p>
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
									//
									return backendCapturePayment(this.props.callout.uuid)
										.then(res => {
											window.location.reload();
										});
								}
							}
							onCancel={
								(data) => {
									console.log("this is the cancel thing");
									backendCancelPayment(this.props.callout.uuid);
								}
							}
							onError = {
								(err) => {
									this.setState({
										error:"PayPal could not process your payment!"
									});
								}
							}/>
					</PayPalScriptProvider>
					: <Spinner variant="primary" animation="border" role="status">
						<span className="visually-hidden">Loading PayPal...</span>
					</Spinner>
				}
			</>
		);
	}
}

export default OnDemandForm;