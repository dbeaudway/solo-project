app.controller('VotesController', function (UserService, UploadService, $http) {
    console.log('VotesController loaded');
    var self = this;
    self.userObject = UserService.userObject;
    self.votes = '';

    //GET BILL VOTE DETAILS
    let url = location.hash.split('/');
    let congress = url[2];
    let chamber = url[3];
    let session = url[4];
    let rollcall = url[5];
    let route = `/votes/${congress}/${chamber}/${session}/${rollcall}`;
    $http.get(route).then(function(response){
        self.votes = response.data.results;
        console.log('Bill vote details:', self.votes);
    }).catch(function(error){
        console.log('Error', error);
    })


})