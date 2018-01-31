// Define bookings module.
var bookings = angular.module('bookings', ['ngRoute']);

// Module constants.
bookings.constant('PARTIALS_DIR','components/reporting/bookings/partials/');

/**
 * Bookings config
 * @param PARTIALS_DIR
 * @param $routeProvider
 */
bookings.config(function(PARTIALS_DIR, $routeProvider, $locationProvider) {
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
 bookings.controller('bookingsSummaryCtrl', function($http, $q, $scope, bookingsData, $routeParams, $timeout, $location, countPassengersService, itemService, iconService) {

    /**
     * getBookingSummary().
     * @param bookingId,
     * @param routeParamExists
     */
    function getBookingSummary(bookingId, routeParamExists) {
        $scope.loaded = false;
        $scope.routeParams = routeParamExists;
        $location.update_path('/bookings/'+bookingId);

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

    if ($routeParams.bookingId) {
        getBookingSummary($routeParams.bookingId, true);
    }

    $scope.$on('getBookingSummary', function(event, bookingId) {
        getBookingSummary(bookingId, false);
    });

    /**
     * $scope.backToBookings().
     */
    $scope.backToBookings = function() {
        if ($routeParams.bookingId) {
            $location.path('/bookings');
        } else {
            $location.update_path('/bookings', true);
            itemService.closeItem('booking-summary');
        }
    };

    /**
     * $scope.downloadPdf().
     */
    $scope.downloadPDF = function() {
        var costTotal = 0;
        var costQuantityTotal = 0;
        var flightLegs = [];
        var passengerDetails = [];
        var costDetails = [
            [
                {text: 'Supplier', style: 'tableHeader'},{text: 'Description', style: 'tableHeader'}, 
                {text: 'Quantity', style: 'tableHeader'},{text: 'Unit Cost', style: 'tableHeader'},
                {text: 'Total Cost', style: 'tableHeader'}
            ]
        ];

        angular.forEach($scope.bookingSummaryData.attributes.flightDetails.legs, function(value, index) {
            flightLegs.push(
                [
                    {text: 'Leg '+ (index+1), style: 'tableHeader', colSpan: 4}, {}, 
                    {}, {}
                ],
                [
                    {text: 'Designation:', style: 'tableLabel'}, {text: value.segments[0].designation+' - '+value.segments[0].carrier}, 
                    {text: 'Class:', style: 'tableLabel'}, {text: value.segments[0].class}
                ],
                [
                    {text: 'Origin:', style: 'tableLabel'}, {text: value.segments[0].origin}, 
                    {text: 'Start:', style: 'tableLabel'}, {text: value.segments[0].start}
                ],
                [
                    {text: 'Destination:', style: 'tableLabel'}, {text: value.segments[0].destination}, 
                    {text: 'End:', style: 'tableLabel'}, {text: value.segments[0].end}
                ]
            );
        });

        angular.forEach($scope.bookingSummaryData.attributes.paxDetails, function(value, index) {
            passengerDetails.push(
                [
                    {text: value.title+' '+value.firstName+' '+value.surname, style: 'tableHeader', colSpan: 4}, {}, 
                    {}, {}
                ],
                [
                    {text: 'Type:', style: 'tableLabel'}, {text: value.type}, 
                    {text: 'DOB:', style: 'tableLabel'}, {text: value.dob}
                ],
                [
                    {text: 'Insurer:', style: 'tableLabel'}, {text: value.insurer}, 
                    {text: 'Nationality:', style: 'tableLabel'}, {text: value.nationality}
                ],
                [
                    {text: 'Foid Type:', style: 'tableLabel'}, {text: value.foidType}, 
                    {text: 'Folid Number:', style: 'tableLabel'}, {text: value.foidNumber}
                ]
            );
        });

        angular.forEach($scope.bookingSummaryData.attributes.costDetails, function(value, index) {
            costDetails.push(
                [
                    {text: value.supplier}, {text: value.description}, {text: value.quantity}, 
                    {text: '('+value.price.currencyCode+') '+value.price.value}, {text: '('+value.price.currencyCode+') '+value.price.value}
                ]
            );

            costTotal = (costTotal+value.price.value);
            costQuantityTotal = (costQuantityTotal+value.quantity);
        });

        costDetails.push(
            [
                {}, {text: 'Total:', style: 'tableLabel'}, {text: costQuantityTotal, style: 'tableLabel' },
                {text: costTotal, style: 'tableLabel'}, {text: costTotal, style: 'tableLabel'}
            ]
        );

        var docDefinition = {
            header: function(currentPage, pageCount, pageSize) {
                return [
                    {
                        style: 'table',
                        margin: [70,20],
                        table: {
                            widths: ['*', '*'],
                            headerRows: 0,
                            body: [
                                [
                                    {text: 'Booking Summary', style: 'topHeader', alignment: 'left'},
                                    {
                                        image: 'data:image/jpeg;base64,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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB//2Q==',
                                        width: 150,
                                        alignment: 'right'
                                    }
                                ]
                            ]
                        },
                        layout: 'noBorders'
                    }
                ]
            },
            footer: function(currentPage, pageCount) { 
                return [
                    {text: currentPage.toString() + ' of ' + pageCount, alignment: 'center'}
                ]
            },
            content: [
                {
                    style: 'table',
                    table: {
                        widths: ['*','*', '*', '*'],
                        heights: [18],
                        headerRows: 1,
                        body: [
                            [
                                {text: $scope.bookingSummaryData.attributes.paxDetails[0].title+' '+$scope.bookingSummaryData.attributes.paxDetails[0].firstName+' '+$scope.bookingSummaryData.attributes.paxDetails[0].surname, 
                                style: 'tableHeader', colSpan: 4}, {}, {}, {}
                            ],
                            [
                                {text: 'Type:', style: 'tableLabel'}, {text: 'Flight'}, 
                                {text: 'Verified:', style: 'tableLabel'}, {text: 'Yes'}
                            ],
                            [
                                {text: 'Fab ID:', style: 'tableLabel'}, {text: $scope.bookingSummaryData.attributes.references.bookingid.fab}, 
                                {text: 'Supplier ID:', style: 'tableLabel'}, {text: $scope.bookingSummaryData.attributes.references.bookingid.easyJet}
                            ],
                            [
                                {text: 'Session ID:', style: 'tableLabel'}, {text: $scope.bookingSummaryData.attributes.references.sessionid}, 
                                {text: 'Booking ID:', style: 'tableLabel'}, {text: $scope.bookingSummaryData.id}
                            ],
                            [
                                {text: 'Departing:', style: 'tableLabel'}, {text: 'A date should go here' }, 
                                {text: 'Passengers:', style: 'tableLabel'}, {text: $scope.bookingSummaryData.attributes.passengers.adult+' Adults '+$scope.bookingSummaryData.attributes.passengers.infant+' Infants'}
                            ],
                            [
                                {text: 'Card Name:', style: 'tableLabel'}, {text: $scope.bookingSummaryData.attributes.paymentDetails.cardHolder}, 
                                {text: 'First 4 Digits:', style: 'tableLabel'}, {text: $scope.bookingSummaryData.attributes.paymentDetails.cardNumber}
                            ],
                        ]
                    },
                    layout: {
                        paddingLeft: function(i, node) { return 8; },
                        paddingRight: function(i, node) { return 8; },
                        paddingTop: function(i, node) { return 6; },
                        paddingBottom: function(i, node) { return 6; }
                    }
                },
                {
                    style: 'tableSplit',
                    table: {
                        widths: [20, '*'],
                        headerRows: 0,
                        body: [
                            [
                                {text: iconService.findSymbolForClass('fa-plane'), style: 'fontAwesome', fontSize: 18, margin: [0, 10, 0, 30]},
                                {text: 'Flight Details', style: 'header'},
                            ]
                        ]
                    },
                    layout: 'noBorders'
                },
                {
                    style: 'table',
                    table: {
                        widths: ['*', '*', '*', '*'],
                        headerRows: 0,
                        body: [
                            [
                                {text: 'Party:', style: 'tableLabel'}, {text: $scope.bookingSummaryData.attributes.flightDetails.party}, 
                                {text: 'Product:', style: 'tableLabel'}, {text: $scope.bookingSummaryData.attributes.flightDetails.product}
                            ],
                            [
                                {text: 'Created:', style: 'tableLabel'}, {text: $scope.bookingSummaryData.attributes.flightDetails.systemData.created}, 
                                {text: 'Carrier:', style: 'tableLabel'}, {text: $scope.bookingSummaryData.attributes.flightDetails.marketingCarrier}
                            ]
                        ]
                    },
                    layout: {
                        paddingLeft: function(i, node) { return 8; },
                        paddingRight: function(i, node) { return 8; },
                        paddingTop: function(i, node) { return 6; },
                        paddingBottom: function(i, node) { return 6; }
                    }
                },
                {
                    style: 'table',
                    table: {
                        widths: ['*', '*', '*', '*'],
                        heights: [18],
                        headerRows: 0,
                        body: flightLegs
                    },
                    layout: {
                        paddingLeft: function(i, node) { return 8; },
                        paddingRight: function(i, node) { return 8; },
                        paddingTop: function(i, node) { return 6; },
                        paddingBottom: function(i, node) { return 6; }
                    }
                },
                {
                    style: 'tableSplit',
                    table: {
                        widths: [20, '*'],
                        headerRows: 0,
                        body: [
                            [
                                {text: iconService.findSymbolForClass('fa-user-circle-o'), style: 'fontAwesome', fontSize: 17, margin: [0, 8, 0, 30]},
                                {text: 'Passenger Details', style: 'header'},
                            ]
                        ]
                    },
                    layout: 'noBorders'
                },
                {
                    style: 'table',
                    table: {
                        widths: ['*', '*', '*', '*'],
                        heights: [18],
                        headerRows: 0,
                        body: passengerDetails
                    },
                    layout: {
                        paddingLeft: function(i, node) { return 8; },
                        paddingRight: function(i, node) { return 8; },
                        paddingTop: function(i, node) { return 6; },
                        paddingBottom: function(i, node) { return 6; }
                    }
                },
                {
                    style: 'tableSplit',
                    table: {
                        widths: [20, '*'],
                        headerRows: 0,
                        body: [
                            [
                                {text: iconService.findSymbolForClass('fa-money'), style: 'fontAwesome', fontSize: 18, margin: [0, 10, 0, 30]},
                                {text: 'Cost Details', style: 'header'},
                            ]
                        ]
                    },
                    layout: 'noBorders'
                },
                {
                    style: 'table',
                    table: {
                        widths: ['*', '*', '*', '*', '*'],
                        heights: [18],
                        headerRows: 1,
                        body: costDetails
                    },
                    layout: {
                        paddingLeft: function(i, node) { return 8; },
                        paddingRight: function(i, node) { return 8; },
                        paddingTop: function(i, node) { return 6; },
                        paddingBottom: function(i, node) { return 6; }
                    }
                },
            ],
            pageSize: 'A4',
            pageMargins: 72,
            styles: {
                fontAwesome: {
                    font: 'FontAwesome',
                    bold: true,
                    alignment: 'left'
                },
                topHeader: {
                    fontSize: 20,
                    bold: true,
                    margin: [0, 6, 0, 30],
                    alignment: 'left'
                },
                header: {
                    fontSize: 16,
                    bold: true,
                    margin: [0, 10, 0, 15],
                    alignment: 'left'
                },
                table: {
                    fontSize: 8,
                    alignment: 'left',
                    color: 'black',
                    margin: [0, 5, 0, 15]
                },
                tableSplit: {
                    fontSize: 8,
                    alignment: 'left',
                    color: 'black',
                    margin: [0, -3, 0, -10]
                },
                tableHeader: {
                    fontSize: 14,
                    bold: true,
                },
                tableLabel: {
                    bold: true,
                }
            }
        };

        pdfMake.createPdf(docDefinition).download();
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