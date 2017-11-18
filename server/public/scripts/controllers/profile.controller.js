app.controller('ProfileController', function (UserService, $http) {
    console.log('ProfileController loaded');
    var self = this;
    self.userObject = UserService.userObject;
    self.topics = '';
    self.editing = false;

    self.getProfile = function () {
        $http.get('/topic/user/' + self.userObject.id).then(function (response) {
            console.log(self.userObject.id);
            console.log('Retrieved topics:', response.data);
            self.topics = response.data;
        }).catch(function (err) {
            console.log('Error retrieving topics:', err);
        })
    }
    self.getProfile();

    self.updateProfile = function () {
        $http.put('/user/' + self.userObject.id, self.userObject).then(function (response) {
            console.log('User update success');
            self.getProfile();
            self.editing = !self.editing;
        }).catch(function (err) {
            console.log('Error making updates', err);
        })
    }
})