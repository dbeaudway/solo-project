app.controller('LoginController', function($http, $location, UserService) {
    console.log('LoginController created');
    var self = this;
    self.userObject = UserService.userObject;
    self.user = {
      username: '',
      password: ''
    };
    self.message = '';
    self.register = false;
    
    self.registerClick = function(){
      console.log('fired');
      self.register = !self.register;
    }

    self.logout = function(){
      UserService.logout();
    }

    self.login = function() {
      console.log('LoginController -- login');
      if(self.user.username === '' || self.user.password === '') {
        self.message = "Enter your username and password!";
      } else {
        console.log('LoginController -- login -- sending to server...', self.user);
        $http.post('/', self.user).then(function(response) {
          if(response.data.username) {
            console.log('LoginController -- login -- success: ', response.data);
            // location works with SPA (ng-route)
            $location.path('/home');
          } else {
            console.log('LoginController -- login -- failure: ', response);
            self.message = "Wrong!!";
          }
        },function(response){
          console.log('LoginController -- registerUser -- failure: ', response);
          self.message = "Wrong!!";
        });
      }
    };

    self.registerUser = function() {
      console.log('LoginController -- registerUser');
      if(self.user.username === '' || self.user.password === '') {
        self.message = "Choose a username and password!";
      } else {
        console.log('LoginController -- registerUser -- sending to server...', self.user);
        $http.post('/register', self.user).then(function(response) {
          console.log('LoginController -- registerUser -- success');
          $location.path('/home');
        },
        function(response) {
          console.log('LoginController -- registerUser -- error');
          self.message = "Please try again."
        });
      }
    }
});
