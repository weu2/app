import React from "react";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import LargeButton from "../Components/LargeButton";

import { backendTest } from "../api.jsx";

class Home extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			data: null
		};
	}

	componentDidMount() {
		backendTest().then(res => this.setState({
			data: res.jwtverify
		}));
	}

	render() {
		return (
			<Container>
				<h1 className="mb-4">
					Welcome to <img src="/logo.svg" width="128" alt="WeU"/>
				</h1>
				<Alert variant={this.state.data ? "success" : "danger"} className="mb-4">
					{this.state.data ? "Backend is working!" : "Backend is not working!"}
				</Alert>
				<div className="mb-3">
					<Button variant="primary">Primary button</Button>
				</div>
				<div className="mb-3">
					<Button variant="secondary">Secondary button</Button>
				</div>
				<div className="mb-4">
					<LargeButton variant="primary" icon="arrow-right">
						Custom button from Components/LargeButton.jsx
					</LargeButton>
				</div>
				<p>
					This website uses <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">React</a> for the frontend
					and <a href="https://expressjs.com/" target="_blank" rel="noopener noreferrer">Express</a> for the backend.
				</p>
				<p>
					It also uses <a href="https://react-bootstrap.github.io/getting-started/introduction" target="_blank" rel="noopener noreferrer">React Bootstrap</a>.
					This includes many custom React components like <code>{"<Button>"}</code> to avoid raw HTML.
				</p>
				<div className="mb-3">
					<button className="me-2">Regular HTML button</button>
					<Button>React Bootstrap button</Button>
				</div>
				<p>
					Bootstrap comes with <a href="https://getbootstrap.com/docs/5.1/utilities/spacing/" target="_blank" rel="noopener noreferrer">lots of CSS classes</a> to avoid writing raw CSS.
				</p>
				<p>
					For example, <code>mb-4</code> is a shorthand for <code>margin-bottom</code>, where the <code>4</code> is a preset margin size.
				</p>
			</Container>
		)
	}
}

export default Home;
