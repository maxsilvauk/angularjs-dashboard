// Define bookings module.
var bookings = angular.module('bookings', ['ngRoute']);

// Module constants.
bookings.constant('PARTIALS_DIR','components/reporting/bookings/partials/');

/**
 * Bookings config
 * @param PARTIALS_DIR
 * @param $routeProvider
 */
bookings.config(function(PARTIALS_DIR, $routeProvider) {
    $routeProvider.when('/bookings', {
        templateUrl: PARTIALS_DIR+'bookings-main.html'
    });

    $routeProvider.when('/bookings/:bookingId', {
        templateUrl: PARTIALS_DIR+'bookings-summary.html'
    });

    $routeProvider.when('/booking/:bookingId', {
        templateUrl: PARTIALS_DIR+'bookings-summary.html'
    });    
});

/**
 * filterByDate directive
 */
bookings.directive('filterByDate', ['PARTIALS_DIR', function(PARTIALS_DIR, $rootScope) {
    return {
        controller: function($scope, $rootScope) {
            $scope.setData = function(startDate, endDate, $event) {
                $rootScope.startDate = startDate;
                $rootScope.endDate = endDate;

                $rootScope.$emit('getBookings');
                //$rootScope.$emit('getKpiList');
                //filterByDateService.getData(startDate, endDate);
                
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
 * bookingService
 * @param paxDetails
 */
paxportApp.service('bookingService', function () {
    function getData(paxDetails) {
        var passengers = { 
            adult: 0, 
            infant: 0
        };

        angular.forEach(paxDetails, function(value, key) {
            switch(value.type) {
                case 'ADULT':
                    passengers.adult++;
                break;
                case 'INFANT':
                    passengers.infant++;
                break;
            }
        });
        return passengers;
    }

    return {
        getData: getData
    };
});

/**
 * Bookings factory
 * @param API_URL
 * @param $http
 * @param $q
 * @param $rootScope
 */
bookings.factory('bookingsData', function(API_URL, $http, $q, $rootScope) {
    return {
        getBookings: function() {
            return $q.all([
                // This requires an update to search between start and end. 
                $http.get(API_URL+'/bookings/'+$rootScope.startDate)
            ]);
        },
        getBookingSummary: function(bookingId) {
            return $q.all([
                $http.get(API_URL+'/booking/'+bookingId)
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
 * BookingsKpiCtrl controller.
 * @param $scope
 * @param $rootScope
 * @param $timeout
 * @param bookingsData
 */
bookings.controller('bookingsKpiCtrl', function($scope, $rootScope, $timeout, bookingsData) {
    /**
     * getKpiList method.
     */
    function getKpiList() {
        $scope.loaded = false;
       
        bookingsData.getKpiList().then(function(data) {
            $scope.kpis = data[0].data;

            // Loading functionality (Requires an upate this is a prototype fix.)
            var timer = function() {
                $scope.loaded = true;
            };

            $timeout(timer, 2000);
            // End loading functionality 

        }).catch(function() {
            // log error message to an api or db?
            // Give the user feedback the error message
        });
    }

    $rootScope.$on('getKpiList', function() {
        getKpiList();
    });

    getKpiList();
});

/**
 * BookingsSummaryCtrl controller.
 * @param $http
 * @param $q
 * @param $scope
 * @param bookingsData
 * @param $routeParams
 * @param $timeout
 * @param $location
 * @param countPassengerSerivce
 * @param itemSerivce 
 */
 bookings.controller('bookingsSummaryCtrl', function($http, $q, $scope, bookingsData, $routeParams, $timeout, $location, countPassengersService, itemService) {
    $scope.loaded = false;
    $scope.routeParams = false;

    if ($routeParams.bookingId) {
        $scope.routeParams = true;
        getBookingSummary($routeParams.bookingId);
    }

    function getBookingSummary(bookingId) {
        bookingsData.getBookingSummary(bookingId).then(function(data) {
            // Add passengers object to data object.
            data[0].data.attributes.passengers = countPassengersService.getData(data[0].data.attributes.paxDetails);
            $scope.bookingSummaryData = data[0].data;

            // Loading functionality (Requires an upate this is a prototype fix.)
            var timer = function() {
                $scope.loaded = true;
            };

            $timeout(timer, 2000);
            // End loading functionality

            itemService.showItem('booking-summary', bookingId);
        }).catch(function() {
            // log error message to an api or db?
            // Give the user feedback the error message
        });
    }

    $scope.$on('getBookingSummary', function(event, bookingId) {
        getBookingSummary(bookingId);
    });

    /**
     * $scope.backToBookings().
     */
    $scope.backToBookings = function() {
        if ($routeParams.bookingId) {
            $location.path('/bookings');
        } else {
            itemService.closeItem('booking-summary');
        }
    };
});

/**
 * BookingsCtrl controller.
 * @param $http
 * @param $q
 * @param $scope
 * @param bookingsData
 * @param $rootScope
 * @param $timeout
 */
bookings.controller('bookingsCtrl', function($http, $q, $scope, bookingsData, $rootScope, $timeout, countPassengersService, itemService, PARTIALS_DIR) {
    $scope.showBookingSummary = false;
    $scope.optionBtn = false;
    $scope.loaded = false;

    $('body').click(function() {
        if ($('.header-options').hasClass('open')) {
            $('.dropdown-toggle').removeClass('active');
        }
    });

    /**
     * getBookings().
     */
    function getBookings() {
        $scope.loaded = false;

        bookingsData.getBookings().then(function(data) {
            angular.forEach(data[0].data, function(value, key) {
                value.attributes.passengers = countPassengersService.getData(value.attributes.paxDetails);
            });

            $scope.bookings = data[0].data;

            // Loading functionality (Requires an upate this is a prototype fix.)
            var timer = function() {
                $scope.loaded = true;
            };

            $timeout(timer, 2000);
            // End loading functionality 

        }).catch(function() {
            // log error message to an api or db?
            // Give the user feedback the error message
        });

        /**
         * $scope.getBookingSummary().
         * @param bookingId
         */
        $scope.getBookingSummary = function(bookingId) {
            $scope.$broadcast('getBookingSummary', bookingId);
            itemService.showItem('booking-summary', bookingId);
        };
    }

    $rootScope.$on('getBookings', function() {
        getBookings();
    });

    getBookings();
});