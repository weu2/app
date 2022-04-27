import React from "react";

import CalloutList from "../Components/CalloutList";

// api.jsx contains utility functions for getting or sending data from the frontend to the backend
// For example, sending form data or getting user info
import { backendGetNewCallouts } from "../api.jsx";

// Wrapper class for <CalloutList>
class FindCallouts extends React.Component {

	render() {
		return (
			<CalloutList title="Find Callouts" endpoint={backendGetNewCallouts} />
		);
	}
}

export default FindCallouts;