'use strict';

/* Filters */

angular.module('myApp.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }

  }]).
  filter('capitalize', function() {
	return function(input, scope) {
		if (input) {
			var str = ''
			var arr = input.split('_')
			for (var i in arr) {
				str += arr[i].substring(0,1).toUpperCase() + arr[i].substring(1) + ' '
			}
			str = str.substring(0, str.length - 1)
			return str
  		}
	}
  }).
  filter('onoff', function() {
	return function(input, scope) {
		if (input)
			return "on"
		else
			return "off"
	}
  })
