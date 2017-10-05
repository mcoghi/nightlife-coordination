// init cryptography
var bcrypt = require("bcrypt-nodejs");

// init db actions
var config = require('./credentials.js')
  , db = require('./storage.js');

// init sessions
var session = require('express-session')
  , MongoStore = require('connect-mongo')(session);

// init local strategy
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(app, passport){

  console.log('setting up accounts')
  
  // set up sessions
  app.use(session({
    store: new MongoStore({
      url : config.mongo.url
    }),
    secret: config.secret,
    resave: true,
    saveUninitialized: true
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  // serialize user
  passport.serializeUser(function(user, done) {
    done(null, user.username);
  });

  // deserialize user
  passport.deserializeUser(function(username, done) {
    db.findUser({username: username}, function(err, user) {
      done(err, user);
    });
  });
  
  ////////////////////
  // LOGIN strategy //
  ////////////////////
  
  console.log('login')
  passport.use("login", new LocalStrategy(

  function(username, password, done) {
      
    console.log('connecting')
    
    db.findUser({ username: username }, function (err, user) {
      
      // error in the request
      if (err) { 
        console.log("Error while searching the database: " + err);
        return done(err); 
      }
      
      // username not fuound
      if (!user) {
        console.log("The username doesn't exists")
        return done(null, false, { message: "wrong username"});
      }
      
      // hash the password before comparing it
      bcrypt.compare(password, user.password, function(err, res){
             
        if (err){
          console.log("Failed to hash: " + err);
          return done(null, false, { message: "error while hashing"});
        }
        // incorrect password
        if (!res) {
          console.log("Password is wrong")
          return done(null, false, { message: "wrong password"});
        }
        console.log("correct username and password");
        return done(null, user);
      });// end bcrypt
    });// end findUser
  }));// end log In strategy

  ///////////////////////
  // REGISTER strategy //
  ///////////////////////
  
  console.log('register')
  
  passport.use('signup', new LocalStrategy(
    function(username, password, done) {
    
      // crypt the password
      bcrypt.hash(password, null, null, function(err, hashPassword){
      
        if (err){
          console.log('Error in Hashing: ' + err);
          return done(err);
        }
      
        // find a user in Mongo with provided username
        db.findUser({'username': username}, function(err, user) {
        
          // In case of any error return
          if (err){
            console.log('Error in SignUp: ' + err);
            return done(err);
          }
      
          // already exists
          if (user) {
        
            console.log('User already exists');
            return done(null, false, {message : 'User Already Exists'});
        
          } else {
            // if there is no user with that name
            // create the user
            var newUser = {
              // set the user's local credentials
              username : username,
              password : hashPassword
            }
            // save the user
            db.saveUser(newUser, function(err){
          
              if (err){
                console.lgo("Error in SignUp: " + err);
                return done(err);
              }
          
              return done(null, newUser);
            });// end saveUser
          }// end if/else
        });// end findUser
      });//end bycrypt
    }));// end register strategy
}