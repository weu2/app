import React from "react";
import { Navigate } from "react-router-dom";

// <Container> adds padding to the sides of the page content, makes it look nicer
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

import DemoPaymentInfo from "../Components/DemoPaymentInfo";
import CustomSpinner from "../Components/CustomSpinner";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// api.jsx contains utility functions for getting or sending data from the frontend to the backend
// For example, sending form data or getting user info
import { backendGetUserInfo, backendPreFetchPaymentInformation, backendCaptureMembership, backendCreateMembership, backendCancelMembership } from "../api.jsx";

class Membership extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			initialOptions: null, // Initial PayPal settings
			error: null, // Error message to display if required
			userType: null, // Used to verify whether the user is logged in
			isMember: false, // Assume user is not a member yet
			cancelling: false, // Show a loading spinner while cancelling membership
			loggedIn: true // Assume user can view page to avoid redirecting early
		};
	}

	componentDidMount() {
		backendGetUserInfo()
			.then(res => this.setState({
				userType: res.type,
				isMember: res.CUSTOMER && res.CUSTOMER.subscription
			})).catch(() => this.setState({
				loggedIn: false
			}));

		backendPreFetchPaymentInformation().then(res => (
			this.setState({
				initialOptions: {
					"client-id": res.clientId,
					"currency": "AUD",
					"intent": "subscription",
					"data-client-token": res.clientToken,
					"vault": true
				}
			})
		));
	}

	cancelMembership = () => {
		// Show loading spinner until cancellation is complete
		this.setState({ cancelling: true });
		backendCancelMembership()
			.then(() => this.setState({
				isMember: false,
				cancelling: false
			})).catch(res => this.setState({
				error: `Error: ${res.status} (${res.statusText})`,
				cancelling: false
			}));
	}

	render() {
		return (
			<Container>
				<h2 className="mb-4">Membership</h2>

				{/* Show error message if required */}
				{this.state.error && <Alert variant="danger">{this.state.error}</Alert>}

				{/* Redirect to /login if the user cannot view this page */}
				{!this.state.loggedIn && <Navigate to="/login"/>}
				{
					this.state.userType
					? (
						this.state.isMember
						? <>
							<p>You are a member and will be charged automatically.</p>
							<p>Cancel your membership with the button below:</p>
							{
								this.state.cancelling
								? <CustomSpinner label="Cancelling membership..."/>
								: <Button variant="primary" onClick={this.cancelMembership}>Cancel membership</Button>
							}
						</>
						: <>
							<h5 className="mb-4">WeU's membership program offers unlimited callouts for $80/month!</h5>
							<p>You do not have a membership.</p>
							<DemoPaymentInfo />
							{
								this.state.initialOptions
								? <PayPalScriptProvider options={this.state.initialOptions}>
									<PayPalButtons
										style={{ layout: "vertical", label: "subscribe" }}
										createSubscription={
											(data, actions) => { 
												return backendCreateMembership()
													.then(data => data.id)
													.catch(res => this.setState({
														error: `Error: ${res.status} (${res.statusText})`
													}));
											}
										}
										onApprove={
											(data, actions) => {
												return backendCaptureMembership(data)
													.then(() => this.setState({
														isMember: true
													})).catch(res => this.setState({
														error: `Error: ${res.status} (${res.statusText})`
													}));
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
					)
					: <CustomSpinner label="Loading user info..."/>
				}
			</Container>
		);
	}
}

export default Membership;