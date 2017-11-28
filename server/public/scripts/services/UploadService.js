app.service('UploadService', function($http){
    console.log('UploadService loaded');
    let self = this;
    self.commentToAdd = {
      user: '',
      username: '',
      userProfileImage: '',
      member: '',
      billId: '',
      congress: '',
      comment: '',
      position: '',
      date: '',
      url: '',
      video: false,
      type: ''
  };

    //Amazon Upload Video Functionality Below
    //Initiate the file to send to Amazon
    self.uploadToAmazon = function(file, data){
        self.commentToAdd.user = data.user;
        self.commentToAdd.username = data.username;
        self.commentToAdd.billId = data.billId;
        self.commentToAdd.congress = data.congress;
        self.commentToAdd.comment = data.comment;
        self.commentToAdd.position = data.position;
        self.commentToAdd.video = data.video;
        self.commentToAdd.type = 'comment';
        getSignedRequest(file, self.commentToAdd);
    }

    // self.uploadImageToAmazon = function(file, data){
    //     self.topicToUpload.user = data.user;
    //     self.topicToUpload.username = data.username;
    //     self.topicToUpload.title = file.name;
    //     self.topicToUpload.type = 'image';
    //     getSignedRequest(file);
    // }
    
    //Get the signed request to receive permission to submit to Amazon
    function getSignedRequest(file, data){
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/sign-s3?file-name=${self.commentToAdd.billId}/${self.commentToAdd.congress}/${self.commentToAdd.type}/${self.commentToAdd.username}`);
        xhr.onreadystatechange = () => {
          if(xhr.readyState === 4){
            if(xhr.status === 200){
              const response = JSON.parse(xhr.responseText);
              self.commentToAdd.url = response.url;
              console.log(self.commentToAdd.url);
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
              if(self.commentToAdd.type === 'image'){
                self.submitImage();
              } else if(self.commentToAdd.type === 'comment'){
                self.postComment();
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
    //   self.submitTopic = function() {
    //     self.topicToUpload.date = new Date();
    //     $http.post('/topic', self.topicToUpload).then(function (response){
    //         console.log('Successful upload to database');
    //         self.topicToUpload = '';
    //     }).catch(function(error){
    //         console.log('Upload to database failed')
    //     })
    // }

    //Following successful Amazon upload, add image to users profile
    // self.submitImage = function() {
    //     console.log('Topic to upload:', self.topicToUpload);
    //     self.topicToUpload.date = new Date();
    //     $http.put('/user/image/' + self.topicToUpload.user, self.topicToUpload).then(function(response){
    //         console.log('Image added to users profile in database', response);
    //     }).catch(function(error){
    //         console.log('Error adding image to users profile in database', error);
    //     })
    // }

    //POST COMMENT TO A BILL PAGE
    self.postComment = function() {
      //self.commentToAdd.date = new Date();
      console.log('INFORMATION BEING SENT',self.commentToAdd);
      $http.post('/comment', self.commentToAdd).then(function(response){
          console.log('Comment added', response);
          //THIS SHOULD BE REPLACED WITH THE RETRIEVE COMMENTS FROM SERVICE self.retrieveComments();
      }).catch(function(err){
          console.log('Error posting comments:', err)
      });
  }

    

})