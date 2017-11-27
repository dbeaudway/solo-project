app.controller('BillDetailController', function (UserService, UploadService, $http) {
    console.log('BillDetailController loaded');
    var self = this;
    self.userObject = UserService.userObject;
    self.bill = '';
    self.cosponsors = '';
    self.comments = '';
    self.url = location.hash.split('/');
    self.billId = self.url[2];
    self.congress = self.url[3];
    self.commentToAdd = {
        user: self.userObject.id,
        username: self.userObject.userName,
        userProfileImage: self.userObject.profileImage,
        billId: self.billId,
        congress: self.congress,
        comment: '',
        position: '',
        date: '',
        url: '',
        video: false
    };
    self.recording = false;
    self.videoAvailable = false;

    //GET BILL DETAILS
    let route = `/bill-detail/${self.billId}/${self.congress}`;
    console.log(route);
    $http.get(route).then(function(response){
        self.bill = response.data.results[0];
        console.log('Bill details', self.bill);        
    }).catch(function(error){
        console.log('Error', error);
    })

    //GET BILL CO-SPONSORS
    let route2 = `/bill-detail/cosponsors/${self.billId}/${self.congress}`;
    $http.get(route2).then(function(response){
        self.cosponsors = response.data.results[0];
        console.log('Cosponsors:', self.cosponsors);
    }).catch(function(error){
        console.log('Error', error);
    })

    //POST COMMENT TO A BILL
    self.postComment = function() {
        self.commentToAdd.date = new Date();
        console.log('INFORMATION BEING SENT',self.commentToAdd);
        $http.post('/bill-detail', self.commentToAdd).then(function(response){
            console.log('Comment added', response);
            self.retrieveComments();
        }).catch(function(err){
            console.log('Error posting comments:', err)
        });
    }

    //RETRIEVE COMMENTS FOR BILL
    self.retrieveComments = function() {
        let route = `/bill-detail/comments/${self.billId}/${self.congress}`;
        $http.get(route).then(function(response){
            console.log('Retrieved comments:', response);
            self.comments = response.data;
            console.log('Comments:', self.comments);
        }).catch(function(err){
            console.log('Error retrieving comments:', err);
        })
    }
    self.retrieveComments();

    //LIKE A BILL COMMENT
    self.likeComment = function(value) {
        let comment = value;
        $http.put('/bill-detail/comments/', comment).then(function(response){
            console.log('Liked a comment', response);
            self.retrieveComments();
        }).catch(function(error){
            console.log('Error liking the comment');
        })
    }

    //DELETE A BILL COMMENT
    self.deleteComment = function(value) {
        let comment = value;
        console.log(comment);
        $http.put('/bill-detail/comments/delete', comment).then(function(response){
            console.log('Deleted a comment', response);
            self.retrieveComments();
        }).catch(function(error){
            console.log('Error deleting comment');
        })
    }

    //VIDEO RECORDING FUNCTIONALITY BELOW//

    //Validate whether the comment is a video or text response
    self.validateSubmission = function() {
        if(self.commentToAdd.video === true && self.videoAvailable === true){
            console.log('Upload to amazon fired');
            self.uploadToAmazon();
        } else {
            console.log('UploadService.postComment called');
            self.postComment();
        }
    }

    self.accessCamera = function(){
        console.log('fired');
        navigator.mediaDevices.getUserMedia({audio: true, video: true}).
        then(handleSuccess).catch(handleError);
    }

    let mediaSource = new MediaSource();
    mediaSource.addEventListener('sourceopen', handleSourceOpen, false);
    let mediaRecorder;
    let recordedBlobs;
    let sourceBuffer;
    let blob;
    let videoPlayer = document.querySelector('video#videoPlayer');
    let recordButton = document.querySelector('button#record');
    let playButton = document.querySelector('button#play');
    let recorder; //Used for screen capture


    // window.isSecureContext could be used for Chrome
    let isSecureOrigin = location.protocol === 'https:' ||
        location.hostname === 'localhost';
        if (!isSecureOrigin) {
        alert('getUserMedia() must be run from a secure origin: HTTPS or localhost.' +
            '\n\nChanging protocol to HTTPS');
        location.protocol = 'HTTPS';
    }


    function handleSuccess(stream) {
        console.log('getUserMedia() got stream: ', stream);
        window.stream = stream;
        if (window.URL) {
            videoPlayer.src = window.URL.createObjectURL(stream);
        } else {
            videoPlayer.src = stream;
        }
    }

    function handleError(error) {
        console.log('navigator.getUserMedia error: ', error);
    }

    function handleSourceOpen(event) {
        console.log('MediaSource opened');
        sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
        console.log('Source buffer: ', sourceBuffer);
    }

    videoPlayer.addEventListener('error', function(ev) {
        console.error('MediaRecording.recordedMedia.error()');
        alert('Your browser can not play\n\n' + videoPlayer.src
            + '\n\n media clip. event: ' + JSON.stringify(ev));
    }, true);

    function handleDataAvailable(event) {
        if (event.data && event.data.size > 0) {
            recordedBlobs.push(event.data);
        }
    }

    function handleStop(event) {
    console.log('Recorder stopped: ', event);
    }

    self.startRecording = function() {
        self.recording = true;
        self.videoAvailable = false;
        window.stream = stream;
        if (window.URL) {
            videoPlayer.src = window.URL.createObjectURL(stream);
        } else {
            videoPlayer.src = stream;
        }
        recordButton.disabled = true;
        recordedBlobs = [];
        let options = {mimeType: 'video/webm;codecs=vp9'};
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            console.log(options.mimeType + ' is not Supported');
            options = {mimeType: 'video/webm;codecs=vp8'};
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            console.log(options.mimeType + ' is not Supported');
            options = {mimeType: 'video/webm'};
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                console.log(options.mimeType + ' is not Supported');
                options = {mimeType: ''};
            }
            }
        }
        try {
            mediaRecorder = new MediaRecorder(window.stream, options);
        } catch (e) {
            console.error('Exception while creating MediaRecorder: ' + e);
            alert('Exception while creating MediaRecorder: '
            + e + '. mimeType: ' + options.mimeType);
            return;
        }
        console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
        mediaRecorder.onstop = handleStop;
        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.start(10); // collect 10ms of data
        console.log('MediaRecorder started', mediaRecorder);
    }

    self.stopRecording = function() {
        self.recording = false;
        self.videoAvailable = true;
        recordButton.disabled = false;
        mediaRecorder.stop();
        console.log('Recorded Blobs: ', recordedBlobs);
    }

    self.play = function() {
        let superBuffer = new Blob(recordedBlobs, {type: 'video/webm'});
        videoPlayer.src = window.URL.createObjectURL(superBuffer);
    }

    self.uploadToAmazon = function(){
        self.blob = new Blob(recordedBlobs, {type: 'video/webm'});
        UploadService.uploadToAmazon(self.blob, self.commentToAdd);
    }

})