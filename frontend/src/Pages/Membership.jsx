import React from "react";

// <Container> adds padding to the sides of the page content, makes it look nicer
import Container from "react-bootstrap/Container";
import MembershipForm from "../Components/MembershipForm";

// api.jsx contains utility functions for getting or sending data from the frontend to the backend
// For example, sending form data or getting user info
// import { backendGetUserInfo } from "../api.jsx";

class Membership extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isMember: false,
			activeMember: false
		};
	}

	render() {
		return (
			<Container>
				<h2 className="mb-4">Membership</h2>
				<h5>Has Membership: {this.state.isMember ? "Yes" : "No"}</h5>
				<h5 className="mb-4">Membership Status: {this.state.activeMember ? "Active" : "Inactive"}</h5>
				{
					this.state.isMember
					? (
						this.state.activeMember
						// For active members, display the renewal date
						? <>
							<h5>Membership Renewal Date: TODO</h5>
						</>
						// For non-active members, request new card information
						: <>
							<p>Please renew your membership below.</p>
							<MembershipForm />
						</>
					)
					: <>
						<p>You do not currently have a membership with WeU.</p>
						<p className="mb-4">To become a member, please fill in the details below.</p>
						<MembershipForm />
					</>
				}
			</Container>
		);
	}
}

export default Membership;