// Define bookings module.
var bookings = angular.module('bookings', ['ngRoute']);

/**
 * Bookings config
 * @param $routeProvider
 */
bookings.config(function($routeProvider) {
	$routeProvider.when('/bookings', {
        templateUrl: 'components/reporting/bookings/partials/bookings-main.html',
        controller: 'bookingsCtrl'
    });
});

/**
 * Bookings factory
 * @param $http
 * @param $q
 */
bookings.factory('bookingsData', function($http, $q) {
	var url = 'https://jsonplaceholder.typicode.com';
    return {
        allPosts: function() {
            return $q.all([
                $http.get(url + '/posts')
            ]);
        },
        getKpi: function() {
            return $q.all([
                $http.get('http://localhost:8000/json/number_of_bookings.json')
            ]);
        }
    };
});

/**
 * BookingsKpiCtrl Controller.
 * @param $scope
 * @param Data
 */
bookings.controller('bookingsKpiCtrl', function($scope, bookingsData) {
    bookingsData.getKpi().then(function(data) {
        var obj = data[0];
        $scope.kpis = obj.data;
    });

    // Change KPI.
    $(".change-kpi").click(function() {
        $('#change-kpi-modal').modal('show');
    });
});

/**
 * BookingsCtrl controller.
 * @param $scope
 * @param Data
 */
bookings.controller('bookingsCtrl', function($scope, bookingsData) {
	bookingsData.allPosts().then(function(data) {
		$scope.posts = data[0];
		$('#data').append('<pre>'+JSON.stringify($scope.posts, null,"    ")+'</pre>');
	});
});