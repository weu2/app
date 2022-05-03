import React from "react";
import Button from "react-bootstrap/Button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPlus } from "@fortawesome/free-solid-svg-icons";

// Regular Bootstrap button, except with 100% width and an icon on the right
class LargeButton extends React.Component {

	getIcon() {
		switch (this.props.icon) {
			case "arrow-right":
				return <FontAwesomeIcon icon={faArrowRight} className="float-end mt-1" />
			case "plus":
				return <FontAwesomeIcon icon={faPlus} className="float-end mt-1" />;
			default:
				return null;
		}
	}

	render() {
		return (
			<Button {...this.props} className={
				// Ensure className can be overwritten manually
				`w-100 text-start ${this.props.className ? this.props.className : ""}`
			}>
				{this.getIcon()}
				{this.props.children}
			</Button>
		);
	}
}

export default LargeButton;