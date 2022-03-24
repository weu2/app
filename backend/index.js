const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000


app.use(cors());

app.get('/api/v1/test', (req, res) => {
  res.send({ message : "Backend is responding" });
});

// serve the static files for the react app
app.use(express.static(path.resolve(__dirname, '../client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
});

app.listen(port, () => console.log(`Listening on port ${port}`));