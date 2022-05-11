const uuid = require('uuid');
const JsonDB = require('../common/jsondb');

// Single payment for callout on demand
function onDemand(customerId, calloutId, price, cardHolder, cardNumber, cardExpMonth, cardExpYear, cardCVC, dateTime) {
	// pretend to validate card info here
	// don't store the CVC since it's sensitive info
	return new Promise((res, rej) => {
		const payments = new JsonDB('data/payments.json');
		const paymentUuid = uuid.v4();
		payments.add({
			uuid: paymentUuid,
			customerUuid: customerId,
			calloutUuid: calloutId,
			price: price,
			type: "ondemand",
			cardHolder: cardHolder,
			cardNumber: cardNumber,
			cardExpMonth: cardExpMonth,
			cardExpYear: cardExpYear,
			dateTime: dateTime
		});
		res();
	});
}

module.exports.onDemand = onDemand;