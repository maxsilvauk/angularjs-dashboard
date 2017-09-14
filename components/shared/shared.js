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
		// Set hamburger icon to open & return location path.
		$('#hamburger-icon').addClass('open');
        return viewLocation === $location.path();
    };

    // Hamburger icon event listener.
    $('#hamburger-icon').click(function() {
		$(nav+'.site-nav').toggleClass('condensed');

		// Open nav.
		if (!$(nav).hasClass('condensed')) {
			$(nav).removeClass('col-lg-1').addClass('col-lg-2');
			$('.site-container #right').removeClass('col-lg-11').addClass('col-lg-10');

			var fadeInNav = function() {
				$(nav+' ul li span').removeClass('hide');
			};

			setTimeout(fadeInNav, 200);

		// Condense nav.
		} else {
			$(nav+' ul li span').addClass('hide');
			$(nav).removeClass('col-lg-2').addClass('col-lg-1');
			$('.site-container #right').removeClass('col-lg-10').addClass('col-lg-11');
		}
	});
});