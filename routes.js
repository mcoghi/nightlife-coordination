'use strict'

var express = require('express')
  , router = express.Router();

// check if the user is authenticated
var isAuthenticated = function (req, res, next) {
  
  if (req.isAuthenticated()){
    
    return next();
  }
  console.log('User not authenticated, redirecting to log-in')
  res.redirect('/');
}

module.exports = function(passport){
  
  // HOME PAGE // pass it only if user is authenticated
  router.get('/', function(req, res){
    res.sendFile("views/index.html", {'root': '../app/'});
  });
  
  // SIGN UP REQUEST //
  router.post("/signup", passport.authenticate("signup", {
    successRedirect : "/",
    failurRedirect : "/"
  }))
  
  // LOG IN //
  router.post("/login", passport.authenticate("login", { 
    successRedirect : "/",
    failureRedirect : "/",
  }));
 
  // LOG OUT //
  router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
  })
  
  // USER DATA REQUEST //
  router.get("/user", function(req, res){
    res.send(req.user);
  })
  
  // SEARCH YELP //
  var yelp = require("./yelp.js");
  // connect to database
  var db = require("./storage.js");
  
  router.get("/search", function(req, res){
    
    yelp.searchYelp(req.query, function(data){
      
      if (data.length > 0){
        
        //update the user info with req.query.location
        db.updateUser({
          user : req.user.username,
          field : "location",
          value : req.query.location
        })
        
        res.redirect("/")
      } else {
        
        //tell the client it was a bad request
        res.send("your request did not produce any result")
      }

    })
    
    console.log(req.query)
  })
  

  // get data from yelp
  router.get("/data", function (req, res){
    
    if (req.user){
      
      // if the user is authenticated produce the list of the last search
      yelp.searchYelp({ location: req.user.location }, function (data){
        res.send(data)
      })
            
    } else {
      
      // if the user is not authenticated no list is displayed
      res.send([])
    }
  })  
  
  // USER GOES TO PLACE
  router.get("/add-place", function(req, res){

    db.updateUser({
      user : req.user.username,
      field : "add-place",
      value : req.query.placeId
    })
    
    res.send("/");
  })
  
  // USER DOESN'T WANT TO GO ANYMORE
  router.get("/remove-place", function(req, res){

    db.updateUser({
      user : req.user.username,
      field : "remove-place",
      value : req.query.placeId
    })
    
    res.send("/");
  })
  
  // RETRIEVE NUMBER OF INTERESTED PEOPLE
  router.get("/count", function (req, res){
    
    if (req.user) {
      //if user is authenticated ask db for the count
      db.searchPlace({ place : req.query.placeId }, function(documents){  
        res.send({number : documents.length});
      })
      
    } else {
      // if the user is not authenticated no result is produced
      res.send("please log in to get the data");
      
    }
  })
  
  return router;
  
}