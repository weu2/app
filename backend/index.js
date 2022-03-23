const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000


app.use(cors());

app.get('/api/v1/thing', (req, res) => {
  res.send({ express: 'The backend works' });
});

app.listen(port, () => console.log(`Listening on port ${port}`));