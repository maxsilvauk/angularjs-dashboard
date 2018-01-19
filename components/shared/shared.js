// Define shared module.
var shared = angular.module('shared', []);

/**
 * navCtrl Controller.
 * @param $scope
 * @param $location
 */
shared.controller('navCtrl', function($scope, $location, itemService) {

	/**
     * $scope.isActive().
     */
	$scope.isActive = function (viewLocation) {
		// Return location path.
        return viewLocation === $location.path();
    };

	/**
     * $scope.navToggle().
     */
    $scope.navToggle = function () {
		$('.site-nav, #right, .overlay').toggleClass('condensed');

		// Open nav.
		if (!$('.site-nav').hasClass('condensed')) {
			$('#nav-toggle i').removeClass('fa-chevron-circle-right').addClass('fa-chevron-circle-left');

			var fadeInNav = function() {
				$('.site-nav ul li span').removeClass('hide');
			};

			setTimeout(fadeInNav, 200);

		// Condense nav.
		} else {
			$('.site-nav ul li span').addClass('hide');
			$('#nav-toggle i').removeClass('fa-chevron-circle-left').addClass('fa-chevron-circle-right');
		}
	};

	/**
     * $scope.bookingsLink().
     */
    $scope.bookingsLink = function() {
		if ($('#booking-summary').length) {
			itemService.closeItem('booking-summary');
		} else {
			$location.path( "/bookings" );
		}
    };
});