// Define bookings module.
var bookings = angular.module('bookings', ['ngRoute']);

bookings.constant('PARTIALS_DIR','components/reporting/bookings/partials/');

/**
 * filterByDate directive
 */
bookings.directive('filterByDate', ['PARTIALS_DIR', function(PARTIALS_DIR, $rootScope) {
    return {
        controller: function($scope, $rootScope, filterByDateService) {
            $scope.setData = function(startDate, endDate, $event) {
                $rootScope.startDate = startDate;
                $rootScope.endDate = endDate;
                $rootScope.$emit('getKpiList');
                $rootScope.$emit('getBookings');
                filterByDateService.getData(startDate, endDate);
                
                if (!$(event.target).hasClass('selected')) {
                    $('#filter-by-date .btn').each(
                        function(i, e) { 
                            $(e).removeClass('selected');
                        }
                    );
                    $(event.target).addClass('selected');
                }
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
        getBookings: function() {
            return $q.all([
                $http.get(API_URL+'/bookings/'+$rootScope.startDate)
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
bookings.controller('bookingsKpiCtrl', function($scope, $rootScope, $timeout, bookingsData, filterByDateService) {

    function getKpiList() {
        $scope.loaded = false;
       
        bookingsData.getKpiList().then(function(data) {
            $scope.kpis = data[0].data;

            var timer = function() {
                $scope.loaded = true;
            };

            $timeout(timer, 2000);

        }).catch(function() {
            $('loading-icon').html('<div class="loading-error"><i class="fa fa-exclamation-circle" aria-hidden="true"></i><br/>Request could not be executed!</div>');
        });
    }

    $rootScope.$on('getKpiList', function() {
        getKpiList();
    });

    getKpiList();
});

/**
 * BookingsCtrl controller.
 * @param $scope
 * @param Data
 */
bookings.controller('bookingsCtrl', function($http, $q, $scope, bookingsData, filterByDateService, $rootScope) {

    $scope.optionBtn = false;

    $('body').click(function() {
        if ($('.header-options').hasClass('open')) {
            $('.dropdown-toggle').removeClass('active');
        }
    });

    function getBookings() {
        $scope.loaded = false;

        bookingsData.getBookings().then(function(data) {

            $scope.bookings = data[0].data;

            angular.forEach(data[0].data, function(value, key) {

                var passengers = { adult: 0, infant: 0 };

                angular.forEach(value.attributes.paxDetails, function(value, key) {
                    switch(value.type) {
                        case 'ADULT':
                            passengers.adult++;
                        break;
                        case 'INFANT':
                            passengers.infant++;
                        break;
                    }
                });

                value.attributes.passengers = passengers;
            });

            $scope.bookings = data[0].data;

            //$scope.loaded = true;
        }).catch(function() {

        });
    }

    $rootScope.$on('getBookings', function() {
        getBookings();
    });

    getBookings();
});