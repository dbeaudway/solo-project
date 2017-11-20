app.controller('HomeController', function($http){
    console.log('HomeController loaded');
    var self = this;
    self.topics = '';

    $http.get('/topic').then(function(response){
        self.topics = response.data;
    }).catch(function(err){
        console.log('Error retrieving topics:', err);
    })

})