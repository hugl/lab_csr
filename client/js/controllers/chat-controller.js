/**
 * Created by qiucheng on 15/5/12.
 */

module.exports = [
    "$scope",
    "$sce",
    "$timeout",
    "$interval",
    "$q",
    "$rootScope",
    "resources",
    "utils",
    "i18nFactory",
    "transformFilter",
    "lengthLimitFilter",
    "randomGenerator",
    "popupMessage",
    function ($scope, $sce, $timeout, $interval, $q, $rootScope, resources, utils, i18nFactory, transformFilter, lengthLimitFilter, randomGenerator, popupMessage) {
        require("./helpers/define-scopes")($scope, $rootScope, $interval, utils);
        require("./helpers/websocket-manager")($scope, $sce, $rootScope, $timeout, $interval, utils, transformFilter, i18nFactory, resources, popupMessage);
        require("./helpers/register-events")($scope, $sce, $timeout, $q, resources, i18nFactory, utils, transformFilter, popupMessage);
        require("./helpers/local-functions")($scope, $rootScope, $timeout, $rootScope, $sce, i18nFactory, utils, resources, transformFilter);
        //angular broadcast or emit events
        require("./helpers/broadcast-emit-events-handler")($scope, resources, utils, i18nFactory);

        //define my_customer and all customers
        require("./helpers/customer-history-handler")($scope, $sce, $timeout, $q, randomGenerator, utils, transformFilter, i18nFactory, resources);
        //user details and orders
        require("./helpers/user-details")($scope, i18nFactory);
    }
];