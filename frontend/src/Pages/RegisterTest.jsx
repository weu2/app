import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faArrowRight, faFaceGrinWide, faLockOpen } from "@fortawesome/free-solid-svg-icons";
import InputMask from "react-input-mask";

import "./RegisterTest.css";
import recaptcha from "../Meme/recaptcha.png";
import wrong from "../Meme/wrong.png"
import grid from "../Meme/grid.png"
import rick from "../Meme/rick.gif"

function clickSquare(e) {
	e.preventDefault();
	e.target.className = "Register-SquareActive";
}

function RegisterTest() {
	const [page, setPage] = React.useState(0);
	const [state, setState] = React.useState(null);
	const [quizVisible, setQuizVisible] = React.useState(false);
	
	const customClick = (e) => {
		e.preventDefault();
		setPage(page + 1);
	};

	let timeout;
	const toggleForm = (e) => {
		e.preventDefault();
		if (timeout || state) return;
		setState("spinning");
		timeout = setTimeout(() => {
			setQuizVisible(true);
		}, 500);
	}

	let timeout2;
	const tickForm = (e) => {
		e.preventDefault();
		if (timeout2 || state !== "spinning") return;
		setState("waiting");
		timeout2 = setTimeout(() => {
			setState("done");
		}, 500);
	}

	React.useEffect(() => {
		const updatePosition = (e) => {
			if (!quizVisible) return;
			const bounds = document.getElementById("Register-CaptchaQuiz-Table").getBoundingClientRect();
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
		document.addEventListener("mousemove", updatePosition, false);
		return () => {
			document.removeEventListener("mousemove", updatePosition);
		}
	}, [quizVisible]);

	return (
		<div className="Register">
			<div className="Register-Content">
				<h1>Register</h1>
				{
					(page > 0) ?
					<button className="btn Register-BackButton" onClick={() => setPage(page - 1)}>
						<FontAwesomeIcon icon={faChevronLeft} /> Back
					</button> :
					null
				}
				<div className={page === 0 ? null : "Register-Page-Offscreen"}>
					<h2>I am a...</h2>
					<button onClick={customClick} className="btn btn-primary btn-bevel Register-CategoryButton">
						Customer<FontAwesomeIcon icon={faArrowRight} />
					</button>
					<button onClick={customClick} className="btn btn-primary btn-bevel Register-CategoryButton">
						Service Professional<FontAwesomeIcon icon={faArrowRight} />
					</button>
				</div>
				<form onSubmit={customClick}>
					<div className={page === 1 ? null : "Register-Page-Offscreen"}>
						<div>
							<label htmlFor="firstName">First Name</label>
							<input
								className="form-input"
								type="text"
								required={page === 1}
								placeholder="Dave"
								autoComplete="given-name"
							/>
						</div>
						<div>
							<label htmlFor="lastName">Last Name</label>
							<input
								className="form-input"
								type="text"
								required={page === 1}
								placeholder="O"
								autoComplete="family-name"
							/>
						</div>
						<div>
							<label htmlFor="email">Email</label>
							<input
								className="form-input"
								type="email"
								required={page === 1}
								placeholder="davo@gmail.com"
								autoComplete="email"
							/>
						</div>
						<div>
							<label htmlFor="password">Password</label>
							<input
								className="form-input"
								type="password"
								required={page === 1}
								autoComplete="current-password"
							/>
						</div>
					</div>
					<div className={page === 2 ? null : "Register-Page-Offscreen"}>
						<label htmlFor="cardNumber">Mother's credit card number</label>
						<div className="Register-CreditCard">
							<div className="Register-CardStrip" />
							<div className="Register-CardInputs">
								<div className="Register-CardNumberContainer">
									<InputMask
										className="form-input"
										id="Register-CardNumber"
										mask="9999-9999-9999-9999"
										placeholder="xxxx-xxxx-xxxx-xxxx"
										required={page === 2}
										autoComplete="cc-number"
									/>
									<FontAwesomeIcon className="Register-CardLock" icon={faLockOpen} />
								</div>
								<div className="Register-CardSecrets">
									<InputMask
										className="form-input"
										id="Register-CardDate"
										mask="99/99"
										placeholder="MM/YY"
										required={page === 2}
										autoComplete="cc-exp"
									/>
									<InputMask
										className="form-input"
										id="Register-CardSecret"
										mask="999"
										placeholder="CVC"
										required={page === 2}
										autoComplete="cc-csc"
									/>
								</div>
							</div>
						</div>
					</div>
					<div className={page === 3 ? null : "Register-Page-Offscreen"}>
						<div className="Register-Captcha" onClick={toggleForm}>
							{
								(state === "spinning") ?
								<div className="Register-Captcha-Spinner" /> :
								(
									(state === "waiting" || state === "done") ?
									<div className="Register-Captcha-Wrong" style={{backgroundImage: `url(${wrong})`}}/> :
									<div className="Register-Captcha-Checkbox" />
								)
							}
							<span>{state === "done" ? "WRONG" : "I'm a robot"}</span>
							<img src={recaptcha} className="Register-Captcha-Icon" alt="captcha" />
						</div>
						{
							quizVisible ?
							<div className="Register-CaptchaQuiz">
								<div className="Register-CaptchaQuiz-Header">{
									(state === "done") ?
									<div>Your credit card has been charged <FontAwesomeIcon icon={faFaceGrinWide} /></div> :
									"Select all images with good teaching practice."
								}</div>
								<table id="Register-CaptchaQuiz-Table">
									<tbody>
										<tr>
											<td><div id="Register-Square0" alt="square0" style={{
												backgroundImage: `url(${state === "done" ? rick : grid})`
											}} onMouseDown={clickSquare} /></td>
											<td><div id="Register-Square1" alt="square1" style={{
												backgroundImage: `url(${state === "done" ? rick : grid})`
											}} onMouseDown={clickSquare} /></td>
											<td><div id="Register-Square2" alt="square2" style={{
												backgroundImage: `url(${state === "done" ? rick : grid})`
											}} onMouseDown={clickSquare} /></td>
										</tr>
										<tr>
											<td><div id="Register-Square3" alt="square3" style={{
												backgroundImage: `url(${state === "done" ? rick : grid})`
											}} onMouseDown={clickSquare} /></td>
											<td><div id="Register-Square4" alt="square4" style={{
												backgroundImage: `url(${state === "done" ? rick : grid})`
											}} onMouseDown={clickSquare} /></td>
											<td><div id="Register-Square5" alt="square5" style={{
												backgroundImage: `url(${state === "done" ? rick : grid})`
											}} onMouseDown={clickSquare} /></td>
										</tr>
										<tr>
											<td><div id="Register-Square6" alt="square6" style={{
												backgroundImage: `url(${state === "done" ? rick : grid})`
											}} onMouseDown={clickSquare} /></td>
											<td><div id="Register-Square7" alt="square7" style={{
												backgroundImage: `url(${state === "done" ? rick : grid})`
											}} onMouseDown={clickSquare} /></td>
											<td><div id="Register-Square8" alt="square8" style={{
												backgroundImage: `url(${state === "done" ? rick : grid})`
											}} onMouseDown={clickSquare} /></td>
										</tr>
									</tbody>
								</table>
								{
									(state === "done") ?
									null :
									<button className="btn btn-primary Register-CaptchaQuiz-Verify" onClick={tickForm}>Verify</button>
								}
							</div>
							: null
						}
					</div>
					{
						(page >= 1 && page <= 2) ?
						<button className="btn btn-primary btn-bevel Register-NextButton" type="submit">
							Next<FontAwesomeIcon icon={faArrowRight} />
						</button> : null
					}
				</form>
			</div>
		</div>
	);
}

export default RegisterTest;
