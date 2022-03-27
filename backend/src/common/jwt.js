const crypto = require('crypto')    
const base64url = require('base64url')

function objectToBase64URL(obj) {
    return base64url(Buffer.from(JSON.stringify(obj), 'utf-8'));
}

function makeSignature(encodedHeader, encodedPayload, secret) {
    const data = `${encodedHeader}.${encodedPayload}`;
    return base64url.fromBase64(crypto.createHmac('sha256', secret).update(data).digest('base64'));
}

module.exports.createJWT = function(payload, secret = 'yesverygoodsecret') {
    const header = {
        typ:'jwt',
        alg:'HS256'
    };
    const encodedHeader = objectToBase64URL(header);
    const encodedPayload = objectToBase64URL(payload);
    const encodedSignature = makeSignature(encodedHeader, encodedPayload, secret);
    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

function verifyInternalHeader(header) {
    return header.typ === 'jwt' && header.alg === 'HS256';
}

module.exports.verifyJWT = function(jwt) {
    const sections = jwt.split('.');
    const header = JSON.parse(base64url.decode(sections[0]));
    const payload = JSON.parse(base64url.decode(sections[1]));
    const signature = sections[2];

    if(!verifyInternalHeader(header)) return false;

    // reconstruct jwt internally to get signature
    // and compare it to the signature given to us
    return this.createJWT(payload).split('.')[2].localeCompare(signature) == 0;
}

// WARNING: this function does not verify the jwt singature you must verify
module.exports.extractPayload = function(jwt) {
    return JSON.parse(base64url.decode(jwt.split('.')[1]));
}