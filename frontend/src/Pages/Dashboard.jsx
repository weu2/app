import React from "react";
import { Link } from "react-router-dom";

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
						Use the top menu to <Link to="/requestcallout" className="text-decoration-none">request a callout.</Link>
					</p>
				</>}
				professionalhelp={<>
					<p>Callouts you accepted will be listed here.</p>
					<p>
						Use the top menu to <Link to="/findcallouts" className="text-decoration-none">find new callouts.</Link>
					</p>
				</>}
			/>
		);
	}
}

export default Dashboard;