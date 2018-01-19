// Define Dashboard module.
var dashboard = angular.module('dashboard', ['ngRoute']);

dashboard.constant('PARTIALS_DIR','components/dashboard/partials/');

/**
 * Dashboard config
 * @param PARTIALS_DIR
 * @param $routeProvider
 */
dashboard.config(function(PARTIALS_DIR, $routeProvider) {
	$routeProvider.when('/', {
        templateUrl: PARTIALS_DIR+'dashboard-main.html',
        controller: 'dashboardCtrl'
    });
});

/**
 * Dashboard factory
 * @param $http
 * @param $q
 */
dashboard.factory('dashboardData', function($http, $q) {
    return {
        getKpiList: function() {
            return $q.all([
                $http.get('/json/dashboard_kpis.json')
            ]);
        }
    };
});

/**
 * Dashboard controller.
 * @param $http
 * @param $q
 * @param $scope
 * @param dashboardData,
 * @param filteByDateService,
 * @param $timeout
 */
dashboard.controller('dashboardCtrl', function($http, $q, $scope, dashboardData, filterByDateService, $timeout) {
    $scope.loaded = false;
    
    // Get KPI List.
    dashboardData.getKpiList().then(function(data) {
        $scope.kpis = data[0].data.kpis;
    });

    // Loading functionality (Requires an upate this is a prototype fix.)
    var timer = function() {
        $scope.loaded = true;
    };

    $timeout(timer, 2000);
    // End loading functionality
});