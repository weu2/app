
const httpsport = process.env.HTTPSPORT || 5000;
const httpport = process.env.HTTPPORT || 5001;
const key = process.env.TLSKEY || './misc/tls/local.key';
const cert = process.env.TLSCERT || './misc/tls/local.pem';
try {
    const fs = require('fs');
    const https = require('https');
    const key = fs.readFileSync(key);
    const cert = fs.readFileSync(cert);
    const options = {
        key: key,
        cert: cert
    };
    const app = require('./app.js');
    const secureserver = https.createServer(options, app)
    secureserver.listen(port, () => console.log(`HTTPS server started, listening on port ${httpsport}`));

    console.error('TLS certificate not present');
    console.log(e)
    const http = require('http');
    const httpServer = require('./httpServer.js');
    const notsecureserver = http.createServer(httpServer)
    notsecureserver.listen(port, () => console.log(`Listening on port ${httpport}`));

} catch(e) {
    console.log(e);
} 
