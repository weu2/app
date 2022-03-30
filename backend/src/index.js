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
    const key = fs.readFileSync('./certs/selfsigned.pem');
    const cert = fs.readFileSync('./certs/selfsigned.cert');
    const options = {
        key: key,
        cert: cert
    };
    const server = https.createServer(options, app)
    server.listen(port, () => console.log(`Listening on port ${port}`));
} catch(e) {
    console.error('Please either run the build command to generate tls certificate or install them to the correct directory');
    console.error('If you are hosting the server locally for development you can ignore this.');
    console.error('Starting http server...');
    const http = require('http');
    const server = http.createServer(app)
    server.listen(port, () => console.log(`Listening on port ${port}`));
}


