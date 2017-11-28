app.controller('MemberController', function (UserService, UploadService, CommentService, MemberService, $http) {
    console.log('MemberController loaded');
    var self = this;
    self.userObject = UserService.userObject;
    self.memberInfo = MemberService.memberInfo;
    self.comments = '';
    self.billInfo = CommentService.billInfo;
    self.memberId = location.hash.split('/')[2];
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

    //RETRIEVE MEMBER INFORMATION
    MemberService.retrieveMember(self.memberId);

    //RETRIEVE MEMBER VOTES
    MemberService.retrieveMemberVotes(self.memberId);


    //Validate whether the comment is a video or text response
    self.validateSubmission = function() {
        if(self.commentToAdd.video === true && self.videoAvailable === true){
            console.log('Upload to amazon fired');
            self.uploadToAmazon();
        } else {
            console.log('CommentService.postComment called');
            self.postComment();
        }
    }
    
     //POST COMMENT TO A MEMBER
    self.postComment = function() {
        self.commentToAdd.date = new Date();
        CommentService.postComment(self.commentToAdd);
    }

    //RETRIEVE COMMENTS FOR MEMBER
    self.retrieveComments = function() {
        let route = `/comment/member/${self.memberId}/${self.memberCongress}`;
        console.log('THIS IS THE CONGRESS', self.memberCongress);
        $http.get(route).then(function(response){
            console.log('Retrieved comments:', response);
            self.comments = response.data;
            console.log('Comments:', self.comments);
        }).catch(function(err){
            console.log('Error retrieving comments:', err);
        })
    }
    // self.retrieveComments = function() {
    //     CommentService.retrieveComments();
    // }
    // self.retrieveComments();

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