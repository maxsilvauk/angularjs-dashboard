// Define module
var paxportApp = angular.module('paxportal', ['ngRoute','shared','dashboard','reporting','bookings','jira']);

// Constants
paxportApp.constant('apiURL','https://jsonplaceholder.typicode.com/posts/')

// $rootScope stuff
paxportApp.run(
    function($rootScope) {
        $rootScope.startDate = '';
        $rootScope.endDate = '';
    }
);

/**
 * divider directive
 */
paxportApp.directive('divider', function() {
    return {
        template: '<div class="pull-up"><a href="#"><i class="fa fa-chevron-down" aria-hidden="true"></i></a></div>',
            controller: function () {
            $('.pull-up a').click(function(event) {
                event.preventDefault();
                $('.pull-up').toggleClass('closed');
                if ($('.pull-up i').hasClass('fa-chevron-down')) {
                    $('.kpi-container').fadeOut(200,'linear');
                    $('.pull-up i').removeClass('fa-chevron-down').addClass('fa-chevron-up');
                } else {
                    $('.kpi-container').fadeIn(200,'linear');
                    $('.pull-up i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
                }
            });
        }
    };
});


/**
 * For checking href tags adding preventDefault behaviour directive
 */
paxportApp.directive('a', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if(attrs.ngClick || attrs.href === '' || attrs.href === '#'){
                elem.on('click', function(e){
                    e.preventDefault();
                });
            }
        }
   };
});

/**
 * showModal directive.
 */
paxportApp.directive('showModal', function() {
    return {
        template: '<div class="change-kpi"></div>',
        controller: function () {
            $(".change-kpi").click(function() {
                $('#change-kpi-modal').modal('show');
            });
        }
    };
});

/**
 * filterByDateService
 * @param $rootScope
 */
paxportApp.service('filterByDateService', function ($rootScope) {
    var filterDatesObj = { 
        startDate: '',
        endDate: ''
    };

    $rootScope.$watchGroup(['startDate','endDate'], function() {
        filterDatesObj.startDate = $rootScope.startDate;
        filterDatesObj.endDate = $rootScope.endDate;

        // We need to call the api and handle the rest in here.
        //console.log('filterDatesObj', filterDatesObj);
    });

    function getData(date) {
        return filterDatesObj;
    };

    function setData(date) {
        
    }

    return {
        getData: getData,
        setData: setData
    };
});

/**
 * config function
 * @param $routeProvider
 */
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
 * @param $rootScope
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
