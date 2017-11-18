app.controller('ProfileController', function(UserService, $http){
    console.log('ProfileController loaded');
    var self = this;
    self.userObject = UserService.userObject;
    self.topics = '';

    $http.get('/topic/user/' + self.userObject.id).then(function(response){
        console.log(self.userObject.id);
        console.log('Retrieved topics:', response.data);
        self.topics = response.data;
    }).catch(function(err){
        console.log('Error retrieving topics:', err);
    })
})