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

    if (S_PersonalData.s_getPersonalData().isLogin == 'yes') {
        $scope.name = S_PersonalData.s_getPersonalData().name;
        $scope.email = S_PersonalData.s_getPersonalData().email;
        $scope.profileURL = S_PersonalData.s_getPersonalData().profile;
    } else {
        $location.path("/");
    }

    // Pull up divider
    $('.pull-up a').click(function(event) {
        event.preventDefault();
        
        $('.pull-up').toggleClass('closed');

        if ($('.pull-up i').hasClass('fa-chevron-down')) {
             $('.kpi-container').fadeOut(200,'linear');
            $('.pull-up i').removeClass('fa-chevron-down').addClass('fa-chevron-up');
        } else {
             $('.kpi-container').fadeIn(200,'linear');
            $('.pull-up i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
        }
    });

    // Get all KPIs
	$q.all([
        $http.get('/json/kpis.json')
    ]).then(function(data) {
		$scope.kpis = data[0].data.kpis;
	});
});