app.controller('MemberController', function (UserService, UploadService, CommentService, MemberService, $http) {
    console.log('MemberController loaded');
    var self = this;
    self.userObject = UserService.userObject;
    self.memberInfo = MemberService.memberInfo;
    self.comments = CommentService.comments;
    self.billInfo = CommentService.billInfo;
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
    MemberService.retrieveMember();

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
        CommentService.postMemberComment(self.commentToAdd);
    }

    //RETRIEVE COMMENTS FOR MEMBER
    self.retrieveComments = function() {
        CommentService.retrieveMemberComments();
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