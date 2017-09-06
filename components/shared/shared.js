// Define shared module.
var shared = angular.module('shared', []);

/**
 * navCtrl Controller.
 * @param $scope
 * @param $location
 */
shared.controller('navCtrl', function($scope, $location) {
	$scope.isActive = function (viewLocation) {

		// Set hamburger icon to open. 
		$('#hamburger-icon').addClass('open');

		// Return location path.
        return viewLocation === $location.path();
    };

    // Toggle hamburger icon on click.
    $('#hamburger-icon').click(function() {
		$(this).toggleClass('open');
	});
});