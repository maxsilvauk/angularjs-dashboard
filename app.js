// Define module.
var paxportApp = angular.module('paxportal', ['ngRoute', 'reporting','bookings']);

// PaxportApp Route.
paxportApp.config(function($routeProvider) {
    $routeProvider
    .otherwise({
        redirectTo: '/'
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
