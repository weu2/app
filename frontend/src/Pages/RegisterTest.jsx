import React from "react";
import "./RegisterTest.css";
import recaptcha from "../Meme/recaptcha.png";
import square0 from "../Meme/square0.jpg";
import square1 from "../Meme/square1.jpg";
import square2 from "../Meme/square2.jpg";
import square3 from "../Meme/square3.jpg";
import square4 from "../Meme/square4.jpg";
import square5 from "../Meme/square5.jpg";
import square6 from "../Meme/square6.jpg";
import square7 from "../Meme/square7.jpg";
import square8 from "../Meme/square8.jpg";

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
		if (timeout) return;
		e.preventDefault();
		setState("spinning");
		timeout = setTimeout(function() {
			setTestVisible(true);
		}, 500);
	}

	const tickForm = (e) => {
		e.preventDefault();
		setState("ticked");
	}

	React.useEffect(() => {
		const updatePosition = (e) => {
			if (!testVisible) return;
			const bounds = document.getElementById("Register-Test-Table").getBoundingClientRect();
			for (let i = 0; i < 9; i++) {
				let x = bounds.left + (i % 3 * 128) - e.clientX + 64;
				let y = bounds.top + (Math.floor(i / 3) * 128) - e.clientY + 64;
				if (Math.sqrt(x * x + y * y) < 100) {
					x = x > 0 ? 80 : -80;
					y = y > 0 ? 80 : -80;
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
					page > 0 ?
					<button className="Register-BackButton" onMouseDown={() => setPage(page - 1)}>🡸 Back</button>
					: null
				}
				<div className={page === 0 ? null : "Register-Page-Offscreen"}>
					<h2>I am a...</h2>
					<button onClick={customClick} className="Register-CategoryButton">
						Customer
						<span className="Register-Arrow">🡺</span>
					</button>
					<button onClick={customClick} className="Register-CategoryButton">
						Service Professional
						<span className="Register-Arrow">🡺</span>
					</button>
				</div>
				<form onSubmit={customClick}>
					<div className={page === 1 ? null : "Register-Page-Offscreen"}>
						<div>
							<label htmlFor="firstName">First Name</label>
							<input
								id="firstName"
								type="text"
								placeholder="John"
								required={page === 1}
							/>
						</div>
						<div>
							<label htmlFor="lastName">Last Name</label>
							<input
								id="lastName"
								type="text"
								placeholder="Doe"
								required={page === 1}
							/>
						</div>
						<div>
							<label htmlFor="email">Email</label>
							<input
								id="email"
								type="email"
								placeholder="jdoe@gmail.com"
								required={page === 1}
								autoComplete="username"
							/>
						</div>
						<div>
							<label htmlFor="password">Password</label>
							<input
								id="password"
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
								<input
									id="Register-CardNumber"
									type="tel"
									pattern="[-\d]{19}"
									maxLength="19"
									placeholder="xxxx-xxxx-xxxx-xxxx"
									onInput={formatCreditCard}
									required={page === 2}
								/>
								<div className="Register-CardSecrets">
									<input
										id="Register-CardDate"
										type="tel"
										pattern="[\/\d]{5}"
										maxLength="5"
										placeholder="04/20"
										onInput={formatDate}
										required={page === 2}
									/>
									<input
										id="Register-CardSecret"
										type="tel"
										pattern="[\d]{3}"
										maxLength="3"
										placeholder="123"
										onInput={formatSecret}
										required={page === 2}
									/>
								</div>
							</div>
						</div>
					</div>
					<div className={page === 3 ? null : "Register-Page-Offscreen"}>
						<div className="Register-Captcha" onMouseDown={toggleForm}>
							<div className={
								state === "spinning" ?
								"Register-Captcha-Spinner" : (
									state === "ticked" ?
									"Register-Captcha-Ticked" :
									"Register-Captcha-Checkbox"
								)
							}/>
							<span>I'm a robot</span>
							<img src={recaptcha} className="Register-Captcha-Icon" alt="captcha" />
						</div>
						{
							testVisible ?
							<div className="Register-Test">
								<div className="Register-Test-Header">Select all squares with good teaching practice.</div>
								<table id="Register-Test-Table">
									<tbody>
										<tr>
											<td><img src={square0} id="Register-Square0" alt="square0" onMouseDown={clickSquare} /></td>
											<td><img src={square1} id="Register-Square1" alt="square1" onMouseDown={clickSquare} /></td>
											<td><img src={square2} id="Register-Square2" alt="square2" onMouseDown={clickSquare} /></td>
										</tr>
										<tr>
											<td><img src={square3} id="Register-Square3" alt="square3" onMouseDown={clickSquare} /></td>
											<td><img src={square4} id="Register-Square4" alt="square4" onMouseDown={clickSquare} /></td>
											<td><img src={square5} id="Register-Square5" alt="square5" onMouseDown={clickSquare} /></td>
										</tr>
										<tr>
											<td><img src={square6} id="Register-Square6" alt="square6" onMouseDown={clickSquare} /></td>
											<td><img src={square7} id="Register-Square7" alt="square7" onMouseDown={clickSquare} /></td>
											<td><img src={square8} id="Register-Square8" alt="square8" onMouseDown={clickSquare} /></td>
										</tr>
									</tbody>
								</table>
								<button className="Register-Test-Verify" onMouseDown={tickForm}>Verify</button>
							</div>
							: null
						}
					</div>
					{
						(page >= 1 && page <= 2) ?
						<button className="Register-NextButton" type="submit">Next</button>
						: null
					}
				</form>
			</div>
		</div>
	);
}

export default RegisterTest;
