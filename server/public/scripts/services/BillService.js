app.service('BillService', function ($http) {
    console.log('BillService loaded');
    let self = this;
    self.data = {
        bill: '',
        cosponsors: '',
        billId: location.hash.split('/')[2],
        congress: location.hash.split('/')[3]
    };


    //Set page variables
    self.setVariables = function() {
        self.data.bill = '';
        self.data.cosponsors = '';
        self.data.billId = location.hash.split('/')[2];
        self.data.congress = location.hash.split('/')[3];
    }

    //GET BILL DETAILS
    self.getBill = function() {
        self.setVariables();
        $http.get(`/bill-detail/${self.data.billId}/${self.data.congress}`).then(function(response){
            console.log('This is the bill:', response);
            self.data.bill = response.data.results[0];
            console.log('Bill details', self.data.bill);        
        }).catch(function(error){
            console.log('Error', error);
        })
    }

    //GET BILL COSPONSORS
    self.getCosponsors = function() {
        self.setVariables();
        $http.get(`/bill-detail/cosponsors/${self.data.billId}/${self.data.congress}`).then(function(response){
            console.log('These are the cosponsors:', response);
            self.data.cosponsors = response.data.results[0];
            console.log('Cosponsors:', self.data.cosponsors);
        }).catch(function(error){
            console.log('Error', error);
        })
    }

})