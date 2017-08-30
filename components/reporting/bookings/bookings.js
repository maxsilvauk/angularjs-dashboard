// Define bookings module.
var bookings = angular.module('bookings', ['ngRoute']);

/**
 * Bookings config
 * @param $routeProvider
 */
bookings.config(function($routeProvider) {

	$routeProvider.when('/bookings', {
        templateUrl: 'components/reporting/bookings/bookings-partial/bookings-partial.html',
        controller: 'bookingsController'
    });
});

/**
 * Bookings factory
 * @param $http
 * @param $q
 */
bookings.factory('Data', function($http, $q) {
	var url = 'https://jsonplaceholder.typicode.com';
    return {
        allPosts: function() {
            return $q.all([
                $http.get(url + '/posts')
            ]);
        },
    };
});

/**
 * Bookings controller.
 * @param $scope
 * @param Data
 */
bookings.controller('bookingsController', function($scope, Data) {
	Data.allPosts().then(function(data) {
		$scope.posts = data[0];
		$('.data').append('<pre>'+JSON.stringify($scope.posts, null,"    ")+'</pre>');
	});
});