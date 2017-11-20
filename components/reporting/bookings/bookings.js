// Define bookings module.
var bookings = angular.module('bookings', ['ngRoute']);

bookings.constant('PARTIALS_DIR','components/reporting/bookings/partials/');

/**
 * filterByDate directive
 */
bookings.directive("filterByDate", ['PARTIALS_DIR', function(PARTIALS_DIR, $rootScope) {
    return {
        controller: function($scope, $rootScope, filterByDateService) {
            $scope.setData = function(startDate, endDate, $event) {
                $rootScope.startDate = startDate;
                $rootScope.endDate = endDate;
                filterByDateService.getData(startDate, endDate);
                $rootScope.$emit("getBookings");

                if (!$(event.target).hasClass('selected')) {
                    $("#filter-by-date .btn").each(
                        function(i, ele) {
                            $(ele).removeClass('selected');
                        }
                    );
                    $(event.target).addClass('selected');
                };
            };
        },
        restrict: 'E',
        templateUrl: PARTIALS_DIR+'bookings-filter-by-date.html'
    };
}]);

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
bookings.factory('bookingsData', function(API_URL, $http, $q, $rootScope) {
    return {
        getPosts: function() {
            return $q.all([
                $http.get(API_URL+$rootScope.startDate)
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