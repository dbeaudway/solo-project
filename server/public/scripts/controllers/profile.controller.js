app.controller('ProfileController', function (UserService, UploadService, $http) {
    console.log('ProfileController loaded');
    var self = this;
    self.userObject = UserService.userObject;
    self.comments = '';
    self.editing = false;
    

    self.getComments = function() {
        $http.get('/comment/user/' + self.userObject.userName).then(function (response){
            console.log('Retrieved comments:', response.data);
            self.comments = response.data;
        })
    }
    self.getComments();

    self.updateProfile = function () {
        $http.put('/user/' + self.userObject.id, self.userObject).then(function (response) {
            console.log('User update success');
            self.getProfile();
            self.editing = !self.editing;
        }).catch(function (err) {
            console.log('Error making updates', err);
        })
    }
    
    self.uploadImageToAmazon = function(){
        let image = document.getElementById('imageUpload').files[0];
        let data = {
            user: self.userObject.id,
            username: self.userObject.userName
        }
        UploadService.uploadImageToAmazon(image, data);
    }
})