const path = require("path");
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000
const os = require('os');

app.use(cors());

app.get("/api/v1/test", (req, res) => {
	res.send({ message: "Backend is responding" });
});

let ip;
const interfaces = os.networkInterfaces();
for (const i in interfaces) {
	ip = interfaces[i].find(interface => interface.family === "IPv4" && !interface.internal);
	if (ip) break;
}

app.get("/api/v1/ip", (req, res) => {
	res.send({ ip: ip?.address });
});

// serve the static files for the react app
app.use(express.static(path.resolve(__dirname, "../frontend/build")));
app.get("*", (req, res) => {
	res.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"));
});

app.listen(port, () => console.log(`Listening on port ${port}`));
