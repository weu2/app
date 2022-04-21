import React from "react";

class NoPage extends React.Component {
	render() {
		return (
			// "text-center" is a Bootstrap CSS class that corresponds to text-align: center
			<h1 className="text-center">404: Page not found :(</h1>
		);
	}
}

export default NoPage;