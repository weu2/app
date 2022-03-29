import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faArrowRight, faFaceGrinWide, faLockOpen } from "@fortawesome/free-solid-svg-icons";
import NumberFormat from "react-number-format";

import { backendRegister } from "../api.jsx";
import "./RegisterTest.css";
import recaptcha from "../Meme/recaptcha.png";
import wrong from "../Meme/wrong.png"
import grid from "../Meme/grid.png"
import rick from "../Meme/rick.gif"

class RegisterTest extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			category: null,
			firstName: null,
			lastName: null,
			email: null,
			password: null,
			page: 0,
			captchaState: null,
			quizVisible: false,
			quizVisibleTimeout: null,
			quizDoneTimeout: null
		};
	}

	componentDidMount() {
		document.addEventListener("mousemove", this.updatePosition.bind(this), false);
	}

	componentWillUnmount() {
		clearTimeout(this.state.quizVisibleTimeout);
		clearTimeout(this.state.quizDoneTimeout);
		document.removeEventListener("mousemove", this.updatePosition.bind(this));
	}

	updatePosition(e) {
		if (!this.state.quizVisible) return;

		const table = document.getElementById("Register-CaptchaQuiz-Table");
		if (!table) return;

		const bounds = table.getBoundingClientRect();
		if (!bounds) return;

		const boxWidth = bounds.width / 3;
		const boxHeight = bounds.height / 3;

		for (let i = 0; i < 9; i++) {
			let x = bounds.left + (i % 3 * boxWidth) - e.clientX + (boxWidth * 0.5);
			let y = bounds.top + (Math.floor(i / 3) * boxHeight) - e.clientY + (boxHeight * 0.5);

			if (Math.sqrt(x * x + y * y) < boxWidth * 0.8) {
				x = x > 0 ? boxWidth * 0.75 : -boxWidth * 0.75;
				y = y > 0 ? boxHeight * 0.75 : -boxHeight * 0.75;
			} else {
				x = 0;
				y = 0;
			}

			const square = document.getElementById(`Register-Square${i}`);
			square.style.left = `${x}px`;
			square.style.top = `${y}px`;
		}
	}

	clickQuizSquare(e) {
		e.preventDefault();
		e.target.className = "Register-SquareActive";
	}

	showQuiz(e) {
		e.preventDefault();
		if (this.state.quizVisibleTimeout || this.state.captchaState) return;
		this.setState({
			captchaState: "spinning",
			quizVisibleTimeout: setTimeout(() => {
				this.setState({ quizVisible: true });
			}, 500)
		});
	}

	verifyQuiz(e) {
		e.preventDefault();
		if (this.state.quizDoneTimeout || this.state.captchaState !== "spinning") return;

		/* Send backend request */
		backendRegister(
			this.state.email,
			this.state.password,
			this.state.category,
			this.state.firstName,
			this.state.lastName
		).then(console.log);

		this.setState({
			captchaState: "waiting",
			quizDoneTimeout: setTimeout(() => {
				this.setState({ captchaState: "done" });
			}, 500)
		});
	}

	forwardPage(e) {
		e.preventDefault();
		this.setState({ page: this.state.page + 1 });
	};

	backwardPage(e) {
		e.preventDefault();
		this.setState({ page: this.state.page - 1 });
	}

	render() {
		return (
			<div className="Register">
				<div className="Register-Content">
					<h1>Register</h1>
					{
						(this.state.page > 0) ?
						<button className="btn Register-BackButton" onClick={this.backwardPage.bind(this)}>
							<FontAwesomeIcon icon={faChevronLeft} /> Back
						</button> : null
					}
					<div className={this.state.page === 0 ? null : "Register-Page-Offscreen"}>
						<h2>I am a...</h2>
						<button
							onClick={(e) => {
								this.setState({ category: "customer" });
								this.forwardPage.bind(this)(e);
							}}
							className="btn btn-primary btn-bevel Register-CategoryButton"
						>
							Customer<FontAwesomeIcon icon={faArrowRight} />
						</button>
						<button
							onClick={(e) => {
								this.setState({ category: "professional" });
								this.forwardPage.bind(this)(e);
							}}
							className="btn btn-primary btn-bevel Register-CategoryButton"
						>
							Service Professional<FontAwesomeIcon icon={faArrowRight} />
						</button>
					</div>
					<form onSubmit={this.forwardPage.bind(this)}>
						<div className={this.state.page === 1 ? null : "Register-Page-Offscreen"}>
							<div>
								<label htmlFor="firstName">First Name</label>
								<input
									className="form-input"
									type="text"
									required={this.state.page === 1}
									placeholder="Dave"
									autoComplete="given-name"
									onChange={e => this.setState({ firstName: e.target.value })}
								/>
							</div>
							<div>
								<label htmlFor="lastName">Last Name</label>
								<input
									className="form-input"
									type="text"
									required={this.state.page === 1}
									placeholder="O"
									autoComplete="family-name"
									onChange={e => this.setState({ lastName: e.target.value })}
								/>
							</div>
							<div>
								<label htmlFor="email">Email</label>
								<input
									className="form-input"
									type="email"
									required={this.state.page === 1}
									placeholder="davo@gmail.com"
									autoComplete="email"
									onChange={e => this.setState({ email: e.target.value })}
								/>
							</div>
							<div>
								<label htmlFor="password">Password</label>
								<input
									className="form-input"
									type="password"
									required={this.state.page === 1}
									autoComplete="current-password"
									onChange={e => this.setState({ password: e.target.value })}
								/>
							</div>
						</div>
						<div className={this.state.page === 2 ? null : "Register-Page-Offscreen"}>
							<label htmlFor="cardNumber">Mother's credit card number</label>
							<div className="Register-CreditCard">
								<div className="Register-CardStrip" />
								<div className="Register-CardInputs">
									<div className="Register-CardNumberContainer">
										<NumberFormat
											className="form-input"
											id="Register-CardNumber"
											format="####-####-####-####"
											mask="_"
											placeholder="xxxx-xxxx-xxxx-xxxx"
											required={this.state.page === 2}
											autoComplete="cc-number"
										/>
										<FontAwesomeIcon className="Register-CardLock" icon={faLockOpen} />
									</div>
									<div className="Register-CardSecrets">
										<NumberFormat
											className="form-input"
											id="Register-CardDate"
											format="##/##"
											placeholder="MM/YY"
											mask="_"
											required={this.state.page === 2}
											autoComplete="cc-exp"
										/>
										<NumberFormat
											className="form-input"
											id="Register-CardSecret"
											format="###"
											mask="_"
											placeholder="CVC"
											required={this.state.page === 2}
											autoComplete="cc-csc"
										/>
									</div>
								</div>
							</div>
						</div>
						<div className={this.state.page === 3 ? null : "Register-Page-Offscreen"}>
							<div className="Register-Captcha" onClick={this.showQuiz.bind(this)}>
								{
									(this.state.captchaState === "spinning") ?
									<div className="Register-Captcha-Spinner" /> :
									(
										(this.state.captchaState === "waiting" || this.state.captchaState === "done") ?
										<div className="Register-Captcha-Wrong" style={{backgroundImage: `url(${wrong})`}}/> :
										<div className="Register-Captcha-Checkbox" />
									)
								}
								<span>{this.state.captchaState === "done" ? "WRONG" : "I'm a robot"}</span>
								<img src={recaptcha} className="Register-Captcha-Icon" alt="captcha" />
							</div>
							{
								this.state.quizVisible ?
								<div className="Register-CaptchaQuiz">
									<div className="Register-CaptchaQuiz-Header">{
										(this.state.captchaState === "done") ?
										<div>Your credit card has been charged <FontAwesomeIcon icon={faFaceGrinWide} /></div> :
										"Select all images with good teaching practice."
									}</div>
									<table id="Register-CaptchaQuiz-Table">
										<tbody>
											<tr>
												<td><div id="Register-Square0" alt="square0" style={{
													backgroundImage: `url(${this.state.captchaState === "done" ? rick : grid})`
												}} onMouseDown={this.clickQuizSquare} /></td>
												<td><div id="Register-Square1" alt="square1" style={{
													backgroundImage: `url(${this.state.captchaState === "done" ? rick : grid})`
												}} onMouseDown={this.clickQuizSquare} /></td>
												<td><div id="Register-Square2" alt="square2" style={{
													backgroundImage: `url(${this.state.captchaState === "done" ? rick : grid})`
												}} onMouseDown={this.clickQuizSquare} /></td>
											</tr>
											<tr>
												<td><div id="Register-Square3" alt="square3" style={{
													backgroundImage: `url(${this.state.captchaState === "done" ? rick : grid})`
												}} onMouseDown={this.clickQuizSquare} /></td>
												<td><div id="Register-Square4" alt="square4" style={{
													backgroundImage: `url(${this.state.captchaState === "done" ? rick : grid})`
												}} onMouseDown={this.clickQuizSquare} /></td>
												<td><div id="Register-Square5" alt="square5" style={{
													backgroundImage: `url(${this.state.captchaState === "done" ? rick : grid})`
												}} onMouseDown={this.clickQuizSquare} /></td>
											</tr>
											<tr>
												<td><div id="Register-Square6" alt="square6" style={{
													backgroundImage: `url(${this.state.captchaState === "done" ? rick : grid})`
												}} onMouseDown={this.clickQuizSquare} /></td>
												<td><div id="Register-Square7" alt="square7" style={{
													backgroundImage: `url(${this.state.captchaState === "done" ? rick : grid})`
												}} onMouseDown={this.clickQuizSquare} /></td>
												<td><div id="Register-Square8" alt="square8" style={{
													backgroundImage: `url(${this.state.captchaState === "done" ? rick : grid})`
												}} onMouseDown={this.clickQuizSquare} /></td>
											</tr>
										</tbody>
									</table>
									{
										(this.state.captchaState === "done") ? null :
										<button className="btn btn-primary Register-CaptchaQuiz-Verify" onClick={this.verifyQuiz.bind(this)}>Verify</button>
									}
								</div> : null
							}
						</div>
						{
							(this.state.page >= 1 && this.state.page <= 2) ?
							<button className="btn btn-primary btn-bevel Register-NextButton" type="submit">
								Next<FontAwesomeIcon icon={faArrowRight} />
							</button> : null
						}
					</form>
				</div>
			</div>
		);
	}
}

export default RegisterTest;
