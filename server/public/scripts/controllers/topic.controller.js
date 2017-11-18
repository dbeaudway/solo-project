app.controller('TopicController', function(UserService, $http){
    console.log('TopicController loaded');
    var self = this;
    self.userObject = UserService.userObject;
    self.topic = '';
    self.topicId = location.hash.split('/')[2]; //THIS NEEDS TO BE UPDATED, NOT A SUSTAINABLE SOLUTION

    $http.get('/topic/item/' + self.topicId).then(function(response){
        console.log('Retrieved topics:', response.data);
        self.topic = response.data[0];
    }).catch(function(err){
        console.log('Error retrieving topics:', err);
    })

})