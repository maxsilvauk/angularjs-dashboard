var shared = angular.module('shared', []);

shared.config(function($routeProvider) {

    /* Add New Routes Above */

});

shared.controller('navCtrl', function($scope, $location) {
	$scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };
});