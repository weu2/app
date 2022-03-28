import React from "react";
import Header from "../Components/Header";

class NoPage extends React.Component {
	render() {
		return (
			<Header 
				text="404: Page not found :(" 
				center="true"
			/>
		);
	}
}

export default NoPage;