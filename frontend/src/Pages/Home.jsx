import React from "react";
import { Link } from "react-router-dom";

import logo from "../logo.svg";
import wii from "../Meme/wii.png";
import "./Home.css";

function Home() {
	const [data, setData] = React.useState(null);

	React.useEffect(() => {
		fetch("/api/v1/test")
			.then(res => res.json())
			.then(data => setData(JSON.stringify(data)));
	}, []);

	return (
		<div className="Home">
			<div className="Content">
				<img src={logo} className="Logo" alt="logo" />
				<div className="LogoContainer">
					<img src={wii} className="Wii" alt="wii" />
				</div>
				<p>
					{!data ? "Backend is not working!" : data}
					<br/>
					Edit <code>src/Pages/Home.jsx</code> and save to reload.
				</p>
				<a className="Link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">Learn React</a>
				<div>
					<Link className="Button" to="/register">Register test page</Link>
					<Link className="Button" to="/location">Location test page</Link>
					<Link className="Button" to="/login">Login test page</Link>
				</div>
			</div>
		</div>
	);
}

export default Home;
