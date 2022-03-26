import React from 'react';
import '../App.css';

function Header(props) {

	return (
		<div className={props.centre === "true" ? "header header-centre" : "header"}>{props.text}</div>
	);
}

export default Header;