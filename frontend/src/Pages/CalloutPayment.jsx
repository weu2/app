import React from "react";
import { Navigate } from "react-router-dom";

// <Container> adds padding to the sides of the page content, makes it look nicer
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";

import URLPartGrabber from "../Components/URLPartGrabber";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// api.jsx contains utility functions for getting or sending data from the frontend to the backend
// For example, sending form data or getting user info
import { backendGetCallout, backendPreFetchPaymentInformation, backendCreatePayment, backendCapturePayment, backendCancelPayment } from "../api.jsx";

class CalloutPayment extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			error: null, // Error message to display if required
			callout: null, // Callout JSON data, may not trigger page update
			initialOptions: null,
			paypalClientToken: "",
			paid: false // Redirects to regular callout page
		};
	}

	componentDidMount() {
		backendPreFetchPaymentInformation().then(res => (
			this.setState({
				initialOptions: {
					"client-id": res.clientId,
					"currency": "AUD",
					"intent": "capture",
					"data-client-token": res.clientToken
				}
			})
		));
	}

	loadCallout = (params) => {
		backendGetCallout(params.id).then(res => (
			this.setState({ callout: res })
		)).catch(res => this.setState({
			error: `Error: ${res.status} (${res.statusText})`
		}));
	}
	
	render() {
		return (
			<Container>
				{/* Get callout ID from URL */}
				<URLPartGrabber onload={this.loadCallout}/>

				{/* Show error message if required */}
				{this.state.error && <Alert variant="danger">{this.state.error}</Alert>}
				
				{
					this.state.callout
					? <>
						{/* Redirect to regular callout page once paid */}
						{this.state.paid && <Navigate to={`/callout/${this.state.callout.uuid}`}/>}

						<h2 className="mb-4">Callout on {new Date(parseInt(this.state.callout.dateTime)).toLocaleString("en-US")}</h2>
						<h5 className="mb-4">Price: ${parseFloat(this.state.callout.price).toFixed(2)}</h5>
						<p>For the purposes of this app, we are only using PayPal's sandbox environment.</p>
						<p>Please use the login credentials provided below:</p>

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
											return backendCreatePayment(this.state.callout.uuid)
												.then(res => res.id);
										}
									}
									onApprove={
										(data, actions) => {
											return backendCapturePayment(this.state.callout.uuid)
												.then(res => this.setState({ paid: true }));
										}
									}
									onCancel={
										(data) => {
											backendCancelPayment(this.state.callout.uuid);
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
							: <Spinner variant="primary" animation="border" role="status">
								<span className="visually-hidden">Loading PayPal...</span>
							</Spinner>
						}
					</>
					: <Spinner variant="primary" animation="border" role="status">
						<span className="visually-hidden">Loading callout details...</span>
					</Spinner>
				}
			</Container>
		);
	}
}

export default CalloutPayment;