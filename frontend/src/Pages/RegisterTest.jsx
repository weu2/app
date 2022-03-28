import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faFaceGrinWide, faLockOpen } from "@fortawesome/free-solid-svg-icons";

import "./RegisterTest.css";
import recaptcha from "../Meme/recaptcha.png";
import cross from "../Meme/cross.png"
import grid from "../Meme/grid.png"
import rick from "../Meme/rick.gif"

function formatCreditCard(e) {
	const cardNumber = e.target.value;
	let formattedCardNumber = cardNumber.replace(/[^\d]/g, "");
	const cardNumberSections = formattedCardNumber.match(/\d{1,4}/g);
	if (cardNumberSections) {
		formattedCardNumber = cardNumberSections.join("-"); 
	}
	if (cardNumber !== formattedCardNumber) {
		e.target.value = formattedCardNumber;
	}
}

function formatDate(e) {
	const date = e.target.value;
	let formattedDate = date.replace(/[^\d]/g, "");
	const dateSections = formattedDate.match(/\d{1,2}/g);
	if (dateSections) {
		formattedDate = dateSections.join("/"); 
	}
	if (date !== formattedDate) {
		e.target.value = formattedDate;
	}
}

function formatSecret(e) {
	const secret = e.target.value;
	let formattedSecret = secret.replace(/[^\d]/g, "");
	if (secret !== formattedSecret) {
		e.target.value = formattedSecret;
	}
}

function clickSquare(e) {
	e.preventDefault();
	e.target.className = "Register-Test-Clicked";
}

function RegisterTest() {
	const [page, setPage] = React.useState(0);
	const [state, setState] = React.useState(null);
	const [testVisible, setTestVisible] = React.useState(false);
	
	const customClick = (e) => {
		e.preventDefault();
		setPage(page + 1);
	};

	let timeout;
	const toggleForm = (e) => {
		if (timeout || state) return;
		e.preventDefault();
		setState("spinning");
		timeout = setTimeout(function() {
			setTestVisible(true);
		}, 500);
	}

	const tickForm = (e) => {
		e.preventDefault();
		setState("crossed");
	}

	React.useEffect(() => {
		const updatePosition = (e) => {
			if (!testVisible) return;
			const bounds = document.getElementById("Register-Test-Table").getBoundingClientRect();
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
	}, [testVisible]);

	return (
		<div className="Register">
			<div className="Register-Content">
				<h1>Register Test</h1>
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
						Customer<FontAwesomeIcon icon={faChevronRight} />
					</button>
					<button onClick={customClick} className="btn btn-primary btn-bevel Register-CategoryButton">
						Service Professional<FontAwesomeIcon icon={faChevronRight} />
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
								autoComplete="given-name"
								placeholder="John"
							/>
						</div>
						<div>
							<label htmlFor="lastName">Last Name</label>
							<input
								className="form-input"
								type="text"
								required={page === 1}
								autoComplete="family-name"
								placeholder="Doe"
							/>
						</div>
						<div>
							<label htmlFor="email">Email</label>
							<input
								className="form-input"
								type="email"
								required={page === 1}
								autoComplete="email"
								placeholder="jdoe@gmail.com"
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
									<input
										className="form-input"
										id="Register-CardNumber"
										type="tel"
										pattern="[-\d]{19}"
										maxLength="19"
										placeholder="xxxx-xxxx-xxxx-xxxx"
										onInput={formatCreditCard}
										required={page === 2}
										autoComplete="cc-number"
									/>
									<FontAwesomeIcon className="Register-CardLock" icon={faLockOpen} />
								</div>
								<div className="Register-CardSecrets">
									<input
										className="form-input"
										id="Register-CardDate"
										type="tel"
										pattern="[\/\d]{5}"
										maxLength="5"
										placeholder="04/20"
										onInput={formatDate}
										required={page === 2}
										autoComplete="cc-exp"
									/>
									<input
										className="form-input"
										id="Register-CardSecret"
										type="tel"
										pattern="[\d]{3}"
										maxLength="3"
										placeholder="123"
										onInput={formatSecret}
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
									(state === "crossed") ?
									<div className="Register-Captcha-Cross" style={{backgroundImage: `url(${cross})`}}/> :
									<div className="Register-Captcha-Checkbox" />
								)
							}
							<span>{state === "crossed" ? "WRONG" : "I'm a robot"}</span>
							<img src={recaptcha} className="Register-Captcha-Icon" alt="captcha" />
						</div>
						{
							testVisible ?
							<div className="Register-Test">
								<div className="Register-Test-Header">{
									(state === "crossed") ?
									<div>Your credit card has been charged <FontAwesomeIcon icon={faFaceGrinWide} /></div> :
									"Select all squares with good teaching practice."
								}</div>
								<table id="Register-Test-Table">
									<tbody>
										<tr>
											<td><div id="Register-Square0" alt="square0" style={{
												backgroundImage: `url(${state === "crossed" ? rick : grid})`
											}} onMouseDown={clickSquare} /></td>
											<td><div id="Register-Square1" alt="square1" style={{
												backgroundImage: `url(${state === "crossed" ? rick : grid})`
											}} onMouseDown={clickSquare} /></td>
											<td><div id="Register-Square2" alt="square2" style={{
												backgroundImage: `url(${state === "crossed" ? rick : grid})`
											}} onMouseDown={clickSquare} /></td>
										</tr>
										<tr>
											<td><div id="Register-Square3" alt="square3" style={{
												backgroundImage: `url(${state === "crossed" ? rick : grid})`
											}} onMouseDown={clickSquare} /></td>
											<td><div id="Register-Square4" alt="square4" style={{
												backgroundImage: `url(${state === "crossed" ? rick : grid})`
											}} onMouseDown={clickSquare} /></td>
											<td><div id="Register-Square5" alt="square5" style={{
												backgroundImage: `url(${state === "crossed" ? rick : grid})`
											}} onMouseDown={clickSquare} /></td>
										</tr>
										<tr>
											<td><div id="Register-Square6" alt="square6" style={{
												backgroundImage: `url(${state === "crossed" ? rick : grid})`
											}} onMouseDown={clickSquare} /></td>
											<td><div id="Register-Square7" alt="square7" style={{
												backgroundImage: `url(${state === "crossed" ? rick : grid})`
											}} onMouseDown={clickSquare} /></td>
											<td><div id="Register-Square8" alt="square8" style={{
												backgroundImage: `url(${state === "crossed" ? rick : grid})`
											}} onMouseDown={clickSquare} /></td>
										</tr>
									</tbody>
								</table>
								{
									(state === "crossed") ?
									null :
									<button className="btn btn-primary Register-Test-Verify" onClick={tickForm}>Verify</button>
								}
							</div>
							: null
						}
					</div>
					{
						(page >= 1 && page <= 2) ?
						<button className="btn btn-primary btn-bevel Register-NextButton" type="submit">
							Next<FontAwesomeIcon icon={faChevronRight} />
						</button> : null
					}
				</form>
			</div>
		</div>
	);
}

export default RegisterTest;
