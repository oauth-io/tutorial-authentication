'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {templateUrl: 'partial/home', controller: HomeCtrl});
    $routeProvider.when('/signin', {
    	templateUrl: '/partial/signin',
    	controller: SigninCtrl
    });
    $routeProvider.when('/account', {templateUrl: 'partial/account', controller: AccountCtrl});
    $routeProvider.when('/logout', {templateUrl: 'partial/home', controller: LogoutCtrl});
    $routeProvider.otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(true);
  }]);