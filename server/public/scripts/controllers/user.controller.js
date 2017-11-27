app.controller('UserController', function ($http) {
  console.log('UserController created');
  var self = this;
  self.user = '';
  self.userName = location.hash.split('/')[2]; //THIS NEEDS TO BE UPDATED, NOT A SUSTAINABLE SOLUTION

  self.getUser = function () {
    $http.get('/user/' + self.userName).then(function (response) {
      console.log(response);
      self.user = response.data;
    }).catch(function (error) {
      console.log(error);
    })
  }
  self.getUser();

});