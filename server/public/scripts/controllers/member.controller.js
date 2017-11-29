app.controller('MemberController', function (UserService, UploadService, CommentService, MemberService, VideoService, $http) {
    console.log('MemberController loaded');
    var self = this;
    self.userObject = UserService.userObject;
    self.memberInfo = MemberService.memberInfo;
    self.comments = CommentService.comments;
    self.billInfo = CommentService.billInfo;
    self.setComment = function () {
        self.commentToAdd = {
            user: self.userObject.id,
            username: self.userObject.userName,
            userProfileImage: self.userObject.profileImage,
            member: '',
            billId: '',
            congress: '',
            comment: '',
            position: '',
            date: '',
            url: '',
        }
    };
    self.setComment();
    self.video = VideoService.video;
    self.stream = false;

    //RETRIEVE MEMBER INFORMATION
    MemberService.retrieveMember();

    //RETRIEVE MEMBER VOTES
    MemberService.retrieveMemberVotes(self.memberId);
    
     //POST COMMENT TO A MEMBER
    self.postComment = function() {
        CommentService.postMemberComment(self.commentToAdd).then(function(){
            self.setComment();
            console.log('COMMENT:', self.commentToAdd);
            console.log('VIDEO:', self.video);
        });
    }

    //RETRIEVE COMMENTS FOR MEMBER
    self.retrieveComments = function() {
        CommentService.retrieveMemberComments();
    }
    self.retrieveComments();

    //LIKE A COMMENT
    self.likeComment = function(value) {
        CommentService.likeComment(value);
    }

    //DELETE A COMMENT
    self.deleteComment = function(value) {
        CommentService.deleteComment(value);
    }

    //CHECK IF COMMENT CONTAINS A VIDEO
    self.validateSubmission = function() {
        self.commentToAdd.user = self.userObject.id;
        self.commentToAdd.username = self.userObject.userName;
        self.commentToAdd.userProfileImage = self.userObject.profileImage;
        if(self.video.videoAvailable === true){
            console.log('Upload to amazon fired');
            self.uploadToAmazon();
            self.setComment();
            VideoService.setVideo();
        } else {
            console.log('CommentService.postComment called');
            self.postComment();
        }
    }

    //UPLOAD RECORDED VIDEO TO AMAZON S3
    self.uploadToAmazon = function(){
        self.blob = new Blob(self.video.recordedBlobs, {type: 'video/webm'});
        UploadService.uploadToAmazon(self.blob, self.commentToAdd);
    }

    //REQUEST DEVICE CAMERA PERMISSIONS
    self.accessCamera = function () {
        if(self.stream === false){
            self.stream = !self.stream;
            VideoService.accessCamera();
        } else {
            window.stream.getTracks()[0].stop();
            window.stream.getTracks()[1].stop();
        }
    }

    //START RECORDING
    self.startRecording = function(){
        VideoService.startRecording();
    }

    //STOP RECORDING
    self.stopRecording = function() {
        VideoService.stopRecording();
    }

    //PLAY RECORDED VIDEO
    self.play = function() {
        VideoService.play();
    }

})