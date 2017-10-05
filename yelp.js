'use strict';

var yelp = require('yelp-fusion')
  , config = require('./credentials.js');


function searchYelp(searchRequest, callBack){

  var yelpCall = yelp.accessToken(config.yelp.id, config.yelp.secret);
  
  yelpCall.then(response => {
    const client = yelp.client(response.jsonBody.access_token);

    client.search(searchRequest).then(response => {
      const results = response.jsonBody.businesses;
      const prettyJson = JSON.stringify(results);
      console.log(results[0]);
      callBack(results);
    }).catch(e => {
      console.log("Error in yelp search: " + e);
      callBack([]);
    })
  });
  
  yelpCall.catch(e => {
    console.log("Error in connecting with yelp: " + e);
    callBack([]);
  });
   
}


// export useful stuff

module.exports = {
  searchYelp : searchYelp
}