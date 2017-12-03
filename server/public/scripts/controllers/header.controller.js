app.controller('HeaderController', function (UserService, $http) {
    var self = this;
    self.userObject = UserService.userObject;
    self.bills = '';
    self.displaySearchResults = false;

    //SEARCH BILLS
    self.search = function() {
        $http.get('/bill/search/' + self.searchTerm).then(function (response) {
            self.displaySearchResults = true;
            self.bills = response.data.results[0].bills;
            self.searchTerm = '';
        }).catch(function (error) {
            console.log('Search failed', error);
        });
    }

    self.closeSearchResults = function() {
        self.displaySearchResults = false;
    }

})