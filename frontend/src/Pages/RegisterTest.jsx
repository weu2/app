import React from "react";
import "./RegisterTest.css";

function formatCreditCard(e) {
	var cardNumber = e.target.value;
	var formattedCardNumber = cardNumber.replace(/[^\d]/g, "");
	formattedCardNumber = formattedCardNumber.substring(0, 16);
	var cardNumberSections = formattedCardNumber.match(/\d{1,4}/g);
	if (cardNumberSections !== null) {
		formattedCardNumber = cardNumberSections.join('-'); 
	}
	if (cardNumber !== formattedCardNumber) {
		e.target.value = formattedCardNumber;
	}
}

function RegisterTest() {
	const [page, setPage] = React.useState(0);

	return (
		<div className="RegisterTest">
			<div className="Content">
				<h1>Registration Test</h1>
				{	
					page > 0 ?
					<button className="BackButton" onClick={() => setPage(page - 1)}>🡸 Back</button>
					: null
				}
				<div className={page === 0 ? "Slider" : "Slider Slider-Offscreen"}>
					<h2>I am a...</h2>
					<button onClick={() => setPage(1)} className="CategoryButton">
						Customer
						<span className="Arrow">🡺</span>
					</button>
					<button onClick={() => setPage(1)} className="CategoryButton">
						Service Professional
						<span className="Arrow">🡺</span>
					</button>
				</div>
				<div className={page === 1 ? "Slider" : "Slider Slider-Offscreen"}>
					<div>
						<label htmlFor="firstName">First Name</label>
						<input id="firstName" type="text" placeholder="John" required={true} />
					</div>
					<div>
						<label htmlFor="lastName">Last Name</label>
						<input id="lastName" type="text" placeholder="Doe" required={true} />
					</div>
					<div>
						<label htmlFor="email">Email</label>
						<input id="email" type="email" placeholder="jdoe@gmail.com" required={true} />
					</div>
					<div>
						<label htmlFor="password">Password</label>
						<input id="password" type="password" required={true} />
					</div>
				</div>
				<div className={page === 2 ? "Slider" : "Slider Slider-Offscreen"}>
					<label htmlFor="creditCard">Mother's credit card number</label>
					<div className="CreditCard">
						<div className="CreditCardStrip" />
						<input
							id="creditCard"
							type="tel"
							pattern="\d*"
							maxLength="19"
							placeholder="xxxx-xxxx-xxxx-xxxx"
							onInput={formatCreditCard}
						/>
					</div>
				</div>
				{
					page > 0 ?
					<button className="FormButton" onClick={() => setPage(page + 1)}>Next</button>
					: null
				}
			</div>
		</div>
	);
}

export default RegisterTest;
