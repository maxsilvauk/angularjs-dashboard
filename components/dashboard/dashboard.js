// Define Dashboard module.
var dashboard = angular.module('dashboard', ['ngRoute']);

dashboard.constant('PARTIALS_DIR','components/dashboard/partials/');

/**
 * Dashboard config
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
 * @param Data
 */
dashboard.controller('dashboardCtrl', function($http, $q, $scope, dashboardData, filterByDateService) {
    // Get KPI List.
    dashboardData.getKpiList().then(function(data) {
        $scope.kpis = data[0].data.kpis;
    });
});