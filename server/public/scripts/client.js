console.log('Client.js loaded');

var app = angular.module('app', ['ngRoute', 'ngMaterial', 'ngMessages']);

app.config(function($routeProvider){
    $routeProvider.when('/home', {
        templateUrl: '../views/templates/home.html',
        controller: 'HomeController as vm',
        resolve: {
            getuser : function(UserService){
                return UserService.getuser();
            }
        }
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
    }).when('/topic/:id', {
        templateUrl: '../views/templates/topic.html',
        controller: 'TopicController as vm'
    }).when('/topic', {
        templateUrl: '../views/templates/topic.html',
        controller: 'TopicController as vm'
    }).when('/theme', {
        templateUrl: '../views/templates/theme.html',
        controller: 'ThemeController as vm'
    }).when('/register', {
        templateUrl: '../views/templates/register.html',
        controller: 'LoginController as vm'
    })
})