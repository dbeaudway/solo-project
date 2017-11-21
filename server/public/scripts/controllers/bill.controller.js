app.controller('BillController', function (UserService, UploadService, $http) {
    console.log('BillController loaded');
    var self = this;
    self.userObject = UserService.userObject;
    self.bill = '';
    self.relatedBills = '';
    self.cosponsors = '';
    self.billId = location.hash.split('/')[2];

    //GET BILL DETAILS
    $http.get('/bill/' + self.billId).then(function(response){
        console.log('Success', response.data.results);
        self.bill = response.data.results[0];
    }).catch(function(error){
        console.log('Error', error);
    })

    //GET RELATED BILLS
    $http.get('/bill/related/' + self.billId).then(function(response){
        console.log('Success Related Bills', response.data.results[0].related_bills);
        self.relatedBills = response.data.results[0].related_bills;
    }).catch(function(error){
        console.log('Error', error);
    })

    //GET BILL CO-SPONSORS
    $http.get('/bill/cosponsors/' + self.billId).then(function(response){
        console.log('Success Cosponsors', response.data.results);
        self.cosponsors = response.data.results[0];
    }).catch(function(error){
        console.log('Error', error);
    })



})