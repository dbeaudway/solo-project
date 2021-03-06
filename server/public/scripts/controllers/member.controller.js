app.controller('MemberController', function (UserService, UploadService, CommentService, MemberService, VideoService, $http) {
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
    self.offset = 0;

    //RETRIEVE MEMBER INFORMATION
    MemberService.retrieveMember();

    //RETRIEVE MEMBER VOTES
    MemberService.retrieveMemberVotes(self.memberId);
    
     //POST COMMENT TO A MEMBER
    self.postComment = function() {
        CommentService.postMemberComment(self.commentToAdd).then(function(){
            self.setComment();
        });
    }

    //RETRIEVE COMMENTS FOR MEMBER
    self.retrieveComments = function() {
        CommentService.retrieveMemberComments(self.offset);
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
            self.uploadToAmazon();
            self.setComment();
            VideoService.setVideo();
        } else {
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

     //Identify bottom of page scroll -- retrieve additional comments at bottom
     function getScrollXY() {
        var scrOfX = 0, scrOfY = 0;
        if( typeof( window.pageYOffset ) == 'number' ) {
            //Netscape compliant
            scrOfY = window.pageYOffset;
            scrOfX = window.pageXOffset;
        } else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
            //DOM compliant
            scrOfY = document.body.scrollTop;
            scrOfX = document.body.scrollLeft;
        } else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
            //IE6 standards compliant mode
            scrOfY = document.documentElement.scrollTop;
            scrOfX = document.documentElement.scrollLeft;
        }
        return [ scrOfX, scrOfY ];
    }
    
    function getDocHeight() {
        var D = document;
        return Math.max(
            D.body.scrollHeight, D.documentElement.scrollHeight,
            D.body.offsetHeight, D.documentElement.offsetHeight,
            D.body.clientHeight, D.documentElement.clientHeight
        );
    }
    
    document.addEventListener("scroll", function (event) {
        if (getDocHeight() == getScrollXY()[1] + window.innerHeight) {
                if(self.offset < self.comments.limit){
                    self.offset += 10;
                    CommentService.appendMemberComments(self.offset);
                }
        }
    });

})