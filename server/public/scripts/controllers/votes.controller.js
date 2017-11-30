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
    $http.get(route).then(function (response) {
        self.votes = response.data.results;
        console.log('HERE ARE THE VOTES', self.votes);
        addColors();
    }).catch(function (error) {
        console.log('Error', error);
    })

    function addColors() {
        let position = 0;
        let circle;
        if (chamber === "House") {
            console.log('fired house');
            circle = document.getElementById('houseSeats').querySelectorAll('circle');
            fillCircles();
        } else if (chamber === "Senate") {
            console.log('fired senate');
            circle = document.getElementById('senateSeats').querySelectorAll('circle');
            fillCircles();
        }

        function fillCircles() {
            for (var i = 0; i < self.votes.votes.vote.total.yes; i++) {
                position = i;
                circle[i].style.fill = '#28d428'
            }
        }
        console.log(circle);
    }

})