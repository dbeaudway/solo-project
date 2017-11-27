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
        console.log('LOGGING HERE', self.votes.votes.vote.positions.length);
        addColors();
    }).catch(function(error){
        console.log('Error', error);
    })

    function addColors(){
        let circle = document.querySelectorAll('circle');
        let position = 0;
        
        // for(var i = 0; i < self.votes.votes.vote.positions.length; i++){
        //     if(self.votes.votes.vote.positions[i].party === 'R'){
        //         circle[i].style.fill = 'red'
        //     } else if (self.votes.votes.vote.positions[i].party === 'D'){
        //         circle[i].style.fill = 'blue'
        //     }
        // }

        for(var i = 0; i < self.votes.votes.vote.total.yes; i++){
            position = i;
            circle[i].style.fill = 'green'
        }
    }

})