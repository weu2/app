const express = require('express');
const app = express();

// please try keep this as clean as possible

app.use(express.json());

const cors = require('cors');
app.use(cors());

const v1 = require('./v1/api');
app.use('/api/v1', v1);

const static = require('./static');
app.use('/', static);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
