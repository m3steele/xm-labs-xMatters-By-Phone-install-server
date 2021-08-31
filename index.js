//Load HTTP module
const express = require('express');
const app = express();
const port = process.env.port || 8000;

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/installfunctions', function (req, res) {
  res.send('Installing Twilio Function Versions');
});

//listen for request on port 3000, and as a callback function have the port listened on logged
app.listen(port, () => {
  console.log(`App listening on ${port}`);
});
