import React from "react";
import { Link } from "react-router-dom";

import logo from "../logo.svg";
import wii from "../Meme/wii.png";
import "./Home.css";

class Home extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			data: null
		};
	}

	componentDidMount() {
		fetch("/api/v1/test")
		.then(res => res.json())
		.then(res => this.setState({
			data: res.jwtverify
		}));
	}

	render() {
		return (
			<div className="Home text-center">
				<div className="Home-Content">
					<img src={logo} className="Home-Logo" alt="logo" />
					<div className="Home-LogoContainer">
						<img src={wii} className="Home-Wii" alt="wii" />
					</div>
					<p>
						{!this.state.data ? "Backend is not working!" : "Backend is working!"}
						<br/>
						Edit <code>src/Pages/Home.jsx</code> and save to reload.
					</p>
					<a className="Home-Link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">Learn React</a>
					<div>
						<Link className="btn btn-secondary Home-Button" to="/register">Register test page</Link>
						<Link className="btn btn-secondary Home-Button" to="/location">Location test page</Link>
						<Link className="btn btn-secondary Home-Button" to="/login">Login test page</Link>
					</div>
				</div>
			</div>
		)
	}
}

export default Home;
