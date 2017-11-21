console.log('Client.js loaded');

var app = angular.module('app', ['ngRoute', 'ngMaterial', 'ngMessages']);

app.config(function($routeProvider){
    $routeProvider.when('/home', {
        templateUrl: '../views/templates/home.html',
        controller: 'HomeController as vm'
    }).when('/profile',{
        templateUrl: '../views/templates/profile.html',
        controller: 'ProfileController as vm',
        resolve: {
            getuser : function(UserService){
                return UserService.getuser();
            }
        }
    }).when('/user/:id',{
        templateUrl: '../views/templates/user.html',
        controller: 'UserController as vm',
    }).when('/record',{
        templateUrl: '../views/templates/record.html',
        controller: 'RecordController as vm',
        resolve: {
            getuser : function(UserService){
                return UserService.getuser();
            }
        }
    }).when('/member/:id',{
        templateUrl: '../views/templates/member.html',
        controller: 'MemberController as vm',
    }).when('/bill/:id',{
        templateUrl: '../views/templates/bill.html',
        controller: 'BillController as vm',
    }).when('/search',{
        templateUrl: '../views/templates/search.html',
        controller: 'SearchController as vm',
    }).when('/topic/:id', {
        templateUrl: '../views/templates/topic.html',
        controller: 'TopicController as vm'
    }).when('/topic', {
        templateUrl: '../views/templates/topic.html',
        controller: 'TopicController as vm'
    }).when('/register', {
        templateUrl: '../views/templates/register.html',
        controller: 'LoginController as vm'
    }).when('/', {
        templateUrl: '../views/templates/home.html',
        controller: 'HomeController as vm'
    })
})