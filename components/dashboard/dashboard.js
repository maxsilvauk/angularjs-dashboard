// Define Dashboard module.
var dashboard = angular.module('dashboard', ['ngRoute']);

/**
 * Dashboard config
 * @param $routeProvider
 */
dashboard.config(function($routeProvider) {
	$routeProvider.when('/', {
        templateUrl: 'components/dashboard/dashboard-partial/dashboard-partial.html',
        controller: 'dashboardCtrl'
    });
});

/**
 * Dashboard factory
 * @param $http
 * @param $q
 */
dashboard.factory('Data', function($http, $q) {
	var url = 'https://jsonplaceholder.typicode.com';
    return {
        kpiList: function() {
            return $q.all([
                $http.get('http://localhost:8000/json/kpis.json')
            ]);
        },
    };
});

/**
 * Dashboard controller.
 * @param $http
 * @param $q
 * @param $scope
 * @param Data
 */
dashboard.controller('dashboardCtrl', function($http, $q, $scope, Data) {
	$q.all([
        $http.get('/json/kpis.json')
    ]).then(function(data) {
		$scope.kpis = data[0].data.kpis;
	});
});