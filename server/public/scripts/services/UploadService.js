app.service('UploadService', function (CommentService, $http) {
  console.log('UploadService loaded');
  let self = this;

  //Generate random string to create unique video files
  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4();
  }

  // ----------------------Amazon Video Upload Below----------------------//
  //Initiate the file to send to Amazon
  self.uploadToAmazon = function (file, data) {
    self.commentToAdd = data;
    self.commentToAdd.date = new Date();
    //Sets specific variables for bill comment or member comment
    if (location.hash.indexOf('member') > 0) {
      self.commentToAdd.billId = '';
      self.commentToAdd.memberId = location.hash.split('/')[2];
      self.commentToAdd.congress = '';
      self.commentToAdd.type = 'member-comment';
    } else if (location.hash.indexOf('bill-detail') > 0) {
      self.commentToAdd.billId = location.hash.split('/')[2];
      self.commentToAdd.memberId = '';
      self.commentToAdd.congress = location.hash.split('/')[3];
      self.commentToAdd.type = 'bill-comment';
    }
    getSignedRequest(file, self.commentToAdd);
  }

  //Get the signed request to receive permission to submit to Amazon
  function getSignedRequest(file, data) {
    let uniqueId = guid();
    const xhr = new XMLHttpRequest();
    if (location.hash.indexOf('member') > 0) {
      xhr.open('GET', `/sign-s3?file-name=members/${self.commentToAdd.memberId}/${self.commentToAdd.user}/${uniqueId}`);
    } else if(location.hash.indexOf('bill-detail') > 0){
      xhr.open('GET', `/sign-s3?file-name=bills/${self.commentToAdd.billId}/${self.commentToAdd.congress}/${self.commentToAdd.user}/${uniqueId}`);
    }
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          self.commentToAdd.url = response.url;
          uploadFile(file, response.signedRequest, response.url);
        }
        else {
          alert('Could not get signed URL.');
        }
      }
    };
    xhr.send();
  }

  function uploadFile(file, signedRequest, url) {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', signedRequest);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          //Submit record to Mongo database
          if (self.commentToAdd.type === 'bill-comment') {
            CommentService.postBillComment(self.commentToAdd);
          } else if (self.commentToAdd.type === 'member-comment') {
            CommentService.postMemberComment(self.commentToAdd);
          }
        }
        else {
          alert('Could not upload file.');
        }
      }
    };
    xhr.send(file);
  }


  // ----------------------Amazon Profile Image Upload Below----------------------//
  self.uploadImageToAmazon = function (file, data) {
    self.imageToUpload = data;
    self.imageToUpload.title = 'profileImage';
    self.imageToUpload.type = 'image';
    getSignedImageRequest(file, self.imageToUpload);
  }

  //Get the signed request to receive permission to submit to Amazon
  function getSignedImageRequest(file, data) {
  
    const xhr = new XMLHttpRequest();
    let uniqueId
    xhr.open('GET', `/sign-s3?file-name=profiles/${data.user}/${data.type}/${data.title}`);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          self.imageToUpload.url = response.url;
          uploadImageFile(file, response.signedRequest, response.url);
        }
        else {
          alert('Could not get signed URL.');
        }
      }
    };
    xhr.send();
  }

  function uploadImageFile(file, signedRequest, url) {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', signedRequest);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          //Submit record to Mongo database
          self.postProfileImage();
        }
        else {
          alert('Could not upload file.');
        }
      }
    };
    xhr.send(file);
  }

  //Following successful Amazon upload, add image to users profile
  self.postProfileImage = function() {
      console.log('Image to upload:', self.imageToUpload);
      self.imageToUpload.date = new Date();
      $http.put('/user/image/' + self.imageToUpload.user, self.imageToUpload).then(function(response){
          console.log('Image added to users profile in database', response);
      }).catch(function(error){
          console.log('Error adding image to users profile in database', error);
      })
  }

})