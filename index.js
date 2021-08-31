//Load HTTP module
const express = require('express');
const app = express();
const port = process.env.PORT || 8000;

var FormData = require('form-data');
var fs = require('fs');

app.post('/installfunctions', function (req, res) {
  res.send('Installing Twilio Function Versions now');

  // parse body
  var request = JSON.parse(req.body);
  console.log('reqxxxx ' + JSON.stringify(request));

  var form = new FormData();

  form.append('file', fs.createReadStream('/function.js'));

  form.submit(
    {
      host: 'https://serverless-upload.twilio.com',
      path: '/' + request.twilioService + '/Functions/' + request.twilioFunctionSids[0] + '/Versions',
      auth: request.twilioUser + ':' + request.twilioPassword,
    },
    function (err, res) {
      console.log(res.statusCode);

      res.send('Installed Twilio Function Version ' + equest.twilioFunctionSids[0] + ' ' + res.statusCode);
    }
  );
});

app.get('/', (req, res) => {
  res.send('Hello World');
});

//listen for request on port 3000, and as a callback function have the port listened on logged
app.listen(port, () => {
  console.log(`App listening on ${port}`);
});
