angular.module('shared', ['ui.bootstrap','ngRoute','ngAnimate']);

angular.module('shared').config(function($routeProvider) {

    /* Add New Routes Above */

});

angular.module('shared').controller('navCtrl', function($scope, $location) {
	$scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };
});