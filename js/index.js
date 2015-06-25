var app = angular.module("silkcloudChat", []);

app. controller('listControler',function($scope){
    $scope.currentName = "guilan"
    $scope.inReception = "接待中";
    $scope.myCustomers = "接待过的客户";
    $scope.allCustomers = "所有客户";
    $scope.playNotification = "通知音";
    $scope.txtForwardTo = "转发给";
    $scope.details = "客户";
    $scope.orders = "订单";
    $scope.session = "会话";

    $scope.Contents = "";
    $scope.sessionDetails = "";

    $scope.showTabContents = false;
    $scope.showConversation = false;
    $scope.showSettingPanel = false;
    $scope.showTaskList = false;
    $scope.showInfo = false;

    $scope.loadInReceptionList = function(){
        $scope.showTabContents = true;
        $scope.Contents = "InReceptionList";
        $scope.showConversation = false;
    }
    $scope.loadMyCustomersList = function(){
        $scope.showTabContents = true;
        $scope.Contents = "MyCustomersList";
        $scope.showConversation = false;

    }
    $scope.loadAllCustomersList = function(){
        $scope.showTabContents = true;
        $scope.Contents = "AllCustomersList";
        $scope.showConversation = false;
    }
    $scope.loadConversation = function(){
        $scope.showConversation = true;
        $scope.sessionDetails = "session";
        $scope.showTabContents = false;
    }
    $scope.enableSettingPanel = function(){
        $scope.showSettingPanel = !$scope.showSettingPanel;
    }
    $scope.onForwardTo = function(){
        $scope.showTaskList = !$scope.showTaskList;
    }
    $scope.backToList = function(){
        $scope.showTabContents = true;
        $scope.showConversation = false;
        $scope.showInfo = false;
        $scope.showTaskList = false;
    }
    $scope.onDeails = function(){
        $scope.showInfo = true;
        $scope.customerInfo = "客户信息";
    }
    $scope.onOrders = function(){
        $scope.showInfo = true;
        $scope.customerInfo = "客户订单";
    }
    $scope.onSession = function(){
        $scope.showInfo = false;
        $scope.sessionDetails = "session";
    }
});

app.directive('slideBar',function () {
    return {
        restrict: "E",
        scope: {},
        template:
        '<span class="slidebar-outer"><span class="slidebar-white"><span class="slidebar-circle" data-ng-click="Events.toggleStatus()"></span> </span> </span>',
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
app.directive('timer',function(){
    return{
        restrict: "E",
        scope: {},
        template:'<span>{{timerController.minutes}}</span>:<span>{{timerController.seconds}}</span>',
        controllerAs: 'timerController',
        controller: function() {
            this.minutes = "00";
            this.seconds = "00";
            setInterval(function () {
                var now = new Date().getTime();
                var diff = (now - $scope.status.startTime) / 1000;
                var minutes = Math.floor(diff / 60);
                var seconds = Math.floor(diff % 60);
                //I dont use angular here is because angular would try to "refresh" that whole page every second!
                this.minutes = (utils.addZero(minutes));
                this.seconds = (utils.addZero(seconds));
            }, 1000);
        }
    };
});
