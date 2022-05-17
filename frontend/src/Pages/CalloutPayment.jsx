import React from "react";
import { Navigate } from "react-router-dom";

// <Container> adds padding to the sides of the page content, makes it look nicer
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

import DemoPaymentInfo from "../Components/DemoPaymentInfo";
import CustomSpinner from "../Components/CustomSpinner";
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
			initialOptions: null, // Initial PayPal settings
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
					"data-client-token": res.clientToken,
					"vault": true
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
						<DemoPaymentInfo />
						{
							this.state.initialOptions
							? <PayPalScriptProvider options={this.state.initialOptions}>
								<PayPalButtons 
									style={{ layout: "vertical", label: "pay" }}
									createOrder={
										(data, actions) => {
											return backendCreatePayment(this.state.callout.uuid)
												.then(res => res.id)
												.catch(res => this.setState({
													error: `Error: ${res.status} (${res.statusText})`
												}));
										}
									}
									onApprove={
										(data, actions) => {
											return backendCapturePayment(this.state.callout.uuid)
												.then(res => this.setState({ paid: true }))
												.catch(res => this.setState({
													error: `Error: ${res.status} (${res.statusText})`
												}));
										}
									}
									onCancel={
										(data) => {
											return backendCancelPayment(this.state.callout.uuid)
												.catch(res => this.setState({
													error: `Error: ${res.status} (${res.statusText})`
												}));;
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
					</>
					: <CustomSpinner label="Loading callout details..."/>
				}
			</Container>
		);
	}
}

export default CalloutPayment;