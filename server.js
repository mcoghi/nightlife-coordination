// init project
var express = require('express');
var app = express()

// init body parser
var bodyParser = require('body-parser')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// init passport
var passport = require('passport')
  , accounts = require('./account-manager.js')(app, passport)// set up the account managment

// init routes
var router = require("./routes.js")(passport);

app.use(express.static('public'));
app.use(router);

// init yelp
var yelp = require('./yelp.js');

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
