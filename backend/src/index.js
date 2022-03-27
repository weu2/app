const express = require("express");
const app = express();

// please try keep this as clean as possible

const cors = require("cors");
app.use(cors());

const v1 = require('./v1/api');
app.use('/api/v1', v1);

// serve the static files for the react app
const path = require("path");
app.use(express.static(path.resolve(__dirname, "../frontend/build")));
app.get("*", (req, res) => {
	res.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
