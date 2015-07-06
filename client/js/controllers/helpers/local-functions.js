/**
 * Created by qiucheng on 15/5/16.
 */
var Order = require("../../models/Order");
var Item = require("../../models/Item");
var Message = require("../../models/Message");
var QuickReply = require("../../models/QuickReply");

var util = require("util");

module.exports = function ($scope, $rootScope, $timeout, $rootScope, $sce, i18nFactory, utils, resources, transformFilter) {
    Order.setExternalUtil("i18nFactory", i18nFactory);

    $scope.localFuncs = {};
    $scope.localFuncs.closeAllOperationTools = function () {
        $scope.showWechatExpressionDiv = false;
        $scope.showQuickReplyMessagesDiv = false;
        $scope.showSettingPanel = false;
        $scope.status.showAllCsrs = false;
    };

    $scope.localFuncs.insertIntoTextarea = function (newValue) {
        var textArea = $(".input-textarea").get(0);
        var val = $scope.conversationInput;
        var pos = textArea.selectionStart;
        var l = val.substring(0, pos);
        var r = val.substring(pos, val.length);
        $scope.conversationInput = l + newValue + r;
    };

    $scope.localFuncs.checkLength = function (length) {
        return length <= $scope.constants.MAX_CHARACTER;
    };

    $scope.localFuncs.wrapMessage = function (apiMessage) {
        var type = apiMessage.transmitType == 'IN' ? $scope.constants.CUSTOMER_MESSAGE : $scope.constants.CSR_MESSAGE;

        var message = new Message(type, apiMessage.msgType, apiMessage.content);
        if (message.contentType == $scope.constants.TEXT_MESSAGE && message.content == "") {
            message.content = "#" + i18nFactory.get("notSupported") + "#";
        }

        //for voice
        if (apiMessage.id.id) {
            message.setId(apiMessage.id.id);
        } else {
            message.setId(apiMessage.id);
        }

        //for pictures,voice,shortVideo，video
        message.setMediaId(apiMessage.mediaId);
        message.setMediaUrl(apiMessage.mediaUrl);

        //for voice
        if (message.contentType == $scope.constants.VOICE_MESSAGE) {
            message.setUnread(apiMessage.unread);
        }

        //for location message
        message.setLongitude(apiMessage.locationY);
        message.setLatitude(apiMessage.locationX);
        message.setLabel(apiMessage.label);

        //for link
        message.setTitle(apiMessage.title);
        message.setUrl(apiMessage.url);

        message.setCreatedTime(apiMessage.createdTime);
        if (apiMessage.userId.id) {
            message.setUserId(apiMessage.userId.id);
        } else {
            message.setUserId(apiMessage.userId);
        }

        if (type == $scope.constants.CSR_MESSAGE) {
            message.setCsrId(apiMessage.csrId.id);
        }

        //messages from outside are all deemed sent
        if (apiMessage.sendSuccess == null || apiMessage.sendSuccess)
            message.setSent(Message.SENT);
        else
            message.setSent(Message.FAILED);


        //handle wechat expressions and also prevent damages from attacks!
        if (message.content != null) {
            message.safeContent = utils.encodeHtml(message.content);
            message.safeContent = utils.parseExternalExpressions(message.safeContent);
            message.safeContent = $sce.trustAsHtml(transformFilter(message.safeContent));
        }

        if (message.mediaUrl != null) {
            message.safeMediaUrl = $sce.trustAsResourceUrl(message.mediaUrl);
        }

        return message;
    };

    $scope.localFuncs.wrapMsgIntoApiFormat = function (message) {
        var ret = {};
        ret.userId = Number($scope.currentConversation.customer.userId);
        ret.csrId = $scope.csrId + "";
        ret.transmitType = "OUT";
        ret.msgType = message.contentType;
        if (message.contentType == $scope.constants.TEXT_MESSAGE) {
            ret.content = message.content;
        }
        else if (message.contentType == $scope.constants.PICTURE_MESSAGE) {
            ret.mediaUrl = message.mediaUrl;
        }
        return ret;
    };

    $scope.localFuncs.reset = function () {
        if ($scope.currentConversation != null) {
            $scope.currentConversation.unselect();
        }

        $scope.status.showAllCsrs = false;
        $scope.currentConversation = null;
        $scope.conversationList = [];
        $scope.localFuncs.closeAllOperationTools();
        $scope.status.showInputSearch = false;
        $scope.status.isShowingSearchResult = false;
    };

    $scope.localFuncs.loadMoreOrders = function (customer) {
        $scope.status.ordersLoaded = false;
        customer.orders = [];
        $timeout(function () {
            resources.getUserOrdersWithDetails(customer.userId)
                .then(function (response) {
                    var apiOrders = response.data.results;
                    if (apiOrders.length == 0) {
                        $scope.status.ordersLoaded = true;
                        return;
                    } else {
                        apiOrders.forEach(function (apiOrder) {
                            var order = new Order(
                                apiOrder.id.id,
                                apiOrder.purchaseTime,
                                apiOrder.totalAmount,
                                apiOrder.currency.symbol
                            );
                            order.setPaymentMethod(apiOrder.payments);
                            order.orderUrl = $rootScope.host + "/admin/order/order-detail/" + order.orderId;

                            apiOrder.orderItems.forEach(function (apiItem) {
                                var item = Item.wrapItem(apiItem);
                                order.items.push(item);
                            });
                            customer.orders.push(order);
                        });
                        $scope.status.ordersLoaded = true;
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    utils.displayMessage(i18nFactory.get("failedToLoadOrders"));
                    $scope.status.ordersLoaded = true;
                    return;
                });

        }, 500);
    };

    $scope.localFuncs.loadUserInfo = function (customer) {
        $timeout(function () {
            resources.getUserById(customer.userId)
                .then(function (response) {
                    var returnedCustomer = response.data;

                    //load address info
                    var info = returnedCustomer.extendedProperties && returnedCustomer.extendedProperties.wxUserInfo;
                    if (info) {
                        customer.setCountry(info.country);
                        customer.setProvince(info.province);
                        customer.setCity(info.city);
                        customer.setSubscriptionTime(info.subscribe_time);

                    } else {
                        console.log("user info is not enough");
                        //utils.displayMessage(i18nFactory.get("userBasicInfoLoadFailed"));
                        //throw new Error("user info is not enough,check extendedProperties attribute please!");
                    }

                    //load level info
                    if (returnedCustomer.membership && returnedCustomer.membership.length > 0) {
                        customer.level = returnedCustomer.membership[0].tag;
                    }

                    //load tag info
                    if (returnedCustomer.tags != null && returnedCustomer.tags.length > 0) {
                        customer.userTags = returnedCustomer.tags;
                    }

                    customer.basicInfoLoaded = true;
                    return "goOn";
                })
                .catch(function (err) {
                    console.log(err);
                    utils.displayMessage(i18nFactory.get("userBasicInfoLoadFailed"));
                });
            //load user points
            resources.getUserWalletById(customer.userId)
                .then(function (response) {
                    var results = response.data.results;
                    for (var i in results) {
                        var curr = results[i];
                        if (curr.status == "ACTIVE" && curr.type == "VIRTUAL_CURRENCY" && curr.currency == "_PT") {
                            customer.points = Number(curr.balance);
                            break;
                        }
                    }
                })
                .catch(function (err) {
                    console.log(err);
                    utils.displayMessage(i18nFactory.get("userPointsLoadedFailed"))
                });

            //load order summary info
            resources.getUserOrders(customer.userId)
                .then(function (response) {
                    if (response.data.results != null && response.data.results.length > 0) {
                        var orders = response.data.results;
                        customer.lastPurchaseTime = orders[0].purchaseTime;
                        customer.purchaseTimes = orders.length;

                        var total = 0.0;
                        orders.forEach(function (order) {
                            total += Number(order.totalAmount);
                        });

                        customer.totalAmount = total.toFixed(2);
                        customer.avg = Number(total / orders.length).toFixed(2);
                    }
                })
                .catch(function (err) {
                    console.log(err);
                    utils.displayMessage(i18nFactory.get("userOrderSummaryLoadedFailed"))
                });

        }, 500);

    };

    $scope.localFuncs.loadQuickReplies = function () {
        $scope.quickReplies = [];
        resources.getAllQuickReplies().then(function (response) {
            var quickReplies = response.data.results;
            for (var i = 0; i < quickReplies.length; i++) {
                var quickReply = new QuickReply(quickReplies[i].id.id, quickReplies[i].content);
                $scope.quickReplies.push(quickReply);
            }
        });
    };


    /**
     * try to remove the user from my reception list
     * @param conversation
     */
    $scope.localFuncs.removeCustomerFromReceptionList = function (conversation) {
        resources.removeUserFromReceptionList(conversation.customer.userId, $scope.csr.csrId)
            .then(function () {
                utils.displayMessage(i18nFactory.get("success"));
                $scope.localFuncs.removeConversation(conversation);
            })
            .catch(function (response) {
                utils.displayMessage(i18nFactory.get("error"));
            });
    };

    /**
     * Remove the user from MY_CUSTOMER_LIST
     * @param conversation
     */
    $scope.localFuncs.removeCustomerFromGroup = function (conversation) {
        resources.getUserGroupId(conversation.customer.userId, $rootScope.myGroupId)
            .then(function (response) {
                var userGroupId = response.data.id.id;
                return userGroupId;
            })
            .then(function (userGroupUd) {
                return resources.deleteUserGroup(userGroupUd);
            })
            .then(function () {
                utils.displayMessage(i18nFactory.get("success"));
                $scope.localFuncs.removeConversation(conversation);
            })
            .catch(function (response) {
                utils.displayMessage(i18nFactory.get("error"));
            });
    };

    $scope.localFuncs.removeConversation = function (conversation) {
        conversation.unselect();
        $scope.currentConversation = null;
        for (var i = 0; i < $scope.conversationList.length; i++) {
            if ($scope.conversationList[i] === conversation) {
                $scope.conversationList.splice(i, 1);
                break;
            }
        }
        $scope.localFuncs.closeAllOperationTools();
    };

};