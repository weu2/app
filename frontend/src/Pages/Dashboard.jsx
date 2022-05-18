import React from "react";

import CalloutList from "../Components/CalloutList";

// api.jsx contains utility functions for getting or sending data from the frontend to the backend
// For example, sending form data or getting user info
import { backendGetMyCallouts } from "../api.jsx";

// Wrapper class for <CalloutList>
class Dashboard extends React.Component {

	render() {
		return (
			<CalloutList
				title="Dashboard"
				endpoint={backendGetMyCallouts}
				customerhelp={<>
					<p>Callouts you opened will be listed here.</p>
					<p>
						Use the link in the top menu to request a callout.
					</p>
				</>}
				professionalhelp={<>
					<p>Callouts you accepted will be listed here.</p>
					<p>
						Use the link in the top menu to find new callouts.
					</p>
				</>}
				administratorhelp={<>
					<p>All callouts will be listed here.</p>
				</>}
			/>
		);
	}
}

export default Dashboard;