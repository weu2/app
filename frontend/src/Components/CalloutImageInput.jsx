import React from "react";

// <Alert> is useful for displaying success or error messages, see react-bootstrap.github.io/components/alerts/
import Alert from "react-bootstrap/Alert";
import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";

import LargeButton from "./LargeButton";

import { backendUploadImage } from "../api.jsx";

class CalloutImageInput extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			images: props.callout.images, // Images if any were uploaded
			error: null // Display failure message if an error occurs
		}
	}

	loadImage = (event) => {
		// ensure at least one image was attached
		if (event.target.files.length === 0) return;
		// Manually send form data to backend
		backendUploadImage(new FormData(this.form))
			.then(res => this.setState({
				// Add preview for uploaded image
				images: [...this.state.images, res.uuid]
			})).catch(res => this.setState({
				// Show error message
				error: `Error: ${res.status} (${res.statusText})`
			}));
	}

	render() {
		return (
			this.props.customer
			? <Form ref={input => this.form = input}>
			
				{/* Fake new appearance of file input */}
				<LargeButton
					icon="plus"
					variant="light"
					onClick={() => this.imageInput.click()}
				>
					Attach photos
					{/* Display preview of attached images */}
					<div>
					{
						this.state.images.map((image, index) =>
							<Image
								className="mt-2 mb-1"
								src={`/api/v1/image/${image}`}
								key={index}
								thumbnail
								width={128}
							/>
						)
					}
					</div>
				</LargeButton>

				{/* Hide actual file input */}
				<Form.Control
					ref={input => this.imageInput = input}
					className="d-none"
					name="image"
					type="file"
					accept="image/jpeg"
					capture
					onChange={this.loadImage}
					required
				/>

				{/* Include callout ID in form submission automatically */}
				<Form.Control name="calloutId" type="hidden" value={this.props.callout.uuid} required />

				{/* Display an error message if required */}
				{this.state.error && <Alert variant="danger">{this.state.error}</Alert>}
			</Form>
			: <div className="p-2">
			{
				this.state.images.map((image, index) =>
					<Image
						src={`/api/v1/image/${image}`}
						key={index}
						thumbnail
						width={128}
					/>
				)
			}
			</div>
		);
	}
}

export default CalloutImageInput;