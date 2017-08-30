// Define module
var supplierStatus = angular.module('supplierStatus', ['ngRoute']);

// Module routes
supplierStatus.config(function($routeProvider) {

	$routeProvider.when('/supplier-status', {
        templateUrl: 'components/reporting/supplier-status/supplier-status.html',
        controller: 'supplierStatusController'
    });

});

/**
 * Supplier Status controller.
 * @param {!angular.$scope} $scope
 */
supplierStatus.controller('supplierStatusController', function($scope) {
	console.log('supplier-status.js', 'Loaded');
});