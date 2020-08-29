var express = require('express');
var googlemodule = require('./googleAuthentication')

var app = express();
app.listen(9000, (result) => console.log("App running in http://localhost:9000"));

var googleURL = googlemodule.GetGoogleConnectionURL();

//Home page of our site
app.get('/', (req, res) => {
  res.send(`<a href=${googleURL}>Login with google</a>`);
})

//Call back route from google once signing successful
app.get('/gauth', function (req, res) {

  var code = req.query.code; //code is sent from google signin 

  if (code) { //validate code with google, user may directly access this page with or without valid code directly
    googlemodule.GetUserDetailsFromGoogle(code, (err, userData) => {
      if (err) {
        console.log('Error authenticating');
        console.log(err);
        res.send(`Unable to get logged in user info. </br> <a href=${googleURL}>Login with google</a>`);
      }
      else if (userData) {
        console.log('Successfully authenticated');

        res.send("Welcome " + userData.displayName + "</br>You signed in with google email: " + userData.emailAddress);
      }
      else {
        res.send("Unable to get logged in user info");
      }
    });
  }
  else {
    res.redirect('/');
  }
})


