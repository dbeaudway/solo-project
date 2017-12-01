app.controller('HomeController', function (UserService, $http) {
    console.log('HomeController loaded');
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

    //GET RECENTLY VOTED ON BILLS
    $http.get('/bill/votes/' + self.chamber).then(function (response) {
        console.log('Recently Voted Bills', response.data.results);
        self.bills = response.data.results;
    }).catch(function (error) {
        console.log('Error', error);
    })

    //GET UPCOMING HOUSE BILLS
    $http.get('/bill/bills/house').then(function (response) {
        self.upcomingHouseBills = response.data.results[0];
        console.log('Upcoming House Bills', self.upcomingHouseBills);
    }).catch(function (error) {
        console.log('Error', error);
    })

    //GET UPCOMING SENATE BILLS
    $http.get('/bill/bills/senate').then(function (response) {
        self.upcomingSenateBills = response.data.results[0];
        console.log('Upcoming Senate Bills', self.upcomingSenateBills);
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

})