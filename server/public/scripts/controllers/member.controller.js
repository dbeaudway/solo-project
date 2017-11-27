app.controller('MemberController', function (UserService, UploadService, $http) {
    console.log('MemberController loaded');
    var self = this;
    self.userObject = UserService.userObject;
    self.member = '';
    self.memberVotes = '';
    self.memberId = location.hash.split('/')[2];

    $http.get('/member/' + self.memberId).then(function(response){
        self.member = response.data.results[0];
        console.log('Member result:', self.member);        
    }).catch(function(error){
        console.log('Error', error);
    })

    $http.get('/member/votes/' + self.memberId).then(function(response){
        self.memberVotes = response.data.results[0];
        console.log('Member votes:', self.memberVotes);
    }).catch(function(error){
        console.log('Error', error);
    })

})