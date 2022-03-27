function Header(props) {
	return (
		<div className={props.center === "true" ? "Header text-center" : "Header"}>{props.text}</div>
	);
}

export default Header;