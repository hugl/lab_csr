/**
 * Created by qiucheng on 15/5/17.
 */
module.exports = function ($scope, i18nFactory) {
    $scope.Events.showUserDetails = function () {
        $scope.status.userDetailsSeleted = $scope.constants.DETAILS;
        var conversation = $scope.currentConversation;
        var customer = conversation.customer;

        if (!customer.basicInfoLoaded)
            $scope.localFuncs.loadUserInfo(customer);
    };

    $scope.Events.showUserOrders = function () {
        $scope.status.userDetailsSeleted = $scope.constants.ORDERS;
        var conversation = $scope.currentConversation;
        var customer = conversation.customer;
        if (!customer.ordersLoaded) {
            $scope.status.orderLoadStatus = i18nFactory.get("loadingOrders");
            $scope.localFuncs.loadMoreOrders(customer);
        }
    };

    $scope.Events.loadMoreOrders = function (customer) {
        $scope.status.orderLoadStatus = i18nFactory.get("loadingOrders");
        $scope.localFuncs.loadMoreOrders(customer);
    };

};