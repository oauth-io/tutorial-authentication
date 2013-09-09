'use strict';

/* Controllers */

function AppCtrl(UserService) {
  UserService.me()

OAuth.initialize('MpnCNnhVAq_zL089ua883AevC1o')
}

function HomeCtrl() {

}

function SigninCtrl($scope, $location, UserService) {
	var me = UserService.me()
	console.log("me", me)
	if (me)
		$location.path('/account')

	UserService.getCsrfToken(function(token) {
		$scope.csrfToken = token
	})

	$scope.signin = function(provider) {
		//alert(provider)
		OAuth.initialize('MpnCNnhVAq_zL089ua883AevC1o')
		console.log($scope.csrfToken);
		OAuth.popup(provider, {"state": $scope.csrfToken}, function(error, success) {
			if (error) {
				alert("error");
				return;
			}
			UserService.signin(success.code, provider, function(data) {
				console.log(data);
				$location.path('/account')
			}, function(error) {
				alert('error:' + error);
			})
		})
	}
}

function AccountCtrl($rootScope, $scope, $location, UserService) {
	UserService.me()
	if ( ! $rootScope.user)
		$location.path('/signin')

	var sync = function() {
		$scope.sync = {
			google: typeof $rootScope.user.id_google != 'undefined' && $rootScope.user.id_google != null,
			facebook: typeof $rootScope.user.id_facebook != 'undefined' && $rootScope.user.id_facebook != null,
			twitter: typeof $rootScope.user.id_twitter != 'undefined' && $rootScope.user.id_twitter != null,
			github: typeof $rootScope.user.id_github != 'undefined' && $rootScope.user.id_github != null
		}
	}
	sync()

	$rootScope.$watch('user', sync)

	UserService.getCsrfToken(function(token) {
		$scope.csrfToken = token
	})

	$scope.synchronize = function(provider) {
		if ($scope.sync[provider]) {
			UserService.unsynchronize(provider, function() {}, function() {})
		}
		else {
			OAuth.popup(provider, {"state": $scope.csrfToken}, function(error, success) {
				if (error) {
					alert("error");
					return;
				}
				UserService.synchronize(success.code, provider, function(data) {
					console.log(data);
					//$location.path('/account')
				}, function(error) {
					alert('error:' + error);
				})
			})
		}
	}
}

function LogoutCtrl($location, UserService) {
	UserService.logout(function() {
		$location.path('/')
	})
}