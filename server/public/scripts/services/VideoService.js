app.service('VideoService', function($http){
    let self = this;
    self.video = {};
    self.setVideo = function() {
        self.video.recording = false;
        self.video.videoAvailable = false;
        self.video.recordedBlobs = '';
    }
    self.setVideo();
 
    //VIDEO RECORDING FUNCTIONALITY BELOW//
    self.accessCamera = function(){
        navigator.mediaDevices.getUserMedia({audio: true, video: true}).
        then(handleSuccess).catch(handleError);
    }

    let mediaSource = new MediaSource();
    mediaSource.addEventListener('sourceopen', handleSourceOpen, false);
    let mediaRecorder;
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
        sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
    }

    videoPlayer.addEventListener('error', function(ev) {
        alert('Your browser can not play\n\n' + videoPlayer.src
            + '\n\n media clip. event: ' + JSON.stringify(ev));
    }, true);

    function handleDataAvailable(event) {
        if (event.data && event.data.size > 0) {
            self.video.recordedBlobs.push(event.data);
        }
    }

    function handleStop(event) {
    console.log('Recorder stopped: ', event);
    }

    self.startRecording = function() {
        self.video.recording = true;
        self.video.videoAvailable = false;
        window.stream = stream;
        if (window.URL) {
            videoPlayer.src = window.URL.createObjectURL(stream);
        } else {
            videoPlayer.src = stream;
        }
        recordButton.disabled = true;
        self.video.recordedBlobs = [];
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
        self.video.recording = false;
        self.video.videoAvailable = true;
        recordButton.disabled = false;
        window.stream.getTracks()[0].stop()
        window.stream.getTracks()[1].stop()
    }

    self.play = function() {
        let superBuffer = new Blob(self.video.recordedBlobs, {type: 'video/webm'});
        videoPlayer.src = window.URL.createObjectURL(superBuffer);
    }

})