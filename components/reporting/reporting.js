// Define reporting module
var reporting = angular.module('reporting', ['ngRoute']);

/**
 * Reporting config
 * @param $routeProvider
 */
reporting.config(function($routeProvider) {

	$routeProvider.when('/reporting', {
        templateUrl: 'components/reporting/partials/reporting-main.html',
        controller: 'reportingCtrl'
    });
});

/**
 * Reporting factory
 * @param $http
 * @param $q
 */
reporting.factory('Data', function($http, $q) {
	var url = 'https://jsonplaceholder.typicode.com';
    return {
        allPosts: function() {
            return $q.all([
                $http.get(url + '/users')
            ]);
        },
    };
});

/**
 * Reporting controller.
 * @param $scope
 * @param Data
 */
reporting.controller('reportingCtrl', function($scope, Data) {
	Data.allPosts().then(function(data) {
		$scope.posts = data[0];
		$('.data').append('<pre>'+JSON.stringify($scope.posts, null,"    ")+'</pre>');
	});
});