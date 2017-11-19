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
        type: ''
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
        self.topicToUpload.type = data.videoType;
        getSignedRequest(file, self.topicToUpload);
    }

    self.uploadImageToAmazon = function(file, data){
        self.topicToUpload.user = data.user;
        self.topicToUpload.username = data.username;
        self.topicToUpload.title = file.name;
        self.topicToUpload.type = 'image';
        getSignedRequest(file);
    }
    
    //Get the signed request to receive permission to submit to Amazon
    function getSignedRequest(file, data){
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/sign-s3?user=${self.topicToUpload.username}&file-type=${self.topicToUpload.type}&file-name=${self.topicToUpload.title}`);
        xhr.onreadystatechange = () => {
          if(xhr.readyState === 4){
            if(xhr.status === 200){
              const response = JSON.parse(xhr.responseText);
              self.topicToUpload.url = response.url;
              console.log(self.topicToUpload.url);
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
              //Submit record to Mongo database
              if(self.topicToUpload.type === 'image'){
                self.submitImage();
              } else{
                self.submitTopic();
              }
            }
            else{
              alert('Could not upload file.');
            }
          }
        };
        xhr.send(file);
    }

      //Following successful Amazon upload, add submission to database
      self.submitTopic = function() {
        self.topicToUpload.date = new Date();
        $http.post('/topic', self.topicToUpload).then(function (response){
            console.log('Successful upload to database');
            self.topicToUpload = '';
        }).catch(function(error){
            console.log('Upload to database failed')
        })
    }

    //Following successful Amazon upload, add image to users profile
    self.submitImage = function() {
        console.log('Topic to upload:', self.topicToUpload);
        self.topicToUpload.date = new Date();
        $http.put('/user/image/' + self.topicToUpload.user, self.topicToUpload).then(function(response){
            console.log('Image added to users profile in database', response);
        }).catch(function(error){
            console.log('Error adding image to users profile in database', error);
        })
    }

})