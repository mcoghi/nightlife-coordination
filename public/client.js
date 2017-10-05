// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html

$(document).ready(function(){
  
  // check if user is authenticated
  $.get("/user", function(user){
    if(user){
      // user is authenticated
      // hide log-in and sign-up
      $(".login-form").hide();
      $(".login-row").hide();
      $(".signup-form").hide();
      $(".signup-row").hide();
      $(".switch").hide();
      
      //show logout and search
      $(".logout-form").show();
      $(".search").show();
      $(".account-name").append(user.username);
      
      // if the user is authenticated, list the bars in his last search
      $.get("/data", function(data){
        
        // append place name
        if (user.location){
          $(".display-location").html("Check out what you can do tonight in " + user.location + ":")
        }
        listBars(data, user.places, x => null);
    
      })
      
    } else {
      //user is not authenticated
      $(".switch").show();
      $(".login-form").show();
      $(".login-row").show();
      $(".signup-form").hide();
      $(".signup-row").hide();
      $(".signup-switch").addClass("back");
      
      $(".logout-form").hide();
      $(".search").hide();
      
      // if the user is not authenticated, ask to log in before displaying the list of bars
      $(".bar-list").html("<div class='col col-12'><h3 class='display-location text-center'>Login to search for places in your area!</h3></div>")
      
      // activate the login-signup switches
      $(".login-switch").on("click", function(){
        $(".login-form").show();
        $(".login-row").show();
        $(".signup-form").hide();
        $(".signup-row").hide();
        $(this).removeClass("back");
        $(".signup-switch").addClass("back");
      });
      
      $(".signup-switch").on("click", function(){
        $(".signup-form").show();
        $(".signup-row").show();
        $(".login-form").hide();
        $(".login-row").hide();
        $(this).removeClass("back");
        $(".login-switch").addClass("back");        
      })
    }
  })
  
  // create list of places
  function listBars(data, userList, callBack){
    
    if (!userList) userList = [];

    data.map(function(d){
      
      var placeId = d.id
      
      var place = "<div id=" + placeId + " class='col-md-4 place-block'>" // add place id
                + "<img class='thumb-img' src='" + d.image_url + "'>" // add place image
                + "<a class='place-name' target='_blank' href='" + d.url + "'>" 
                + d.name + "</a>" // add place name and url
                + "<p class='categories'>" + d.categories[0].title + "</p>"
                + "<div class='count'></div>" // add a place holder the number of people interested in the place
      
      if (userList.indexOf(d.id) < 0){
        // if place is not in userList add the option to go there
        place += "<div class='go-place'>GO!</div>";
        
      } else {
        // if place is in userList add the option to not go there
        place += "<div class='remove-place'>NO GO</div>";
      }
      
      place += "</div>";
      
      $(".bar-list").append(place);
      
      $.get("/count?placeId=" + placeId, function(data){
        
        $("#" + placeId).children(".count").html(data.number);
        
      })
      
    })
    
    // activate the GO! button
    $(".go-place").on("click", function(){
              
      // get the selected place id and send it as a query
      var placeId = $(this).parent()[0].id;
      console.log(placeId)
    
      $.get("/add-place?placeId=" + placeId, function(){
        location.reload();
      })  
    })
    
    // activate the NO GO button
    $(".remove-place").on("click", function(){
        
      // get the selected place id and send it as a query
      var placeId = $(this).parent()[0].id;
      console.log(placeId)
    
      $.get("/remove-place?placeId=" + placeId, function(){
        location.reload();
      })  
    })
    
    callBack();
  }
  
})
