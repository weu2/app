function Header(props) {
	return (
		<div className={props.center === "true" ? "Header Header-Center" : "Header"}>{props.text}</div>
	);
}

export default Header;