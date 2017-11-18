app.service('UploadService', function($http){
    console.log('UploadService loaded');
    let self = this;
    self.topicToUpload = {
        user: '',
        username: '',
        title: '',
        description: '',
        tags: '',
        date: '',
        url: '',
        includeVideo: '',
        videoType: ''
    };

    //Amazon Upload Video Functionality Below
    //Initiate the file to send to Amazon
    self.uploadToAmazon = function(file, data){
        self.topicToUpload.user = data.user;
        self.topicToUpload.username = data.username;
        self.topicToUpload.title = data.title;
        self.topicToUpload.description = data.description;
        self.topicToUpload.tags = data.tags;
        self.topicToUpload.includeVideo = data.includeVideo;
        self.topicToUpload.videoType = data.videoType;
        getSignedRequest(file, self.topicToUpload);
    }
    
    //Get the signed request to receive permission to submit to Amazon
    function getSignedRequest(file, data){
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/sign-s3?file-name=${self.topicToUpload.title}&file-type=${self.topicToUpload.videoType}`);
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

      //Following succesful Amazon upload, add submission to database
      self.submitTopic = function(){
        self.topicToUpload.date = new Date();
        $http.post('/topic', self.topicToUpload).then(function (response){
            console.log('Successful upload to database');
        }).catch(function(error){
            console.log('Upload to database failed')
        })
    }

})