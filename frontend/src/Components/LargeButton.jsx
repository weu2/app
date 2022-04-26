import React from "react";
import Button from "react-bootstrap/Button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Currently this only has one icon option "arrow-right", more could be added later
import { faArrowRight, faPlus } from "@fortawesome/free-solid-svg-icons";

// Regular Bootstrap button, except with 100% width and an icon on the right
class LargeButton extends React.Component {

	getIcon(icon) {
		switch (icon) {
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
			<Button {...this.props} className="w-100 text-start">
				{this.getIcon(this.props.icon)}
				{this.props.children}
			</Button>
		);
	}
}

export default LargeButton;