app.controller('SearchController', function ($http) {
    console.log('SearchController loaded');
    var self = this;
    self.searchTerm = '';
    self.topics = '';
    self.users = '';

    self.search = function(){
        $http.get('/topic/search/' + self.searchTerm).then(function(response){
            console.log('Search results:', response);
            self.topics = response.data;
        }).catch(function(error){
            console.log('Search failed', error);
        });

        $http.get('/user/search/' + self.searchTerm).then(function(response){
            console.log('Search results:', response);
            self.users = response.data;
        }).catch(function(error){
            console.log('Search failed', error);
        });
    }
    self.search();


})