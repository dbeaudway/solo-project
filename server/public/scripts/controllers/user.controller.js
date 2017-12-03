app.controller('UserController', function ($http, UserService) {
  var self = this;
  self.userObject = UserService.userObject;
  self.user = '';
  self.userName = location.hash.split('/')[2]; //THIS NEEDS TO BE UPDATED, NOT A SUSTAINABLE SOLUTION

  self.getUser = function () {
    $http.get('/user/' + self.userName).then(function (response) {
      self.user = response.data;
    }).catch(function (error) {
      console.log(error);
    })
  }
  self.getUser();

});