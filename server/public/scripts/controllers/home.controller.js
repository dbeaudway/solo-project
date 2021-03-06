app.controller('HomeController', function (UserService, $http) {
    var self = this;
    self.userObject = UserService.userObject;
    self.bills = '';
    self.upcomingHouseBills = '';
    self.upcomingSenateBills = '';
    self.chamber = 'both';
    self.stateSenate = '';
    self.stateHouse = '';
    self.displaySearchResults = false;
    var states = document.querySelectorAll('path');

    //GET UPCOMING HOUSE BILLS
    $http.get('/bill/bills/house').then(function (response) {
        self.upcomingHouseBills = response.data.results[0];
    }).catch(function (error) {
        console.log('Error', error);
    })

    //GET UPCOMING SENATE BILLS
    $http.get('/bill/bills/senate').then(function (response) {
        self.upcomingSenateBills = response.data.results[0];
    }).catch(function (error) {
        console.log('Error', error);
    })

    Array.from(states).forEach(link => {
        link.addEventListener('click', function (event) {
            self.displaySearchResults = true;

            let state = this.id;
            $http.get('/member/house/' + state).then(function (response) {
                self.stateHouse = response.data;
            }).catch(function (error) {
                console.log('Error', error);
            })

            $http.get('/member/senate/' + state).then(function (response) {
                self.stateSenate = response.data;
            }).catch(function (error) {
                console.log('Error', error);
            })
        });
    });

    self.closeSearchResults = function() {
        self.displaySearchResults = false;
    }

    setInterval(function(){
            let position = 0;
            let random;
            let states;
            states = document.querySelectorAll('path');
            for (var i = 0; i < states.length; i++) {
                position = i;
                random = Math.random();
                if(random > .5){
                    states[i].style.fill = '#3993DD'
                } else {
                    states[i].style.fill = '#c1181f'
                }
            }
            
        
    }, 2000);

})