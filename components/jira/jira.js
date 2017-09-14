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
jira.controller('jiraKpiCtrl', function($scope, jiraData) {
    jiraData.getKpi().then(function(data) {
        var obj = data[0];
        $scope.kpis = obj.data;
    });

    $(".change-kpi").click(function() {
        $('#change-kpi-modal').modal('show');
    });
});