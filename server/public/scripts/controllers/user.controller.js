app.controller('UserController', function ($http) {
  console.log('UserController created');
  var self = this;
  self.topics = '';
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

  self.getTopics = function () {
    $http.get('/topic/user/' + self.userName).then(function (response) {
      console.log('Success receiving topics', response)
      self.topics = response.data;
    }).catch(function (err) {
      console.log('Error retrieving topics:', err);
    })
  }
  self.getTopics();

});