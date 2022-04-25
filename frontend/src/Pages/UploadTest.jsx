import React from "react";

// <Alert> is useful for displaying success or error messages, see react-bootstrap.github.io/components/alerts/
import Alert from "react-bootstrap/Alert";

// <Button> is a general purpose button with many different styles, see react-bootstrap.github.io/components/buttons/
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";

// <Container> adds padding to the sides of the page content, makes it look nicer
import Container from "react-bootstrap/Container";

// api.jsx contains utility functions for getting or sending data from the frontend to the backend
// For example, sending form data or getting user info
import { backendUploadImage } from "../api.jsx";

class Login extends React.Component {

	constructor(props) {
		super(props); // Call React.Component's constructor as well as our own constructor
		this.state = { // "this.state" variables automatically update the website whenever they get changed
			imageId: null, // Image ID if an image was uploaded
			error: null // Display failure message if an error occurs
		};
	}

	loadImage = (event) => {
		// Get form element manually
		const form = document.getElementById("form");
		// Upload image to backend
		backendUploadImage(new FormData(form))
			.then(async(res) => this.setState({
				// Show "uploaded" alert with image UUID
				imageId: await res.text()
			})).catch(res => this.setState({
				// Show error message
				error: `Error: ${res.status} (${res.statusText})`
			}));
	}

	render() {
		return (
			// <Container> adds padding around the website content, makes it look nicer
			<Container>
				{/* "mb-4" is a Bootstrap CSS class for setting margin-bottom, see getbootstrap.com/docs/5.1/utilities/spacing/ */}
				<h2 className="mb-4">Upload</h2>

				{/* Show alert with image ID to indicate an image was uploaded */}
				{this.state.imageId ? <Alert variant="success">Uploaded image! {this.state.imageId}</Alert> : null}

				{/* Display an error message if required */}
				{this.state.error ? <Alert variant="danger">{this.state.error}</Alert> : null}

				<Form id="form">
					<Form.Group controlId="formFileMultiple">
						<Form.Label>Select images below, automatically uploaded to the backend</Form.Label>
						{/* "capture" opens a camera input for mobile users */}
						<Form.Control name="image" type="file" accept="image/jpeg" capture onChange={this.loadImage} />
						{ // Display image preview from database
							this.state.imageId
							? <Image src={`/api/v1/uploads/${this.state.imageId}`} thumbnail width={256}/>
							: null
						}
					</Form.Group>
				</Form>
			</Container>
		);
	}
}

export default Login;