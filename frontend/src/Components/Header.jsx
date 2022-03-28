import React from "react";

class Header extends React.Component {
	render() {
		return (
			<div className={this.props.center === "true" ? "Header text-center" : "Header"}>
				{this.props.text}
			</div>
		);
	}
}

export default Header;