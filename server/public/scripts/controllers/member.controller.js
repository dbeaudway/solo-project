app.controller('MemberController', function (UserService, UploadService, $http) {
    console.log('MemberController loaded');
    var self = this;
    self.userObject = UserService.userObject;
    self.member = '';
    self.memberId = location.hash.split('/')[2];

    $http.get('/member/' + self.memberId).then(function(response){
        console.log('Success', response.data.results[0]);
        self.member = response.data.results[0];
    }).catch(function(error){
        console.log('Error', error);
    })

})