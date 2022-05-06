
const port = process.env.PORT || 5000;

try {
    const fs = require('fs');
    const https = require('https');
    const key = fs.readFileSync('./misc/tls/local.key');
    const cert = fs.readFileSync('./misc/tls/local.pem');
    const options = {
        key: key,
        cert: cert
    };
    const app = require('./app.js');
    const server = https.createServer(options, app)
    server.listen(port, () => console.log(`HTTPS server started, listening on port ${port}`));
} catch(e) {
    console.error('TLS certificate not present');
    console.log(e)
    // const http = require('http');
    // const server = http.createServer(app)
    // server.listen(port, () => console.log(`Listening on port ${port}`));
} 
