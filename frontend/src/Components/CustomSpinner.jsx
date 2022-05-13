import React from "react";
import Spinner from "react-bootstrap/Spinner";

class CustomSpinner extends React.Component {

	render() {
		return <Spinner variant="primary" animation="border" role="status">
			<span className="visually-hidden">{this.props.label}</span>
		</Spinner>
	}
}

export default CustomSpinner;