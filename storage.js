'use strict'

var mongo = require('mongodb').MongoClient
  , config = require('./credentials.js');

///////////////////////
// search for a user //
///////////////////////

function findUser(query, callBack){

  mongo.connect(config.mongo.url, function(err, db){
    
    if (err) throw err;
    
    var users = db.collection("users");
    users.find(query).toArray(function(err, documents){
      
      if (err) {
        
        // if the search went wrong, pass the error to the call back
        callBack(err, null);
        
      } else if (documents.length == 0){
        
        // if the search didn't produce any result, tell the callback
        callBack(null, null);
        
      } else {
      
        // if there is at least one result pass the first one
        callBack(null, documents[0]);
      
      }
      
      db.close()
    });
  });
}

///////////////////
// save new user //
///////////////////

function saveUser(query, callBack){
  
  // open the database
  mongo.connect(config.mongo.url, function(err, db){
    
    // open the collection
    var users = db.collection("users");
    
    // insert the new user
    users.insert(query, function(err, data){
      
      // if there is an error during insertion, pass it to the call back
      if (err){ 
        
        callBack(err)
        
      } else {
        
        // if there are no errors, call the callback
        console.log("there's a new user!");
      
        callBack(null);
      }
      
      db.close();
    })
  })
}

//////////////////////
// update user info //
//////////////////////

function updateUser(query, callBack){
  /*
  The query takes the form
  {
    user : <user name>,
    field : <field to update>,
    value : <new value>
  }
  */
  
  mongo.connect(config.mongo.url, function(err, db){
    
    console.log(query)
    // check for errors
    if (err) throw err;
    
    var users = db.collection('users');
    
    // add new place
    if (query.field == "add-place"){
      users.update(
        { username : query.user},
        {
          $push : { places : query.value}
        }
      )
    }
    
    // remove place
    if (query.field == "remove-place"){
      users.update(
        { username : query.user},
        {
          $pull : { places : query.value}
        }
      ) 
    }
    
    // change location
    if (query.field == "location"){
      users.update(
        { username : query.user},
        {
          $set : { location : query.value}
        }
      )
    }

    db.close();
  })
}

///////////////////
// search places //
///////////////////

function searchPlace(query, callBack){
  
  /*
    query must be of the form { place : <place id>}
  */
  
  mongo.connect(config.mongo.url, function(err, db){
    
    if (err) throw err;
    
    // search for all the users that want to go to a place
    db.collection("users").find(
      { places :  query.place }
    ).toArray(function(err, documents){
      
      if (err) throw err;
      
      callBack(documents);
      
      db.close();
    })
  })
}


module.exports = {
  findUser : findUser,
  saveUser : saveUser,
  updateUser : updateUser,
  searchPlace : searchPlace
}