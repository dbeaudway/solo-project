app.controller('BillDetailController', function (UserService, UploadService, CommentService, BillService, VideoService, $http) {
    console.log('BillDetailController loaded');
    var self = this;
    self.userObject = UserService.userObject;
    self.bill = BillService.data;
    self.comments = CommentService.comments;
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
    };
    self.video = VideoService.video;

    //GET BILL DETAILS
    BillService.getBill();

    //GET BILL CO-SPONSORS
    BillService.getCosponsors();

    //POST A COMMENT
    self.postComment = function() {
        CommentService.postBillComment(self.commentToAdd);
    }

    //RETRIEVE COMMENTS FOR BILL
    self.retrieveComments = function() {
        CommentService.retrieveBillComments();
    }
    self.retrieveComments();

    //LIKE A BILL COMMENT
    self.likeComment = function(value){
        CommentService.likeComment(value);
    }

    //DELETE A COMMENT
    self.deleteComment = function(value){
        CommentService.deleteComment(value);
    }

    //VIDEO RECORDING FUNCTIONALITY BELOW//

    //CHECK IF COMMENT CONTAINS A VIDEO
    self.validateSubmission = function() {
        if(self.video.videoAvailable === true){
            console.log('Upload to amazon fired');
            self.uploadToAmazon();
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
    self.accessCamera = function(){
        VideoService.accessCamera();
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