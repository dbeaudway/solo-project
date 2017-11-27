app.controller('BillController', function (UserService, UploadService, $http) {
    console.log('BillController loaded');
    var self = this;
    self.userObject = UserService.userObject;
    self.bills = '';
    self.upcomingHouseBills = '';
    self.upcomingSenateBills = '';
    self.chamber = 'both';

    //GET RECENTLY VOTED ON BILLS
    $http.get('/bill/votes/' + self.chamber).then(function(response){
        console.log('Recently Voted Bills', response.data.results);
        self.bills = response.data.results;
    }).catch(function(error){
        console.log('Error', error);
    })

    //GET UPCOMING HOUSE BILLS
    $http.get('/bill/bills/house').then(function(response){
        console.log('Upcoming House Bills', response.data.results);
        self.upcomingHouseBills = response.data.results;
    }).catch(function(error){
        console.log('Error', error);
    })

    //GET UPCOMING SENATE BILLS
    $http.get('/bill/bills/senate').then(function(response){
        console.log('Upcoming Senate Bills', response.data.results);
        self.upcomingSenateBills = response.data.results;
    }).catch(function(error){
        console.log('Error', error);
    })

})