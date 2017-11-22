app.controller('BillDetailController', function (UserService, UploadService, $http) {
    console.log('BillDetailController loaded');
    var self = this;
    self.userObject = UserService.userObject;
    self.bill = '';
    self.cosponsors = '';
    let url = location.hash.split('/');
    let billId = url[2];
    let congress = url[3];

    //GET BILL DETAILS
    let route = `/bill-detail/${billId}/${congress}`;
    console.log(route);
    $http.get(route).then(function(response){
        self.bill = response.data.results[0];
        console.log('Bill details', self.bill);        
    }).catch(function(error){
        console.log('Error', error);
    })

    //GET BILL CO-SPONSORS
    let route2 = `/bill-detail/cosponsors/${billId}/${congress}`;
    $http.get(route2).then(function(response){
        self.cosponsors = response.data.results[0];
    }).catch(function(error){
        console.log('Error', error);
    })


})