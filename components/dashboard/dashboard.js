// Define Dashboard module.
var dashboard = angular.module('dashboard', ['ngRoute']);

/**
 * Dashboard config
 * @param $routeProvider
 */
dashboard.config(function($routeProvider) {
	$routeProvider.when('/', {
        templateUrl: 'components/dashboard/partials/dashboard-main.html',
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

    console.log('dashboardCtrl', filterByDateService.getData())

    // Get KPI List.
    dashboardData.getKpiList().then(function(data) {
        $scope.kpis = data[0].data.kpis;
    });
});