// Define module.
var paxportApp = angular.module('paxportal', ['ngRoute','shared','dashboard','reporting','bookings','jira']);

// PaxportApp Route.
paxportApp.config(function($routeProvider) {
    $routeProvider
    .when('/dashboard', {
        templateUrl: 'components/dashboard/dashboard-partial/dashboard-partial.html',
        controller: 'dashboardCtrl'
    })
    .otherwise({
        redirect: '/'
    });
});

/**
 * run function
 * @param {!angular.$rootScope} $rootScope
 */
paxportApp.run(function($rootScope) {

    $rootScope.safeApply = function(fn) {
        var phase = $rootScope.$$phase;
        if (phase === '$apply' || phase === '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };
});
