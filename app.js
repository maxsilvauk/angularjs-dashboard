// Define module.
var paxportApp = angular.module('paxportal', ['ngRoute','ngLocationUpdate','ngAnimate','ui.bootstrap','shared','dashboard','reporting','bookings','jira']);

// Constants.
paxportApp.constant('API_URL','http://localhost:3000');

/**
 * Config
 * param $locationProvider
 */
// paxportApp.config(function($locationProvider) {
//     $locationProvider.html5Mode(true);
// });

// $rootScope Run.
paxportApp.run(
    function($rootScope) {
        $rootScope.startDate = '';
        $rootScope.endDate = '';
    }
);

/**
 * loadingIcon Directive
 */
paxportApp.directive('loadingIcon', function() {
    return {
        template: '<div class="spinner"></div>'
    };  
});

/**
 * divider Directive.
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
 * showModal Directive.
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
 * filterByDateService Service
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

    /**
     * getData()
     * @param date
     */
    function getData(date) {
        return filterByDatesObj;
    }

    return {
        getData: getData
    };
});

/**
 * countPassengersService Service
 * @param paxDetails
 */
paxportApp.service('countPassengersService', function () {
    /**
     * getData()
     * @param paxDetails
     */
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
 * itemService Service.
 */
paxportApp.service('itemService', function () {
    /**
     * showItem()
     * @param itemName
     * @param itemId
     */
    function showItem(itemName, itemId) {
        $('body').css('overflow-y','hidden');
        $('#'+itemName).addClass('active');
        $('#'+itemName).css('overflow','scroll').css('overflow-x','hidden');
    }

    /**
     * closeItem()
     * @param itemName
     */
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
 * fontAwesome Service.
 */
paxportApp.service('iconService', function() {
    /**
     * stripQuotes()
     * @param string
     */
    function stripQuotes(string) {
        var len = string.length;
        return string.slice(1, len - 1);
    }

    /**
     * findCSSRuleContent()
     * @param mySheet
     * @param selector
     */
    function findCSSRuleContent(mySheet, selector) {
        var ruleContent = '';
        var rules = mySheet.cssRules ? mySheet.cssRules : mySheet.rules;

        for (var i = 0; i < rules.length; i++) {
            var text = rules[i].selectorText;
            if (text && text.indexOf(selector) >= 0) {
                ruleContent = rules[i].style.content;
                break;
            }
        }
        
        return ruleContent;
    }

    /**
     * findSymbolForClass()
     * @param selector
     */
    function findSymbolForClass(selector) {
        var result = '';
        var sheets = document.styleSheets;

        for (var sheetNr = 0; sheetNr < sheets.length; sheetNr++) {
            var content = findCSSRuleContent(sheets[sheetNr], selector);

            if (content) {
                result = stripQuotes(content);
                break;
            }
        }
        return result;
    };

    return {
        findSymbolForClass: findSymbolForClass
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