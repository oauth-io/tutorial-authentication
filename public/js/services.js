'use strict';

/* Services */
angular.module('myApp.services', ['ngCookies']).
	factory('UserService', ['$rootScope', '$http', '$cookieStore', function($rootScope, $http, $cookieStore) {
		return {
			me: function() {
				$rootScope.user = $cookieStore.get('user')
				return $cookieStore.get('user')
			},
			signin: function(code, provider, success, error) {
		    	$http({
					method: "POST",
					url: '/api/signin',
					data: {
						code: code,
						provider: provider
					}
				}).success(function(data) {
					if (data.success) {
						$cookieStore.put('user', data.user)
						$rootScope.user = data.user
					}

					success(data)
				}).error(error)
			},
			synchronize: function(code, provider, success, error) {
		    	$http({
					method: "POST",
					url: '/api/synchronize',
					data: {
						code: code,
						provider: provider
					}
				}).success(function(data) {
					if (data.success) {
						$cookieStore.put('user', data.user)
						$rootScope.user = data.user
					}
					success(data)
				}).error(error)
			},
			unsynchronize: function(provider, success, error) {
		    	$http({
					method: "POST",
					url: '/api/unsynchronize',
					data: {
						provider: provider
					}
				}).success(function(data) {
					if (data.success) {
						$cookieStore.put('user', data.user)
						$rootScope.user = data.user
					}
					success(data)
				}).error(error)
			},
			logout: function(success, error) {
				$http({
					method: "POST",
					url: '/api/logout',
				}).success(function(data) {
					$cookieStore.remove('user')
					delete $rootScope.user
					console.log(data)
					success(data)
				}).error(error)
			},
			getCsrfToken: function(success, error) {
				$http({
					method: "GET",
					url: '/api/csrf_token',
				}).success(function(data) {
					success(data.csrf_token)
				}).error(error)
			}
		}
	}])