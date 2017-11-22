app.controller('BillController', function (UserService, UploadService, $http) {
    console.log('BillController loaded');
    var self = this;
    self.userObject = UserService.userObject;
    self.bills = '';
    self.chamber = 'both';

    //GET RECENTLY VOTED ON BILLS
    $http.get('/bill/' + self.chamber).then(function(response){
        console.log('Recently Voted Bills', response.data.results);
        self.bills = response.data.results;
    }).catch(function(error){
        console.log('Error', error);
    })
})