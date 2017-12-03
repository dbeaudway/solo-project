app.controller('LoginController', function($http, $location, UserService) {
    var self = this;
    self.userObject = UserService.userObject;
    self.user = {
      username: '',
      password: ''
    };
    self.message = '';
    self.register = false;
    
    self.registerClick = function(){
      self.register = !self.register;
    }

    self.logout = function(){
      UserService.logout();
    }

    self.login = function() {
      if(self.user.username === '' || self.user.password === '') {
        self.message = "Enter your username and password!";
      } else {
        $http.post('/', self.user).then(function(response) {
          if(response.data.username) {
            // location works with SPA (ng-route)
            $location.path('/profile');
          } else {
            console.log('LoginController -- login -- failure: ', response);
            self.message = "Your credentials didn't match our records, please try again.";
          }
        },function(response){
          console.log('LoginController -- registerUser -- failure: ', response);
          self.message = "Your credentials didn't match our records, please try again.";
        });
      }
    };

    self.registerUser = function() {
      if(self.user.username === '' || self.user.password === '') {
        self.message = "Choose a username and password!";
      } else {
        $http.post('/register', self.user).then(function(response) {
          $location.path('/home');
        },
        function(response) {
          console.log('LoginController -- registerUser -- error');
          self.message = "Please try again."
        });
      }
    }
});
