//Load HTTP module
const express = require('express');
const FormData = require('form-data');
const axios = require('axios');
const rateLimit = require('axios-rate-limit');
var fs = require('fs');

const app = express();
const port = process.env.PORT || 8000;

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// parse application/json
app.use(express.json());

app.post('/installfunctions', async function (req, res) {
  res.send('Installing Twilio Function Versions now');
  console.log(JSON.stringify(req.body, null, 2));
  var request = req.body;

  var functionNames = request.twilioFunctionstoDeploy.split(',');

  // Get Script from xMatters by phone v2 repo
  //api.github.com/repos/m3steele/xm-labs-xMatters-By-Phone-v2/contents/TwilioFunctions/xm_confirmRec.js

  // Create new Twilio Function Version
  for (var fun in functionNames) {
    fs.writeFileSync('/functions/' + functionNames[fun] + '.js', response.data);

    var data = new FormData();

    data.append('Content', fs.createReadStream('/functions/' + functionNames[fun] + '.js'));
    //  data.append('Content', response.data);
    //form.append('type', 'application/javascript');
    data.append('Path', fun);
    data.append('Visibility', 'public');

    var config = {
      method: 'post',
      url:
        'https://serverless-upload.twilio.com/v1/Services/' +
        request.twilioServiceSid +
        '/Functions/' +
        request.twilioFunctionSids[functionNames[fun]] +
        '/Versions',
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${request.twilioUser}:${request.twilioPassword}`, 'utf8').toString('base64'),
        ...data.getHeaders(),
      },
      data: data,
    };
    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  } // conse for each
});

function getTwilFunctions() {
  //var functionNames = ['xm_settings', 'xm_action', 'xm_group', 'xm_record', 'xm_livecall', 'xm_escalate', 'xm_confirmRec', 'xm_shorten', 'xm_message'];

  var functionNames = ['xm_settings'];

  for (var fun in functionNames) {
    var config = {
      method: 'get',
      url: 'https://api.github.com/repos/m3steele/xm-labs-xMatters-By-Phone-v2/contents/TwilioFunctions/' + functionNames[fun] + '.js',
      headers: {
        Accept: 'application/vnd.github.v3.raw',
      },
    };
    axios(config)
      .then(function (response) {
        fs.writeFileSync('/functions/' + functionNames[fun] + '.js', response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}

app.get('/', (req, res) => {
  res.send('Hello World');
});

//listen for request on port 3000, and as a callback function have the port listened on logged
app.listen(port, () => {
  console.log(`App listening on ${port}`);
});
