// Define jira module.
var jira = angular.module('jira', []);

/**
 * Jira factory
 * @param $http
 * @param $q
 */
jira.factory('jiraData', function($http, $q) {
    var url = 'https://jsonplaceholder.typicode.com';
    return {
        getKpi: function() {
            return $q.all([
                $http.get('http://localhost:8000/json/jira_tickets.json')
            ]);
        }
    };
});

/**
 * JiraKpiCtrl Controller.
 * @param $scope
 * @param Data
 */
jira.controller('jiraKpiCtrl', function($scope, $timeout, jiraData) {

    function getKpiList() {
        $scope.loaded = false;
        
        jiraData.getKpi().then(function(data) {
            var obj = data[0];
            $scope.kpis = obj.data;
            
            var timer = function() {
                $scope.loaded = true;
            };

            $timeout(timer, 2000);

        }).catch(function() {
            $('loading-icon').html('<div class="loading-error"><i class="fa fa-exclamation-circle" aria-hidden="true"></i><br/>Request could not be executed!</div>');         
        });

        $(".change-kpi").click(function() {
            $('#change-kpi-modal').modal('show');
        });
    }

    getKpiList();

});
