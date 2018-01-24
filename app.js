// define module.
var paxportApp = angular.module('paxportal', ['ngRoute','ngAnimate','ui.bootstrap','htmlToPdfSave','shared','dashboard','reporting','bookings','jira']);

// constants.
paxportApp.constant('API_URL','http://localhost:3000');

// $rootScope stuff.
paxportApp.run(
    function($rootScope) {
        $rootScope.startDate = '';
        $rootScope.endDate = '';
    }
);

/**
 * loading icon.
 */
paxportApp.directive('loadingIcon', function() {
    return {
        template: '<div class="spinner"></div>'
    }  
});

// paxportApp.directive('exportTable', function()) {
//     return {
//         restrict: 'C',
//         link: function(scope, elem, attrs) {
//             $scope.$on('export-pdf', function(e, d){
//                 elm.tableExport({type:'pdf', escape:false});
//             });
            
//             $scope.$on('export-excel', function(e, d){
//                    elm.tableExport({type:'excel', escape:false});
//             });
//         }
//     }
// });

/**
 * divider directive.
 */
paxportApp.directive('divider', function() {
    return {
        template: '<div class="pull-up"><a href="#"><i class="fa fa-chevron-down" aria-hidden="true"></i></a></div>',
            controller: function () {
            $('.pull-up a').hover(function(event) {
                if ($('.pull-up i').hasClass('fa-chevron-down')) {
                    $('.pull-up i').removeClass('fa-chevron-down').addClass('fa-chevron-up');
                } else {
                    $('.pull-up i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
                }
            });

            $('.pull-up a').click(function(event) {
                event.preventDefault();
                $('.pull-up').toggleClass('closed');
                if ($('.pull-up').hasClass('closed')) {
                    $('.kpis-container').fadeOut(200,'linear');
                    $('.pull-up i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
                } else {
                    $('.kpis-container').fadeIn(200,'linear');
                    $('.pull-up i').removeClass('fa-chevron-down').addClass('fa-chevron-up');
                }
            });
        }
    };
});

/**
 * For checking href tags adding preventDefault behaviour directive.
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
        template: '<div class="change-kpi"><i class="fa fa-cog fadeOut" aria-hidden="true" title="Update KPI"></i></div>',
        controller: function () {
            $('.change-kpi').click(function() {
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
    var filterByDatesObj = { 
        startDate: '',
        endDate: ''
    };

    $rootScope.$watchGroup(['startDate','endDate'], function() {
        filterByDatesObj.startDate = $rootScope.startDate;
        filterByDatesObj.endDate = $rootScope.endDate;
    });

    function getData(date) {
        return filterByDatesObj;
    }

    return {
        getData: getData
    };
});

/**
 * countPassengersService
 * @param paxDetails
 */
paxportApp.service('countPassengersService', function () {
    function getData(paxDetails) {
        var passengers = { 
            adult: 0, 
            infant: 0
        };

        angular.forEach(paxDetails, function(value, key) {
            switch(value.type) {
                case 'ADULT':
                    passengers.adult++;
                break;
                case 'INFANT':
                    passengers.infant++;
                break;
            }
        });
        return passengers;
    }

    return {
        getData: getData
    };
});

/**
 * showOverlayItemService
 * @param 
 */
paxportApp.service('itemService', function () {
    function showItem(itemName, itemId) {
        $('body').css('overflow-y','hidden');
        $('#'+itemName).addClass('active');
        $('#'+itemName).css('overflow','scroll').css('overflow-x','hidden');
    }

    function closeItem(itemName) {
        $('body').css('overflow-y','visible');
        $('#'+itemName).removeClass('active');
    }

    return {
        showItem: showItem,
        closeItem: closeItem
    };
});

/**
 * run function.
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