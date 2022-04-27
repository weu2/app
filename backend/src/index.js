const express = require('express');
const app = express();

// please try keep this as clean as possible

app.use(express.json());

const cors = require('cors');
app.use(cors());

const cookieparser = require('cookie-parser');
app.use(cookieparser());

const v1 = require('./v1/api');
app.use('/api/v1', v1);

const static = require('./static');
app.use('/', static);

const port = process.env.PORT || 5000;

if(!process.env.PORT) {

}

try {
    const fs = require('fs');
    const https = require('https');
    const key = fs.readFileSync('./misc/tls/local.key');
    const cert = fs.readFileSync('./misc/tls/local.pem');
    const options = {
        key: key,
        cert: cert
    };
    const server = https.createServer(options, app)
    server.listen(port, () => console.log(`HTTPS server started, listening on port ${port}`));
} catch(e) {
    console.error('TLS certificate not present');
    // const http = require('http');
    // const server = http.createServer(app)
    // server.listen(port, () => console.log(`Listening on port ${port}`));
}


