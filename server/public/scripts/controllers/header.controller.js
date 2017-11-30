app.controller('HeaderController', function (UserService, $http) {
    console.log('HeaderController loaded');
    var self = this;
    self.userObject = UserService.userObject;

})