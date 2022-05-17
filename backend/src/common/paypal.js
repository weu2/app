const fetch = require('node-fetch');

// base URL will need to change for production applications
const base = "https://api-m.sandbox.paypal.com";

//const { CLIENT_ID, APP_SECRET } = process.env; // pull from environment variables
const CLIENT_ID = "ARQf06TlEPtCBphO-MGSVagFYq1Ope-Iha8U4Gw2bC33qphW3AafXdU3Wjll1RfnCJtingVcyVtr7yRx";
const APP_SECRET = "EBshTYH9p7Zm_toVALQBtdQbcahYAzNAcFtQRPLwOmawcZ9i1Jdwo95o2-qqSiZG5mxXzvWDD85LPZ1I";
const PLAN = "P-5NL64788VY579522XMKBXB6Q";

// call this function to create your client token
function generateClientToken() {
	return new Promise((res, rej) => {
		generateAccessToken().then(accessToken => {
			fetch(`${base}/v1/identity/generate-token`, {
				method: "POST",
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
			method: "POST",
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
				method: "POST",
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
				method: "POST",
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

function createSubscription() {
	return new Promise((res, rej) => {
		generateAccessToken().then(accessToken => {
			fetch(`${base}/v1/billing/subscriptions`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify({
					plan_id: PLAN,
				}),
			}).then(response => {
				if (response.ok) {
					return response.json();
				} else {
					rej();
				}
			}).then(data => {
				res(data);
			}).catch(rej);
		}).catch(rej);
	});
}

function cancelSubscription(planId) {
	return new Promise((res, rej) => {
		generateAccessToken().then(accessToken => {
			fetch(`${base}/v1/billing/subscriptions/${planId}/cancel`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify({
					reason: "Customer cancelled WeU membership",
				}),
			}).then(res).catch(rej);
		}).catch(rej);
	});
}

module.exports.generateClientToken = generateClientToken;
module.exports.createOrder = createOrder;
module.exports.capturePayment = capturePayment;
module.exports.createSubscription = createSubscription;
module.exports.cancelSubscription = cancelSubscription;
module.exports.clientId = CLIENT_ID;

// For generating plan tokens, not required unless you need a new one

/*function createProduct() {
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
}*/