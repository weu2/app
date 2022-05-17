const fetch = require('node-fetch');

// base URL will need to change for production applications
const base = "https://api-m.sandbox.paypal.com";

//const { CLIENT_ID, APP_SECRET } = process.env; // pull from environment variables
const CLIENT_ID = "ARQf06TlEPtCBphO-MGSVagFYq1Ope-Iha8U4Gw2bC33qphW3AafXdU3Wjll1RfnCJtingVcyVtr7yRx";
const APP_SECRET = "EBshTYH9p7Zm_toVALQBtdQbcahYAzNAcFtQRPLwOmawcZ9i1Jdwo95o2-qqSiZG5mxXzvWDD85LPZ1I";

// call this function to create your client token
function generateClientToken() {
	return new Promise((res, rej) => {
		generateAccessToken().then(accessToken => {
			fetch(`${base}/v1/identity/generate-token`, {
				method: "post",
				headers: {
				Authorization: `Bearer ${accessToken}`,
					"Accept-Language": "en_US",
					"Content-Type": "application/json",
				},
			}).then(data => data.json()).then(data => {
				res(data.client_token);
			}).catch(rej);
		}).catch(rej);
	});
}

// access token is used to authenticate all REST API requests
function generateAccessToken() {
	return new Promise((res, rej) => {
		const auth = Buffer.from(CLIENT_ID + ":" + APP_SECRET).toString("base64");
		fetch(`${base}/v1/oauth2/token`, {
			method: "post",
			body: "grant_type=client_credentials",
			headers: {
				Authorization: `Basic ${auth}`,
			},
		}).then(data => data.json()).then(data => {
			res(data.access_token);
		}).catch(rej);
	});
}

// create an order
function createOrder(amount) {
	return new Promise((res, rej) => {
		generateAccessToken().then(accessToken => {
			fetch(`${base}/v2/checkout/orders`, {
				method: "post",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify({
					intent: "CAPTURE",
					purchase_units: [{
						amount: {
							currency_code: "AUD",
							value: amount
						},
					}],
				}),
			}).then(data => data.json()).then(res).catch(rej);
		}).catch(rej);
	});
}

function capturePayment(orderId) {
	return new Promise((res, rej) => {
		generateAccessToken().then(accessToken => {
			fetch(`${base}/v2/checkout/orders/${orderId}/capture`, {
				method: "post",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
			}).then(data => data.json()).then(data => {
				res(data);
			}).catch(rej);
		}).catch(rej);
	});
}

// called from createPlan()
function createProduct() {
	return new Promise((res, rej) => {
		generateAccessToken().then(accessToken => {
			fetch(`${base}/v1/catalogs/products`, {
				method: "post",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify({
					name: "WeU Subscription",
					description: "Recurring membership to WeU",
					type: "SERVICE",
					category: "AUTO_SERVICE"
				}),
			}).then(data => data.json()).then(data => {
				res(data.id);
			}).catch(rej);
		}).catch(rej);
	});
}

// only call this once
function createPlan() {
	return new Promise((res, rej) => {
		generateAccessToken().then(accessToken => {
			createProduct().then(productId => {
				fetch(`${base}/v1/billing/plans`, {
					method: "post",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
					body: JSON.stringify({
						product_id: productId,
						name: "WeU Subscription",
						description: "Recurring membership to WeU",
						billing_cycles: [
							{
								frequency: {
									interval_unit: "MONTH",
									interval_count: 1
								},
								tenure_type: "REGULAR",
								sequence: 1,
								total_cycles: 12,
								pricing_scheme: {
									fixed_price: {
										value: "80",
										currency_code: "AUD"
									}
								}
							}
						],
						payment_preferences: {
							auto_bill_outstanding: true,
							setup_fee: {
								value: "80",
								currency_code: "AUD"
							},
							setup_fee_failure_action: "CONTINUE",
							payment_failure_threshold: 3
						}
					}),
				}).then(data => data.json()).then(data => {
					res(data.id);
				}).catch(rej);
			}).catch(rej);
		}).catch(rej);
	});
}

module.exports.generateClientToken = generateClientToken;
module.exports.createOrder = createOrder;
module.exports.capturePayment = capturePayment;
module.exports.clientId = CLIENT_ID;