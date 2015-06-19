/**
 * Created by aaa on 15-6-19.
 */
var angular = require('angular');
var app = angular.module('csr_chat',[]);
app.controller('listControler',function($scope){
    $scope.inReception = "接待中";
    $scope.myCustomers = "接待过的客户";
    $scope.allCustomers = "所有客户";
})