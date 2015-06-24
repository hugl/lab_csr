/**
 * Created by aaa on 15-6-19.
 */
//var angular = require('angular');
var app = angular.module('csr_chat',[]);
app.controller('listControler',function($scope){
    $scope.inReception = "接待中";
    $scope.myCustomers = "接待过的客户";
    $scope.allCustomers = "所有客户";
    $scope.showInRecept = false;
    $scope.showMy = false;
    $scope.showAll = false;
    $scope.showConversation = false;

    $scope.loadInReceptionList = function(){
        $scope.showInRecept = true;
        $scope.showMy = false;
        $scope.showAll = false;
        $scope.showConversation = false;
    }
    $scope.loadMyCustomersList = function(){
        $scope.showMy = true;
        $scope.showInRecept = false;
        $scope.showAll = false;
        $scope.showConversation = false;

    }
    $scope.loadAllCustomersList = function(){
        $scope.showAll = true;
        $scope.showInRecept = false;
        $scope.showMy = false;
        $scope.showConversation = false;
    }
    $scope.loadConversation = function(){
        $scope.showConversation = true;
        $scope.showInRecept = false;
        $scope.showMy = false;
        $scope.showAll = false;
    }
    $scope.backToList = function(){
        $scope.showConversation = false;
    }
});

