app.controller('RecordController', function($http, UserService){
    console.log('RecordController loaded');
    let self = this;
    self.userObject = UserService.userObject;
    self.topicToUpload = {
        user: self.userObject.id,
        title: '',
        description: '',
        tags: '',
        date: '',
        url: '',
        includeVideo: '',
        videoType: ''
    };
    self.topics = '';
    self.recording = false;
    self.videoAvailable = false;
    self.blob = '';

    self.submitTopic = function(){
        $http.post('/topic', self.topicToUpload).then(function (response){
            console.log('Successful upload to database');
            self.getTopics();
        }).catch(function(error){
            console.log('Upload to database failed')
        })
    }

    self.validateSubmission = function() {
        if(!self.topicToUpload.title || !self.topicToUpload.description){
            alert('You must fill out required form fields: Title and Description')
        }else if(self.topicToUpload.includeVideo === true && self.videoAvailable === false){
            alert('You must record a video to submit');
        } else if(self.topicToUpload.includeVideo === true && self.videoAvailable === true){
            self.uploadToAmazon()
        }else{
           self.submitTopic()
        }
    }

    self.accessCamera = function(){
        console.log('fired');
        navigator.mediaDevices.getUserMedia({audio: true, video: true}).
        then(handleSuccess).catch(handleError);
    }

    self.recordType = function(){
        if(self.topicToUpload.includeVideo === true && self.topicToUpload.videoType === 'camera'){
            self.startRecording();
        } else if(self.topicToUpload.includeVideo === true && self.topicToUpload.videoType === 'screen'){
            self.captureScreenNow();
        }
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
        if(self.topicToUpload.videoType === 'camera'){
            self.recording = false;
            self.videoAvailable = true;
            recordButton.disabled = false;
            mediaRecorder.stop();
            console.log('Recorded Blobs: ', recordedBlobs);
        } else if(self.topicToUpload.videoType === 'screen'){
            self.stopScreenCapture();

        }
    }

    self.play = function() {
        let superBuffer = new Blob(recordedBlobs, {type: 'video/webm'});
        videoPlayer.src = window.URL.createObjectURL(superBuffer);
    }

    //Screen Capture Functionality
        function captureScreen(cb) {
            getScreenId(function (error, sourceId, screen_constraints) {
                navigator.mediaDevices.getUserMedia(screen_constraints).then(cb).catch(function(error) {
                console.error('getScreenId error', error);
                alert('Failed to capture your screen. Please check Chrome console logs for further information.');
                });
            });
        }

        function captureCamera(cb) {
            navigator.mediaDevices.getUserMedia({audio: true}).then(cb);
        }

        function keepStreamActive(stream) {
            //let video = document.createElement('video');
            //video.muted = true;
            setSrcObject(stream, videoPlayer);
            //video.style.display = 'none';
            //(document.body || document.documentElement).appendChild(video);
        }

        self.captureScreenNow = function(){
        self.recording = true;
        self.videoAvailable = false;
        captureScreen(function(screen) {
            keepStreamActive(screen);
            captureCamera(function() {
                keepStreamActive();
                console.log(screen);
                recorder = RecordRTC([screen], {
                    type: 'video',
                    mimeType: 'video/webm',
                    previewStream: function(s) {
                        document.querySelector('video').muted = true;
                        setSrcObject(s, document.querySelector('video'));
                    }
                });
                recorder.startRecording();
            });
        })
        };

        self.stopScreenCapture = function(){
            recorder.stopRecording(function() {
                document.querySelector('video').src = URL.createObjectURL(blob);
                document.querySelector('video').muted = false;
                [screen].forEach(function(stream) {
                    stream.getVideoTracks().forEach(function(track) {
                        track.stop();
                    });
                    stream.getAudioTracks().forEach(function(track) {
                        track.stop();
                    });
                });
            });
        }
    
    //Amazon Upload functionality below
    self.uploadToAmazon = function(){
        self.blob = new Blob(recordedBlobs, {type: 'video/webm'});
        console.log('uploadToAmazon fired, sending:', self.blob);
        getSignedRequest(self.blob);
    }
    
    function getSignedRequest(file){
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/sign-s3?file-name=${self.topicToUpload.title}&file-type=${file.type}`);
        xhr.onreadystatechange = () => {
          if(xhr.readyState === 4){
            if(xhr.status === 200){
              const response = JSON.parse(xhr.responseText);
              console.log(response);
              self.topicToUpload.url = response.url;
              uploadFile(file, response.signedRequest, response.url);
            }
            else{
              alert('Could not get signed URL.');
            }
          }
        };
        xhr.send();
      }

      function uploadFile(file, signedRequest, url){
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', signedRequest);
        xhr.onreadystatechange = () => {
          if(xhr.readyState === 4){
            if(xhr.status === 200){
              console.log('File uploaded');
              //Submit record to Mongo database
              self.submitTopic();
            }
            else{
              alert('Could not upload file.');
            }
          }
        };
        xhr.send(file);
    }

});