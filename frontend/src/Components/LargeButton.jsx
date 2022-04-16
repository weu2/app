import React from "react";
import Button from "react-bootstrap/Button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Currently this only has one icon option "arrow-right", more could be added later
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

// Regular Bootstrap button, except with 100% width and an icon on the right
class LargeButton extends React.Component {

	render() {
		return (
			<Button {...this.props} className="d-flex w-100 align-items-center flex-row justify-content-between">
				{this.props.children}
				{this.props.icon === "arrow-right" ? <FontAwesomeIcon icon={faArrowRight} /> : null}
			</Button>
		);
	}
}

export default LargeButton;