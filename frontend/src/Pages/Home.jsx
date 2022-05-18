import React from "react";

// <Container> adds padding to the sides of the page content, makes it look nicer
import Container from "react-bootstrap/Container";
import Carousel from "react-bootstrap/Carousel";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import CustomRating from "../Components/CustomRating";

class Home extends React.Component {

	render() {
		return (
			// <Container> adds padding around the website content, makes it look nicer
			<Container>
				{/* "mb-4" is a Bootstrap CSS class for setting margin-bottom, see getbootstrap.com/docs/5.1/utilities/spacing/ */}
				<h1 className="mb-4 text-center">
					{/* Logos are stored as vector art for the best possible quality
					"/logo.svg" is the shorthand for "/public/logo.svg" */}
					Welcome to <img src="/logo.svg" width="128" alt="WeU"/>
				</h1>
				<h5 className="mb-3 text-center">WeU offers the highest quality roadside assistance at unbeatable prices.</h5>
				<p className="mb-4 text-center">Hundreds of customers and service professionals work with us every day. To join us, click the "register" link in the top navigation bar.</p>
				
				<h3 className="mb-4">Payment plans</h3>
				<Row>
					<Col sm className="mb-3">
						<Card bg="primary" text="black">
							<Card.Header as="h5" className="text-center">Pay on Demand</Card.Header>
							<Card.Body style={{ backgroundColor: "#FFFFFFAA" }}>
								<Card.Title className="text-center">
									Price chosen by service professional
								</Card.Title>
								<Card.Text>
									By default, pay once and forget. The price of each callout is decided by the service professional depending on the requirements.
								</Card.Text>
							</Card.Body>
						</Card>
					</Col>
					<Col className="mb-3">
						<Card bg="secondary" text="black">
							<Card.Header as="h5" className="text-center">Membership Subscription</Card.Header>
							<Card.Body style={{ backgroundColor: "#FFFFFFAA" }}>
								<Card.Title className="text-center">
									$80 / month
								</Card.Title>
								<Card.Text>
									Power users can pay $80 each month for as much service as needed. The membership can be cancelled at any time.
								</Card.Text>
							</Card.Body>
						</Card>
					</Col>
				</Row>

				<h3 className="mb-4 mt-2">Services</h3>
				<p>We provide services for all types of roadside issues, including but not limited to:</p>
				<ul>
					<li>Flat tyre repair</li>
					<li>Spark plug repair</li>
					<li>Car battery repair</li>
					<li>Engine repair</li>
					<li>Transmission repair</li>
					<li>Windshield replacement</li>
					<li>Keys locked in car</li>
					<li>Towing</li>
				</ul>

				<h3 className="mb-3 mt-4">Testimonials</h3>
				<Carousel variant="dark">
					<Carousel.Item>
						<div className="w-100 pb-5 text-center">
							<CustomRating readonly initialRating={5} size={25} className="mb-2" />
							<blockquote className="blockquote mb-0">
								<p>"Got drunk and drove my 180SX off a cliff. Mechanic patched it up as good as new!"</p>
								<footer className="blockquote-footer">Caleb Wait</footer>
							</blockquote>
						</div>
					</Carousel.Item>
					<Carousel.Item>
						<div className="w-100 pb-5 text-center">
							<CustomRating readonly initialRating={4} size={25} className="mb-2" />
							<blockquote className="blockquote mb-0">
								<p>"Extremely good service, almost made it to Wagga Wagga in time for the wave."</p>
								<footer className="blockquote-footer">Kaleb Dodds-Pratt</footer>
							</blockquote>
						</div>
					</Carousel.Item>
					<Carousel.Item>
						<div className="w-100 pb-5 text-center">
							<CustomRating readonly initialRating={5} size={25} className="mb-2" />
							<blockquote className="blockquote mb-0">
								<p>"Accidentally hit a pedestrian. Mechanic came quick, fixed the car and even paid off the police. Couldn't ask for more!"</p>
								<footer className="blockquote-footer">Hallam Roberts</footer>
							</blockquote>
						</div>
					</Carousel.Item>
					<Carousel.Item>
						<div className="w-100 pb-5 text-center">
							<CustomRating readonly initialRating={5} size={25} className="mb-2" />
							<blockquote className="blockquote mb-0">
								<p>"My EV ran flat on my drive to Dapto. Mechanic brought some AAAs from his wife's boyfriend, got there just in time to see my dealer!"</p>
								<footer className="blockquote-footer">Geofry Boswell</footer>
							</blockquote>
						</div>
					</Carousel.Item>
					<Carousel.Item>
						<div className="w-100 pb-5 text-center">
							<CustomRating readonly initialRating={4} size={25} className="mb-2" />
							<blockquote className="blockquote mb-0">
								<p>"The mechanic put kitchen oil into my diesel car."</p>
								<footer className="blockquote-footer">Elon Musk</footer>
							</blockquote>
						</div>
					</Carousel.Item>
				</Carousel>
			</Container>
		)
	}
}

export default Home;