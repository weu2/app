import React from "react";

// <Alert> is useful for displaying success or error messages, see react-bootstrap.github.io/components/alerts/
import Alert from "react-bootstrap/Alert";

// <Button> is a general purpose button with many different styles, see react-bootstrap.github.io/components/buttons/
import Button from "react-bootstrap/Button";

// <Container> adds padding to the sides of the page content, makes it look nicer
import Container from "react-bootstrap/Container";

// <LargeButton> is a subclass of React Bootstrap's <Button> with an icon added to the right side
import LargeButton from "../Components/LargeButton";

// api.jsx contains utility functions for getting or sending data from the frontend to the backend
// For example, sending form data or getting user info
import { backendTest } from "../api.jsx";

class Home extends React.Component {

	constructor(props) {
		super(props); // Call React.Component's constructor as well as our own constructor
		this.state = { // "this.state" variables automatically update the website whenever they get changed
			data: null // "this.state.data" holds a variable only when backendTest() succeeds
		};
	}

	componentDidMount() {
		// Check whether the backend works
		backendTest().then(res => this.setState({
			data: res.jwtverify // Store something in "this.state.data" if it does
		}));
	}

	render() {
		return (
			// <Container> adds padding around the website content, makes it look nicer
			<Container>
				{/* "mb-4" is a Bootstrap CSS class for setting margin-bottom, see getbootstrap.com/docs/5.1/utilities/spacing/ */}
				<h1 className="mb-4">
					{/* Logos are stored as vector art for the best possible quality
					"/logo.svg" is the shorthand for "/public/logo.svg" */}
					Welcome to <img src="/logo.svg" width="128" alt="WeU"/>
				</h1>
				{/* variant="success" means an <Alert> is green, variant="danger" means an <Alert> is red
					See react-bootstrap.github.io/components/alerts/ for more details */}
				<Alert variant={this.state.data ? "success" : "danger"} className="mb-4">
					{/* if "this.state.data" exists, the backend works */}
					{this.state.data ? "Backend is working!" : "Backend is not working!"}
				</Alert>
				{/* "mb-3" is a Bootstrap CSS class for setting margin-bottom, see getbootstrap.com/docs/5.1/utilities/spacing/ */}
				<div className="mb-3">
					{/* variant="primary" makes the button pink, see react-bootstrap.github.io/components/buttons/ for more colours */}
					<Button variant="primary">Primary button</Button>
				</div>
				<div className="mb-3">
					{/* variant="secondary" makes the button green, see react-bootstrap.github.io/components/buttons/ for more colours */}
					<Button variant="secondary">Secondary button</Button>
				</div>
				<div className="mb-4">
					{/* <LargeButton> is a subclass of <Button> I made to put an arrow on the right hand side
					Currently the only icon is "arrow-right", you can add more later in Components/LargeButton.jsx */}
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
					{/* "me-2" is a Bootstrap CSS class for setting margin-end, see getbootstrap.com/docs/5.1/utilities/spacing/ */}
					{/* Default HTML <button> should not be used, React Bootstrap's <Button> is better */}
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
