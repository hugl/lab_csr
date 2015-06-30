
var app = angular.module("silkcloudChat", []);

app. controller('listControler',function($scope,$interval,$http){
    $scope.currentName = "tester"
    $scope.inReception = "接待中";
    $scope.myCustomers = "接待过的客户";
    $scope.allCustomers = "所有客户";
    $scope.playNotification = "通知音";
    $scope.txtForwardTo = "转发给";
    $scope.details = "客户";
    $scope.orders = "订单";
    $scope.session = "会话";
    $scope.removeCustomer = "删除用户";

    $scope.showTabContents = true;
    $scope.showSession = false;
    $scope.showSettingPanel = false;
    $scope.showTaskList = false;
    $scope.showInfo = false;
    $scope.currentConversation = null;
    $scope.conversationList = [];
    $scope.customerInfo = null;

    //加载Conversation列表
    $scope.loadInReceptionList = function(){
        $scope.showTabContents = true;
        $scope.showSession = false;
        //var conversation = new Conversation(Customer.wrapCustomer(apiCustomer));
        //$('#in_nav').css('background-color','#fff');
        var promise = $http({
            method:'Get',
            url:'http://api.silkcloud.cn/v1/items'
        });
        promise.success(function(data,status,headers,config){
            var results = data.results;
            $scope.conversationList = results;
        });
        promise.error(function(data,status,headers,config){
           $scope.conversationList = data;
        });
    }
    $scope.loadMyCustomersList = function(){
        $scope.showTabContents = true;
        $scope.showSession = false;
        //$('#my_nav').css('background-color','#fff');

    }
    $scope.loadAllCustomersList = function(){
        $scope.showTabContents = true;
        $scope.showSession = false;
        //$('#all_nav').css('background-color','#fff');
    }

    $scope.loadSession = function(conversation){
        $scope.showSession = true;
        $scope.showTabContents = false;
        $scope.currentConversation = conversation;
    }
    $scope.onRemoveCustomer = function(conversation){

    }
    $scope.enableSettingPanel = function(){
        $scope.showSettingPanel = !$scope.showSettingPanel;
    }
    $scope.onForwardTo = function(){
        $scope.showTaskList = !$scope.showTaskList;
    }
    $scope.backToList = function(){
        $scope.showTabContents = true;
        $scope.showSession = false;
        $scope.showInfo = false;
        $scope.showTaskList = false;
    }
    $scope.onDeails = function(){
        $scope.showInfo = true;
        $scope.showOrder = false;
    }
    $scope.onOrders = function(){
        $scope.showInfo = true;
        $scope.showOrder = true;
    }
    $scope.onSession = function(){
        $scope.showInfo = false;
    }

    $scope.startTime = new Date().getTime();

    $interval(function () {
        var now = new Date().getTime();
        var diff = (now - $scope.startTime) / 1000;
        var minutes = Math.floor(diff / 60);
        var seconds = Math.floor(diff % 60);
        //I dont use angular here is because angular would try to "refresh" that whole page every second!
        $("#minutes").text(addZero(minutes));//utils.addZero undefined
        $("#seconds").text(addZero(seconds));
    }, 1000);
});

app.directive('slideBar',function () {
    return {
        restrict: "E",
        scope: {},
        templateUrl:
        'public/slide-bar.html',
        link: function ($scope, element, attr) {
            function defineScopes() {
                $scope.constants = {};
                $scope.constants.ON = "on";
                $scope.constants.OFF = "off";
                $scope.status = "on";
            }

            function registerEvents() {
                $scope.Events = {};
                $scope.Events.toggleStatus = function ($event) {
                    var ele = $(event.target);

                    if ($scope.status == $scope.constants.ON) {
                        $scope.status = $scope.constants.OFF;
                        ele.css("animation", "move-to-right-circle 0.5s ease 0.05s").css("animation-fill-mode", "forwards");
                        ele.parent().css("animation", "move-to-right 0.5s ease 0s").css("animation-fill-mode", "forwards");
                        $scope.$emit("SETTING_OFF", attr.bindOn);
                    }
                    else if ($scope.status == $scope.constants.OFF) {
                        $scope.status = $scope.constants.ON;
                        ele.css("animation", "move-to-left-circle 0.5s ease 0s").css("animation-fill-mode", "forwards");
                        ele.parent().css("animation", "move-to-left 0.5s ease 0s").css("animation-fill-mode", "forwards");
                        $scope.$emit("SETTING_ON", attr.bindOn);
                    }
                }
            }

            defineScopes();
            registerEvents();
        }
    };
});
var addZero = function (number) {
    if (number < 10)
        return "0" + number;
    else
        return "" + number;
}

var Converation = require("../js/models/Conversation");