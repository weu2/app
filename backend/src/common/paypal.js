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

            }).then(res => res.json()).then(data => {
                res(data.client_token);
            });
        });
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
        }).then(res => res.json()).then(data => {
            res(data.access_token);
        });
    });
}

// create an order
function createOrder(amount) {
    return new Promise((res, rej) => {
        generateAccessToken().then(accessToken => {
            const url = `${base}/v2/checkout/orders`;
            fetch(url, {
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
            }).then(res => res.json()).then(data => {
                res(data);
            });
        });
    });
}

function capturePayment(orderId) {
    return new Promise((res, rej) => {
        generateAccessToken().then(accessToken => {
            const url = `${base}/v2/checkout/orders/${orderId}/capture`;
            fetch(url, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            }).then(res => res.json()).then(data => {
                res(data);
            });
        });
    });
}

module.exports.generateClientToken = generateClientToken;
module.exports.createOrder = createOrder;
module.exports.capturePayment = capturePayment;
module.exports.clientId = CLIENT_ID;