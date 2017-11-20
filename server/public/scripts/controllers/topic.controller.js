app.controller('TopicController', function(UserService, $http){
    console.log('TopicController loaded');
    var self = this;
    self.userObject = UserService.userObject;
    self.topic = '';
    self.comments = '';
    self.topicId = location.hash.split('/')[2]; //THIS NEEDS TO BE UPDATED, NOT A SUSTAINABLE SOLUTION
    self.commentToAdd = {
        user: self.userObject.id,
        username: self.userObject.userName,
        userProfileImage: self.userObject.profileImage,
        topic: self.topic._id,
        topicTitle: self.topic.title,
        comment: '',
        tags: self.topic.tags,
        date: '',
        url: ''
    }

    //Retrieve topic information for TOPIC PAGE
    $http.get('/topic/item/' + self.topicId).then(function(response){
        console.log('Retrieved topics:', response.data);
        self.topic = response.data[0];
    }).catch(function(err){
        console.log('Error retrieving topics:', err);
    })

    //Post comment to a specific topic
    self.postComment = function() {
        self.commentToAdd.date = new Date();
        self.commentToAdd.topic = self.topic._id;
        self.commentToAdd.topicTitle = self.topic.title;
        self.commentToAdd.tags = self.topic.tags;
        console.log('INFORMATION BEING SENT',self.commentToAdd);
        $http.post('/comment', self.commentToAdd).then(function(response){
            console.log('Comment added', response);
            self.retrieveComments();
        }).catch(function(err){
            console.log('Error posting comments:', err)
        });
    }

    //Retrieve comments for the topic
    self.retrieveComments = function() {
        $http.get('/comment/' + self.topicId).then(function(response){
            console.log('Retrieved comments:', response);
            self.comments = response.data;
            console.log('Topic information', self.topic);
        }).catch(function(err){
            console.log('Error retrieving comments:', err);
        })
    }
    self.retrieveComments();

})