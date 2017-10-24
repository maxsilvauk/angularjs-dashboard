// Define shared module.
var shared = angular.module('shared', []);

/**
 * navCtrl Controller.
 * @param $scope
 * @param $location
 */
shared.controller('navCtrl', function($scope, $location) {

	// Controler vars.
	var nav = '.site-nav';

	// isActive function.
	$scope.isActive = function (viewLocation) {
		// Return location path.
        return viewLocation === $location.path();
    };


    // Hamburger icon event listener.
    $('#nav-toggle i').click(function() {
		$(nav+'.site-nav').toggleClass('condensed');
		$('#right').toggleClass('condensed');

		// Open nav.
		if (!$(nav).hasClass('condensed')) {
			$('#nav-toggle i').removeClass('fa-chevron-circle-right').addClass('fa-chevron-circle-left');

			var fadeInNav = function() {
				$(nav+' ul li span').removeClass('hide');
			};

			setTimeout(fadeInNav, 200);

		// Condense nav.
		} else {
			$(nav+' ul li span').addClass('hide');
			$('#nav-toggle i').removeClass('fa-chevron-circle-left').addClass('fa-chevron-circle-right');
		}
	});
});