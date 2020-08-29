var google = require('googleapis')
var express = require('express');

var app = express();
app.listen(9000, (result) => console.log("App running in http://localhost:9000"));

const googleConfig = {
  clientId: '393218070159-r719p3j2tcckl3bj3a361mfnsml2e4cb.apps.googleusercontent.com', // e.g. abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
  clientSecret: 'BIIyDJZJzj1Vqvt-JRedTcb5', // e.g. ABcdeFGHijKLMno-aBCDefg1
  redirect: 'http://localhost:9000/gauth' // this must be same redirect url provided in the google api settings
};

/**
 * Create google OAuth2Client to get access google apis
 */
function createConnection() {
  return new google.Auth.OAuth2Client(
    googleConfig.clientId,
    googleConfig.clientSecret,
    googleConfig.redirect
  );
}

/**
 * This scope tells google what information we want to request.
 */
const defaultScope = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
];

/**
 * Gets the url which will be used in our application, clicking this url will open the google sign-in page and request access to the scope provided (such as name, email, etc).
 */
function getConnectionUrl(auth) {
  return auth.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: defaultScope
  });
}

/**
 * Gets the google signin url.
 */
function getGoogleURL() {
  var auth = createConnection();
  var url = getConnectionUrl(auth);
  return url;
}

var googleURL = getGoogleURL();

function GetUserDetailsFromGoogle(code, callback) {
  var oAuth2Client = createConnection();

  // Get an access token based on our OAuth code
  oAuth2Client.getToken(code, (err, tokens) => {
    if (err) {
      callback(err, null);
    }
    else {
      oAuth2Client.setCredentials(tokens);
      var people = (new google.people_v1.People({ auth: oAuth2Client }).people);
      var mePromise = people.get({ resourceName: 'people/me', personFields: 'names,emailAddresses' });
      mePromise.then(me => {

        var userData = {
          displayName: me.data.names[0].displayName,
          emailAddress: me.data.emailAddresses[0].value
        }

        callback(null, userData);
      }
      );
    }
  });
}

//Home page of our site
app.get('/', (req, res) => {
  res.send(`<a href=${googleURL}>Login with google</a>`);
})

//Call back route from google once signing successful
app.get('/gauth', function (req, res) {

  var code = req.query.code; //code is sent from google signin 

  if (code) { //validate code with google, user may directly access this page with or without valid code directly
    GetUserDetailsFromGoogle(code, (err, userData) => {
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


