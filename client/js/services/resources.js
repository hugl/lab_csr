/**
 * Created by qiucheng on 15/5/19.
 */

var util = require("util");
module.exports = [
    "$rootScope",
    "$q",
    "$http",
    function ($rootScope, $q, $http) {

        return {

            sendMessage: function (message) {
                var baseUrl = $rootScope.host;
                return $http.post(baseUrl + "/v1/user-messages", message);
            },

            resendMessage: function (id) {
                var baseUrl = $rootScope.host;
                return $http.post(baseUrl + "/v1/user-messages/" + id + "/resend");
            },

            getAllOnlineCsrs: function () {
                //these variables are inited at chat.module.js
                var baseUrl = $rootScope.host;
                return $http.get(baseUrl + "/chat/csrs");
            },

            getCsrMetaInfo : function(){
                //these variables are inited at chat.module.js
                var baseUrl = $rootScope.host;
                return $http.get(baseUrl + "/chat/csr-meta-info");
            },

            /**
             * get the users that the current csr has serviced
             */
            getServicedUsers: function (start) {
                var baseUrl = $rootScope.host;
                var myGroupId = $rootScope.myGroupId;

                return $http.get(baseUrl + "/v1/users", {
                    params: {
                        groupId: myGroupId,
                        start: start,
                        count: 10
                    }
                });
            },

            getAllUsers: function (start) {
                var baseUrl = $rootScope.host;
                return $http.get(baseUrl + "/v1/users/search", {
                    params: {
                        start: start,
                        count: 10,
                        source: "WX",
                        subscribe: 1
                    }
                });
            },

            getCsrByUserId: function (userId) {
                var baseUrl = $rootScope.host;
                return $http.get(baseUrl + "/chat/user2csr?userId=" + userId);
            },

            addToMyReceptionList: function (csrId, userId) {
                var baseUrl = $rootScope.host;
                return $http.post(baseUrl + "/chat/user2csr", {
                    csrId: csrId,
                    userId: userId
                });
            },

            requestForward: function (csrId, csrName, userId, userName) {
                var baseUrl = $rootScope.host;
                return $http.put(baseUrl + "/chat/control-right", {
                    csrId: csrId,
                    csrName: csrName,
                    userId: userId,
                    userName: userName
                });
            },

            getUserById: function (userId) {
                var baseUrl = $rootScope.host;
                return $http.get(baseUrl + "/v1/users/" + userId + "?expand=membership");
            },

            getUserByIdSimple: function (userId) {
                var baseUrl = $rootScope.host;
                var request = {
                    url: baseUrl + '/v1/users/' + userId,
                    method: 'GET',
                    checkAuth: true
                };

                return $http(request);
            },

            updateUser: function (userId, data) {
                var baseUrl = $rootScope.host;
                var request = {
                    url: baseUrl + '/v1/users/' + userId,
                    method: 'PUT',
                    params: {},
                    data: data,
                    checkAuth: true
                };

                return $http(request);
            },

            getUserWalletById: function (userId) {
                var baseUrl = $rootScope.host;
                return $http.get(baseUrl + "/v1/wallets?userId=" + userId);
            },

            getUserOrders: function (userId) {
                var baseUrl = $rootScope.host;
                return $http.get(baseUrl + "/v1/orders?userId=" + userId);
            },

            getUserOrdersWithDetails: function (userId) {
                var baseUrl = $rootScope.host;
                return $http.get(baseUrl + "/v1/orders?userId=" + userId +
                "&expand=results(orderItems/itemRevision,payments/paymentInstrumentId/type,currency)");
            },

            getUserByName: function (fullName) {
                var baseUrl = $rootScope.host;
                return $http.get(baseUrl + "/v1/users/search?name=" + fullName + "&source=WX");
            },

            searchByUserIdAndGroupId: function (userId, groupId) {
                var baseUrl = $rootScope.host;
                return $http.get(baseUrl + "/v1/user-groups/users/" + userId + "/groups/" + groupId);
            },

            createMyCustomerGroup: function (userId, groupId) {
                var baseUrl = $rootScope.host;
                return $http.post(baseUrl + "/v1/user-groups",
                    {
                        userId: userId,
                        groupId: groupId
                    });
            },

            getHistoryMessages: function (userId, timeStr) {
                var baseUrl = $rootScope.host;
                var params = {
                    userId: userId,
                    include: "MESSAGE",
                    count: 10
                };
                if (timeStr != null) {
                    params.startTime = timeStr;
                }

                return $http.get(baseUrl + "/v1/user-messages/chat", {
                    params: params
                });
            },

            getAllQuickReplies: function () {
                var baseUrl = $rootScope.host;
                return $http.get(baseUrl + "/v1/csr-quick-replies");
            },

            addNewQuickReply: function (replyContent) {
                var baseUrl = $rootScope.host;
                return $http.post(baseUrl + "/v1/csr-quick-replies", {
                    content: replyContent
                });
            },

            updateQuickReply: function (id, replyContent) {
                var baseUrl = $rootScope.host;
                return $http.put(baseUrl + "/v1/csr-quick-replies/" + id, {
                    id: id,
                    content: replyContent
                });
            },

            removeQuickReply: function (id) {
                var baseUrl = $rootScope.host;
                return $http.delete(baseUrl + "/v1/csr-quick-replies/" + id);
            },

            getUserGroupId: function (userId, groupId) {
                var baseUrl = $rootScope.host;
                return $http.get(util.format(baseUrl + "/v1/user-groups/users/%s/groups/%s", userId, groupId));
            },

            deleteUserGroup: function (userGroupId) {
                var baseUrl = $rootScope.host;
                return $http.delete(baseUrl + "/v1/user-groups/" + userGroupId);
            },

            removeUserFromReceptionList: function (userId, csrId) {
                var baseUrl = $rootScope.host;
                return $http.delete(baseUrl + "/chat/user/" + userId + "/" + csrId);
            },

            //ajax style async functions
            getOrganization: function (orgName) {
                var baseUrl = $rootScope.host;
                return $.ajax(
                    {
                        async: false,
                        url: baseUrl + "/v1/organizations",
                        data: {
                            name: orgName
                        },
                        success: function () {
                            $(this).addClass("done");
                        }
                    }).responseJSON;
            },

            /**
             * load the user group that the current csr has serviced
             * @param csrId
             * @returns {*}
             */
            getMyCustomersGroup: function (orgId, csrId) {
                var baseUrl = $rootScope.host;
                return $.ajax({
                    async: false,
                    url: baseUrl + "/v1/groups",
                    data: {
                        organizationId: orgId,
                        type: "my_customer_list",
                        name: csrId
                    }
                }).responseJSON;
            },

            createMyCustomersGroup: function (orgId, csrId) {
                var baseUrl = $rootScope.host;
                return $.ajax({
                    async: false,
                    url: baseUrl + "/v1/groups",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify({
                        "organizationId": orgId,
                        "type": "my_customer_list",
                        "name": csrId,
                        "role": "reader"
                    })
                }).responseJSON;
            },

            getCsrById: function (csrId) {
                var baseUrl = $rootScope.host;
                return $.ajax({
                    async: false,
                    url: baseUrl + "/v1/users/" + csrId,
                    type: "GET"
                }).responseJSON;
            }

        };
    }
]