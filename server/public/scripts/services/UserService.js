app.factory('UserService', function($http, $location){
    console.log('UserService Loaded');
  
    let userObject = {};
  
    return {
      userObject : userObject,
  
      getuser : function(){
        console.log('UserService -- getuser');
        $http.get('/user').then(function(response) {
            if(response.data.username) {
                // user has a current session on the server
                userObject.userName = response.data.username;
                userObject.id = response.data._id;
                userObject.date = response.data.date;
                userObject.location = response.data.location;
                userObject.about = response.data.about;
                userObject.profileImage = response.data.profileImage;
                console.log('UserService -- getuser -- User Data: ', userObject.username, userObject.id);
            } else {
                console.log('UserService -- getuser -- failure');
                // user has no session, bounce them back to the login page
                $location.path("/home");
            }
        },function(response){
          console.log('UserService -- getuser -- failure: ', response);
          $location.path("/home");
        });
      },
  
      logout : function() {
        console.log('UserService -- logout');
        $http.get('/user/logout').then(function(response) {
          console.log('UserService -- logout -- logged out');
          $location.path("/home");
          userObject.userName = '';
        });
      }
    };
  });