import React from "react";

import Table from "react-bootstrap/Table";

class DemoPaymentInfo extends React.Component {

	render() {
		return (<>
			<p>
				For the purposes of this app, we are only using PayPal's sandbox environment.
				<br/>
				Please use the login credentials provided below:
			</p>
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
		</>);
	}
}

export default DemoPaymentInfo;