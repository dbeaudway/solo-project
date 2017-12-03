app.factory('UserService', function($http, $location){
  
    let userObject = {};
    checkUser();
    // Does a soft check without redirect.
    // Used when the service is created.
    function checkUser() {
      $http.get('/user').then(function(response) {
        if(response.data.username) {
            // user has a current session on the server
            userObject.userName = response.data.username;
            userObject.id = response.data._id;
            userObject.date = response.data.date;
            userObject.location = response.data.location;
            userObject.about = response.data.about;
            userObject.profileImage = response.data.profileImage;
        }
      });
    }

    function getUser(){
        $http.get('/user').then(function(response) {
            if(response.data.username) {
                // user has a current session on the server
                userObject.userName = response.data.username;
                userObject.id = response.data._id;
                userObject.date = response.data.date;
                userObject.location = response.data.location;
                userObject.about = response.data.about;
                userObject.profileImage = response.data.profileImage;
            } else {
                console.log('UserService -- getuser -- failure');
                // user has no session, bounce them back to the login page
                $location.path("/home");
            }
        },function(response){
          console.log('UserService -- getuser -- failure: ', response);
          $location.path("/home");
        });
    };
    return {
      userObject : userObject,
  
      getuser : getUser,
  
      logout : function() {
        $http.get('/user/logout').then(function(response) {
          $location.path("/home");
          userObject.userName = '';
        });
      }
    };
  });