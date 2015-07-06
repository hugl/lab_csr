/**
 * Created by qiucheng on 15/5/14.
 */
var Conversation = require("../../models/Conversation");
var Customer = require("../../models/Customer");

module.exports = function ($scope, $sce, $timeout, $q, randomGenerator, utils, transformFilter, i18nFactory, resources) {
    var messages = $(".messages");
    messages.scroll(function (event) {
        if (messages.scrollTop() == 0 && $scope.notFirstLoad) {
            $scope.$apply(function () {
                $scope.Events.fetchMoreMessages($scope.currentConversation, false);
            });
        }
    });

    $scope.Events.switchToMyCustomers = function () {
        $scope.localFuncs.reset();
        $scope.status.currentType = $scope.constants.MY_CUSTOMERS;
        $(".messages").height("650px");
        $scope.Events.loadMoreConversations($scope.status.currentType);
    };

    $scope.Events.switchToAllCustomers = function () {
        $scope.localFuncs.reset();
        $scope.status.currentType = $scope.constants.ALL_CUSTOMERS;
        $(".messages").height("650px");
        $scope.Events.loadMoreConversations($scope.status.currentType);
    };

    $scope.Events.loadMoreConversations = function (type) {
        $scope.status.loadingConversation = true;
        $timeout(function () {
            var promise;
            if ($scope.status.currentType == $scope.constants.MY_CUSTOMERS)
                promise = resources.getServicedUsers($scope.conversationList.length);
            else if ($scope.status.currentType == $scope.constants.ALL_CUSTOMERS) {
                promise = resources.getAllUsers($scope.conversationList.length);
            }

            promise
                .then(function (response) {
                    $scope.status.loadingConversation = false;

                    //if the user swithced to other tabs before the data come back
                    if ($scope.status.currentType == type) {
                        var users = response.data.results;

                        if (users.length == 0 && $scope.conversationList.length != 0) {
                            utils.displayMessage(i18nFactory.get("noMoreConversations"));
                            return;
                        }

                        users.forEach(function (user) {
                            var conversation = new Conversation(Customer.wrapCustomer(user));
                            $scope.conversationList.push(conversation);
                        });
                    }

                })
                .catch(function (error) {
                    console.log(error);
                    utils.displayMessage(i18nFactory.get("failedToLoad"));
                });

        }, 500);
    };


    $scope.Events.fetchMoreMessages = function (conversation, firstTime) {
        conversation.isLoadingMoreMessages = true;
        var oldScrollHeight = $(".messages").get(0).scrollHeight;
        $scope.status.messageBeingLoaded = true;

        var timeStr = null;

        if (conversation.messages && conversation.messages.length > 0) {
            for (var i = 0; i < conversation.messages.length; i++) {
                if (conversation.messages[i].createdTime != null) {
                    timeStr = conversation.messages[i].createdTime;
                    break;
                }
            }

        }

        $timeout(function () {
            resources.getHistoryMessages(conversation.customer.userId, timeStr)
                .then(function (response) {
                    var messages = response.data.results;

                    if (messages.length == 0) {
                        utils.displayMessage(i18nFactory.get("noMoreMessages"));
                        $scope.status.messageBeingLoaded = false;
                        conversation.isLoadingMoreMessages = false;
                        return;
                    }

                    messages.forEach(function (apiMessage) {
                        apiMessage.unread = false;
                        var message = $scope.localFuncs.wrapMessage(apiMessage);

                        if (message.isCsrMessage()) {
                            var csr = utils.tryInittingCsr(message.csrId);
                            message.setCsrName(csr.csrName);
                            message.setAvatar(csr.avatar);
                        }

                        if (message.contentType == $scope.constants.TEXT_MESSAGE) {
                            message.safeContent = utils.encodeHtml(message.content);
                            message.safeContent = utils.parseExternalExpressions(message.safeContent);
                            message.safeContent = $sce.trustAsHtml(transformFilter(message.safeContent));
                        }
                        conversation.messages.unshift(message);
                    });

                    $timeout(function () {
                        var messagesJQueryObj = $(".messages");
                        var newScrollHeight = messagesJQueryObj.get(0).scrollHeight;
                        var diff = newScrollHeight - oldScrollHeight;

                        //the first time ,go to the bottom
                        if (firstTime) {
                            messagesJQueryObj.scrollTop(newScrollHeight);
                            return;
                        }

                        var currentScrollTop = messagesJQueryObj.scrollTop();
                        messagesJQueryObj.scrollTop(currentScrollTop + diff);
                    });
                    $scope.status.messageBeingLoaded = false;
                    conversation.isLoadingMoreMessages = false;
                    $scope.notFirstLoad = true;
                });


        }, 500);
    };
};