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

const files = require('./static');
app.use('/', files);

module.exports = app;