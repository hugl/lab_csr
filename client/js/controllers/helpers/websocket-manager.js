/**
 * Created by qiucheng on 15/5/15.
 */

var Conversation = require("../../models/Conversation");
var Message = require("../../models/Message");
var Customer = require("../../models/Customer");

module.exports = function ($scope, $sce, $rootScope, $timeout, $interval, utils, transformFilter, i18nFactory, resources, popupMessage) {
    var socket = io();

    /**
     * send heart beat to socket server every 30 seconds,
     * workaround against unexpected server side disconnection bug
     * since socket.io 0.9.0
     */
    $interval(function () {
        socket.emit("iAmAlive", {});
        console.log("send heart beat to socket server")
    }, 30000);

    socket.emit("hereIsMyCsrId", $scope.csrId);

    function createNewConversation(userId) {
        var customer = new Customer(userId, i18nFactory.get("loading"), "images/unknown_user.jpg");
        //load customer image and nickname
        resources.getUserById(customer.userId)
            .then(function (response) {
                var apiCustomer = response.data;
                var temp = Customer.wrapCustomer(apiCustomer);
                customer.name = temp.name;
                customer.avatar = temp.avatar;
            })
            .catch(function (error) {
                console.log(error.stack);
                utils.displayMessage(i18nFactory.get("failedToLoadImageAndName"));
            });

        //add to user to the crs's "The customers that I have serviced group"
        //first check whether this user is in the group
        resources.searchByUserIdAndGroupId(customer.userId, $rootScope.myGroupId)
            .then(function (response) {
                return response.data.id.id;
            })
            .then(function (userGroupId) {
                resources.deleteUserGroup(userGroupId);
            })
            .then(function () {
                resources.createMyCustomerGroup(customer.userId, $rootScope.myGroupId)
                    .then(function () {
                        console.log("group updated!");
                    });
            })
            .catch(function (error) {
                if (error.status == 404) {
                    resources.createMyCustomerGroup(customer.userId, $rootScope.myGroupId)
                        .then(function () {
                            console.log("group created!");
                        })
                        .catch(function () {
                            console.log(error.stack);
                            utils.displayMessage(i18nFactory.get("errorCreatingUserGroup"));
                        })
                }
                else {
                    console.log(error.stack);
                    utils.displayMessage(i18nFactory.get("errorCreatingUserGroup"));
                }
            });

        return new Conversation(customer);
    }

    function findConversationByUserId(userId) {
        for (var i in $scope.inReceptionConversations) {
            var temp = $scope.inReceptionConversations[i];
            if (temp.customer.userId == userId) {
                return temp;
            }
        }
        return null;
    }

    socket.on("userArranged", function (userId) {
        $scope.$apply(function () {
            var conversation = createNewConversation(userId);
            $scope.inReceptionConversations.unshift(conversation);
            conversation.lastReply = {
                contentType: $scope.constants.TEXT_MESSAGE,
                content: i18nFactory.get("addCustomerToConversationFinished")
            };

            $scope.currentConversation.__servicingCsr = $scope.csr.csrName;
            $scope.currentConversation.__servicingCsrId = $scope.csr.csrId;
        });

        if ($scope.settings.notification) {
            document.getElementById("notify-audio").play();
        }
    });

    socket.on("messageFromExternal", function (messageFromExternal) {
        $scope.$apply(function () {
                messageFromExternal.unread = true;
                var message = $scope.localFuncs.wrapMessage(messageFromExternal);
                //if a new message comes, check whether we have created the customer before
                var conversation = findConversationByUserId(message.userId);
                if (!conversation) {
                    conversation = createNewConversation(message.userId);
                    $scope.inReceptionConversations.unshift(conversation);
                }

                conversation.addReply(message);

                //move the scroll bar to the bottom if it is set to true..
                if ($scope.settings.autoScrollBarPosition) {
                    $timeout(function () {
                        var messagesJQueryObj = $(".messages");
                        var newScrollHeight = messagesJQueryObj.get(0).scrollHeight;
                        messagesJQueryObj.scrollTop(newScrollHeight + 200);
                    }, 10);
                }

                if ($scope.settings.notification) {
                    document.getElementById("notify-audio").play();
                }
            }
        );
    });

    socket.on("forwardedMessageBulk", function (data) {
        $scope.$apply(function () {
            var contextMessages = data.contextMessages;

            var messages = contextMessages;
            var conversation = createNewConversation(data.userId);
            $scope.inReceptionConversations.unshift(conversation);
            messages.forEach(function (__message) {
                var message = new Message();
                angular.extend(message, __message);
                //for voice
                if (message.contentType == $scope.constants.VOICE_MESSAGE) {
                    message.setUnread(true);
                }

                if (message.type == $scope.constants.CSR_MESSAGE) {
                    var csr = utils.tryInittingCsr(message.csrId);
                    message.setCsrName(csr.csrName);
                    message.setAvatar(csr.avatar);
                }
                if (message.content != null) {
                    message.safeContent = utils.encodeHtml(message.content);
                    message.safeContent = utils.parseExternalExpressions(message.safeContent);
                    message.safeContent = $sce.trustAsHtml(transformFilter(message.safeContent));
                }

                //voice,short video,video
                if (message.mediaUrl != null) {
                    message.safeMediaUrl = $sce.trustAsResourceUrl(message.mediaUrl);
                }

                conversation.addReply(message);
            });

            var senderName = data.senderName;
            conversation.lastReply = {
                contentType: $scope.constants.TEXT_MESSAGE,
                content: senderName + i18nFactory.get("fromCsr")
            };
            utils.displayMessage(i18nFactory.get("gotAForward"));

            $scope.notFirstLoad = true;

            if ($scope.settings.notification) {
                document.getElementById("notify-audio").play();
            }
        });
    });

    socket.on("forwardSuccess", function (userId) {
        //delete the conversation from the current list
        var conversation = findConversationByUserId(userId);

        $scope.$apply(function () {
            $scope.localFuncs.removeConversation(conversation);
        });
    });

    socket.on("preempted", function () {
        $scope.preempted = true;
    });

    /**
     * data format
     * {
            requesterId: csrId,
            requesterName: csrName,
            userId: userId,
            userName: userName
     * }
     */
    socket.on("forwardRequest", function (data) {
        var str = i18nFactory.get("csr") + data.requesterName + i18nFactory.format("requestHint", data.userName);
        popupMessage.popup(i18nFactory.get("forward"), str);
    });

    socket.on("disconnect", function () {
        if (!$scope.preempted) {
            alert(i18nFactory.get("disconnectFromServer"));
        }
        else
            alert(i18nFactory.get("preempted"));

        window.location.href = "about:blank";
    });

    socket.on("forceShutdown", function () {
        utils.displayMessage(i18nFactory.get("reset"), 5000);
        $timeout(function () {
            window.location.href = "about:blank";
        }, 5000);
    });

    $scope.socket = socket;
};