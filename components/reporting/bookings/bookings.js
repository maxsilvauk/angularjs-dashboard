// Define bookings module.
var bookings = angular.module('bookings', ['ngRoute']);

/**
 * filterByDate directive
 */
bookings.directive("filterByDate", function($rootScope) {
    return {
        controller: function($scope, filterByDateService) {
            $scope.setData = function(date='') {
                $rootScope.startDate = date;
                $rootScope.endDate = date;

                filterByDateService.getData(date);
                $rootScope.$emit("getBookings");
            }
        },
        restrict: 'E',
        transclude: true,
        template: '<button type="button" class="btn btn-primary" ng-click="setData(1)">1st Booking</button> <button type="button" class="btn btn-primary" ng-click="setData()">All Bookings</button>'
    }
});

/**
 * Bookings config
 * @param $routeProvider
 */
bookings.config(function($routeProvider) {
	$routeProvider.when('/bookings', {
        templateUrl: 'components/reporting/bookings/partials/bookings-main.html'
    });
});

/**
 * Bookings factory
 * @param $http
 * @param $q
 */
bookings.factory('bookingsData', function(apiURL, $http, $q, $rootScope) {
    return {
        getPosts: function() {
            return $q.all([
                $http.get(apiURL+$rootScope.startDate)
            ]);
        },
        getKpiList: function() {
            return $q.all([
                $http.get('/json/number_of_bookings.json')
            ]);
        }
    };
});

/**
 * BookingsKpiCtrl Controller.
 * @param $scope
 * @param Data
 */
bookings.controller('bookingsKpiCtrl', function($scope, $rootScope, bookingsData, filterByDateService) {
    bookingsData.getKpiList().then(function(data) {
        $scope.kpis = data[0].data;
    });
});

/**
 * BookingsCtrl controller.
 * @param $scope
 * @param Data
 */
bookings.controller('bookingsCtrl', function($http, $q, $scope, bookingsData, filterByDateService, $rootScope) {
    function getBookings() {
        bookingsData.getPosts().then(function(data) {
            $scope.posts = data[0];
            $('#data').empty().append('<pre>'+JSON.stringify($scope.posts, null,"    ")+'</pre>');
        });
    }

    $rootScope.$on("getBookings", function() {
        getBookings();
    });

    getBookings();
});