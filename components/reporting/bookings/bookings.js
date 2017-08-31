// Define bookings module.
var bookings = angular.module('bookings', ['ngRoute']);

/**
 * Bookings config
 * @param $routeProvider
 */
bookings.config(function($routeProvider) {

	$routeProvider.when('/bookings', {
        templateUrl: 'components/reporting/bookings/bookings-partial/bookings-partial.html',
        controller: 'bookingsCtrl'
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
        kpi: function() {
            return $q.all([
                $http.get('http://localhost:8000/json/bookings.json')
            ]);
        }
    };
});

bookings.controller('bookingsKPICtrl', function($scope, Data) {
    Data.kpi().then(function(data) {
        $scope.kpis = data[0].data.stats;
    });
});
/**
 * Bookings controller.
 * @param $scope
 * @param Data
 */
bookings.controller('bookingsCtrl', function($scope, Data) {
	Data.allPosts().then(function(data) {
		$scope.posts = data[0];
		$('.data').append('<pre>'+JSON.stringify($scope.posts, null,"    ")+'</pre>');
	});
});
