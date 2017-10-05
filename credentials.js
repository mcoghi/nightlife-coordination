var mongoId = "nightlife"
  , mongopass = "nightlife";

module.exports = {
  
  // yelp API credentials
  yelp : {
    id : "l9Y4G7fNooS4q2jgt7mn6g",
    secret : "gQuZOytOp89VmwZLGuFzTThWL90cJtxqbKd5ohR0kSmj7tohzlUG4jxgsZpRPhv6"
  },
  
  // mongo db url
  mongo : {
    url : "mongodb://" + mongoId + ":" + mongopass + "@ds127864.mlab.com:27864/fccprojects"
  },
  
  // secret string for the cryptography
  secret : "this-is-a-secret"
}