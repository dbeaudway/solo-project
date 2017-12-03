app.controller('SearchController', function ($http) {
    var self = this;
    self.searchTerm = '';
    self.topics = '';
    self.users = '';
    self.bills = '';

    self.search = function(){
        //Retrieve topics
        $http.get('/topic/search/' + self.searchTerm).then(function(response){
            self.topics = response.data;
        }).catch(function(error){
            console.log('Search failed', error);
        });

        //Retrieve users
        $http.get('/user/search/' + self.searchTerm).then(function(response){
            self.users = response.data;
        }).catch(function(error){
            console.log('Search failed', error);
        });

        //Retrieve bills
        $http.get('/bill/search/' + self.searchTerm).then(function(response){
            self.bills = response.data.results[0].bills;
        }).catch(function(error){
            console.log('Search failed', error);
        });
    }
    self.search();


})