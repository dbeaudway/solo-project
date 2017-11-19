app.controller('ProfileController', function (UserService, UploadService, $http) {
    console.log('ProfileController loaded');
    var self = this;
    self.userObject = UserService.userObject;
    self.topics = '';
    self.editing = false;

    self.getProfile = function () {
        $http.get('/topic/user/' + self.userObject.userName).then(function (response) {
            console.log('Retrieved topics:', response.data);
            self.topics = response.data;
        }).catch(function (err) {
            console.log('Error retrieving topics:', err);
        })
    }
    self.getProfile();

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