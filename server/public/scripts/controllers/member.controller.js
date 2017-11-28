app.controller('MemberController', function (UserService, UploadService, $http) {
    console.log('MemberController loaded');
    var self = this;
    self.userObject = UserService.userObject;
    self.member = '';
    self.memberVotes = '';
    self.memberId = location.hash.split('/')[2];
    self.memberCongress = '';
    self.url = location.hash.split('/');
    self.billId = self.url[2];
    self.congress = self.url[3];
    self.commentToAdd = {
        user: self.userObject.id,
        username: self.userObject.userName,
        userProfileImage: self.userObject.profileImage,
        member: self.memberId,
        billId: '',
        congress: '',
        comment: '',
        position: '',
        date: '',
        url: '',
        video: false
    };
    self.recording = false;
    self.videoAvailable = false;

    $http.get('/member/' + self.memberId).then(function(response){
        self.member = response.data.results[0];
        self.commentToAdd.congress = response.data.results[0].roles[0].congress;
        console.log('Member result:', self.member);        
    }).catch(function(error){
        console.log('Error', error);
    })

    $http.get('/member/votes/' + self.memberId).then(function(response){
        self.memberVotes = response.data.results[0];
        console.log('Member votes:', self.memberVotes);
    }).catch(function(error){
        console.log('Error', error);
    })

     //POST COMMENT TO A MEMBER
     self.postComment = function() {
        self.commentToAdd.date = new Date();
        console.log('INFORMATION BEING SENT', self.commentToAdd);
        $http.post('/comment', self.commentToAdd).then(function(response){
            console.log('Comment added', response);
            self.retrieveComments();
        }).catch(function(err){
            console.log('Error posting comments:', err)
        });
    }

    //RETRIEVE COMMENTS FOR MEMBER
    self.retrieveComments = function() {
        let route = `/comment/member/${self.memberId}/${self.memberCongress}`;
        $http.get(route).then(function(response){
            console.log('Retrieved comments:', response);
            self.comments = response.data;
            console.log('Comments:', self.comments);
        }).catch(function(err){
            console.log('Error retrieving comments:', err);
        })
    }
    self.retrieveComments();

    //LIKE A COMMENT
    self.likeComment = function(value) {
        let comment = value;
        $http.put('/comment', comment).then(function(response){
            console.log('Liked a comment', response);
            self.retrieveComments();
        }).catch(function(error){
            console.log('Error liking the comment');
        })
    }

    //DELETE A COMMENT
    self.deleteComment = function(value) {
        let comment = value;
        console.log(comment);
        $http.put('/comment/delete', comment).then(function(response){
            console.log('Deleted a comment', response);
            self.retrieveComments();
        }).catch(function(error){
            console.log('Error deleting comment');
        })
    }

})