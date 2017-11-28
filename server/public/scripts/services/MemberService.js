app.service('MemberService', function ($http) {
    console.log('MemberService loaded');
    let self = this;
    self.memberInfo = {
        congress: '',
        member: '',
        votes: ''
    }
    self.memberId = location.hash.split('/')[2];

    //Set page variables
    self.setVariables = function() {
        self.memberId = location.hash.split('/')[2];
    }

    //RETRIEVE MEMBER INFORMATION
    self.retrieveMember = function () {
        self.setVariables();
        self.memberInfo.member = '';
        $http.get('/member/' + self.memberId).then(function (response) {
            self.memberInfo.member = response.data.results[0];
            //self.commentToAdd.congress = response.data.results[0].roles[0].congress;
            self.memberInfo.congress = response.data.results[0].roles[0].congress;
            console.log('Member result:', self.memberInfo.member);
        }).catch(function (error) {
            console.log('Error', error);
        })
    }

    //RETRIEVE MEMBER VOTES
    self.retrieveMemberVotes = function() {
        self.setVariables();
        self.memberInfo.votes = '';
        $http.get('/member/votes/' + self.memberId).then(function (response) {
            self.memberInfo.votes = response.data.results[0];
            console.log('Member votes:', self.memberInfo.votes);
        }).catch(function (error) {
            console.log('Error', error);
        })
    }
})