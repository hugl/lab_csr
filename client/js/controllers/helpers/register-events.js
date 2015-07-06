/**
 * Created by qiucheng on 15/5/16.
 */
var Message = require("../../models/Message");
var Customer = require("../../models/Customer");
var Conversation = require("../../models/Conversation");
var QuickReply = require("../../models/QuickReply");

var ForwardConversation = require("../../models/ForwardConversation");
var util = require("util");

module.exports = function ($scope, $sce, $timeout, $q, resources, i18nFactory, utils, transformFilter, popupMessage) {
    $scope.Events = {};
    $(document).keydown(function (e) {
        if (e.which === 27) {
            $scope.$apply(function () {
                $scope.Events.closeBigImageFrame();
                $scope.Events.closeBigMap();
            });
        }
    });

    $scopte.Events.backToList = function(){
        $scope.status.showTabContents = true;
        $scope.status.showInfo = false;
        $scope.status.showTaskList = false;

        $scope.currentConversation = null;
    };
    $scope.Events.onSession = function(){
        $scope.status.showInfo = false;
    };
    $scope.Events.onDeails = function(){
        $scope.status.showInfo = true;
        $scope.status.showOrder = false;
    };
    $scope.Events.onOrders = function(){
        $scope.status.showInfo = true;
        $scope.status.showOrder = true;
    };

    $scope.Events.openBigMap = function (longitude, latitude, label) {
        var parent = $("#big-map-frame");
        var bigMap = $("<div id='big-map' style=''></div>");
        parent.prepend(bigMap);

        var map = new soso.maps.Map(bigMap.get(0));
        var latlng = new soso.maps.LatLng(latitude, longitude);
        map.moveTo(latlng);
        map.zoomTo(16);

        var marker = new soso.maps.Marker({
            position: latlng,
            map: map
        });

        var info = new soso.maps.InfoWindow({
            map: map
        });

        soso.maps.Event.addListener(marker, 'click', function () {
            info.open(
                '<div style="text-align:center;white-space:nowrap;line-height: 60px">' + label + '</div>',
                marker);
        });

        $scope.status.showBigMap = true;
    };

    $scope.Events.closeBigMap = function () {
        $("#big-map").remove();
        $scope.status.showBigMap = false;
    };

    $scope.Events.playMp3 = function (message) {
        var audio = document.getElementById("audio" + message.id);
        //if the audio is loaded..
        if (audio && audio.duration) {
            message.unread = false;
            audio.play();
        }
    };

    $scope.Events.removeCustomer = function ($event, conversation) {
        if ($event) {
            $event.stopPropagation();
        }
        if ($scope.status.currentType == $scope.constants.IN_RECEPTION) {
            popupMessage.popup(i18nFactory.get("removeCustomerTitle"), i18nFactory.get("removeCustomerFromReceptionListHint"),
                function () {
                    $scope.localFuncs.removeCustomerFromReceptionList(conversation);
                },
                function () {
                }
            );
        } else if ($scope.status.currentType == $scope.constants.MY_CUSTOMERS) {
            popupMessage.popup(i18nFactory.get("removeCustomerTitle"), i18nFactory.get("removeCustomerFromMyGroup"),
                function () {
                    $scope.localFuncs.removeCustomerFromGroup(conversation);
                },
                function () {
                }
            );
        }
    };

    /**
     * search customer by name
     */
    $scope.Events.searchCustomer = function ($event) {
        if ($event.keyCode != 13)
            return;
        var username = $scope.searchUserName.trim();
        if (username.length == 0) {
            if ($scope.status.isShowingSearchResult) {
                $scope.localFuncs.reset();
                $scope.conversationList = $scope.tempData.currentConversationListBackup;
            }
            $scope.status.isShowingSearchResult = false;
        } else {
            if ($scope.status.currentType == $scope.constants.IN_RECEPTION) {

                var hit = null;
                for (var i = 0; i < $scope.conversationList.length; i++) {
                    var conversation = $scope.conversationList[i];
                    if (conversation.customer.name == username) {
                        hit = conversation;
                    }
                }
                if (hit == null) {
                    utils.displayMessage(i18nFactory.get("noSuchUser"));
                } else {
                    showResultConversation(hit);
                }
            }

            else if ($scope.status.currentType != $scope.constants.IN_RECEPTION) {
                resources.getUserByName(username)
                    .then(function (response) {
                        var results = response.data.results;
                        if (results.length == 0) {
                            utils.displayMessage(i18nFactory.get("noSuchUser"));
                            return;
                        } else {
                            var apiCustomer = results[0];
                            var conversation = new Conversation(Customer.wrapCustomer(apiCustomer));
                            showResultConversation(conversation);
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                        utils.displayMessage(i18nFactory.get("searchFailed"));
                    });
            }
        }
    };

    function showResultConversation(conversation) {
        if (!$scope.status.isShowingSearchResult) {
            $scope.tempData.currentConversationListBackup = $scope.conversationList;
        }
        $scope.localFuncs.reset();

        $scope.conversationList = [conversation];
        $scope.status.isShowingSearchResult = true;
    }

    /**
     * show all other csrs meta-info except myself
     * @param csrId
     */
    $scope.Events.showCsrsMetaInfo = function () {
        if ($scope.status.showCsrMetaInfo == false) {
            $scope.tempData.csrs = [];
            resources.getCsrMetaInfo()
                .then(function (response) {
                    var myCsrId = $scope.csr.csrId;
                    var csrMetaInfos = response.data;

                    if (csrMetaInfos == null || (csrMetaInfos.length == 1 && csrMetaInfos[0].csrId == myCsrId)) {
                        utils.displayMessage(i18nFactory.get("noOtherCsr"));
                        return;
                    }

                    $scope.tempData.onlineCsrMetaInfo = [];

                    for (var i = 0; i < csrMetaInfos.length; i++) {
                        var temp = csrMetaInfos[i];
                        //if (temp.csrId == myCsrId)
                        //    continue;
                        var csr = utils.tryInittingCsr(temp.csrId);
                        $scope.tempData.onlineCsrMetaInfo.push(
                            {
                                csrName: csr.csrName,
                                memberCount: csrMetaInfos[i].memberCount
                            });
                    }


                    $scope.status.showCsrMetaInfo = true;
                });
        } else {
            $scope.status.showCsrMetaInfo = false;
        }
    };

    /**
     * show all other csrs except myself
     * @param csrId
     */
    $scope.Events.showAllOnlineCsrs = function () {
        if ($scope.status.showAllCsrs == false) {
            $scope.tempData.csrs = [];
            resources.getAllOnlineCsrs()
                .then(function (response) {
                    var myCsrId = $scope.csr.csrId;
                    var csrIds = response.data;

                    if (csrIds == null || (csrIds.length == 1 && csrIds[0] == myCsrId)) {
                        utils.displayMessage(i18nFactory.get("noOtherCsr"));
                        return;
                    }

                    $scope.tempData.onlineCsrs = [];

                    for (var i = 0; i < csrIds.length; i++) {
                        var temp = csrIds[i];
                        if (temp == myCsrId)
                            continue;
                        var csr = utils.tryInittingCsr(temp);
                        $scope.tempData.onlineCsrs.push(csr);
                    }


                    $scope.status.showAllCsrs = true;
                });
        } else {
            $scope.status.showAllCsrs = false;
        }
    };

    $scope.Events.forwardTo = function (toCsrId) {
        var conversation = $scope.currentConversation;
        var messagesCount = Math.min(conversation.messages.length, 10);
        var newMessages = [];
        for (var i = 0; i < messagesCount; i++) {
            //get the last 10 or less messages and forward it to the new csr as the context info
            newMessages.push(conversation.messages[conversation.messages.length - 1 - i]);
        }

        newMessages.reverse();
        $scope.socket.emit("forwardConversation", new ForwardConversation($scope.csrId, $scope.csr.csrName, toCsrId, conversation.customer.userId, newMessages));
    };

    $scope.Events.showSearchInput = function () {
        $scope.status.showInputSearch = true;
        $timeout(function () {
            $("#conversationSearch").focus();
        }, 10);
    };

    $scope.Events.hideSearchInput = function () {
        $scope.status.showInputSearch = false;
    };

    $scope.Events.changeImageSize = function ($event) {
        var deltaY = -$event.deltaY / 2;

        var width = $("#big-image-frame").width();
        $("#big-image-frame").width((width + deltaY) + "px");
        $("#big-image").width((width + deltaY) + "px");
    };

    $scope.Events.zoomIn = function (url) {
        $scope.bigImageUrl = url;
        $("#big-image-background").focus();
        $("#big-image-frame").width("600px");
        $("#big-image").width("600px");
    };

    $scope.Events.closeBigImageFrame = function () {
        $scope.bigImageUrl = "";
    };

    /**
     * open the picture select plugin
     */
    $scope.Events.openPictureDialog = function () {
        $scope.localFuncs.closeAllOperationTools();
        //var pics = ["./images/test/metro.jpg", "./images/test/shanghai.jpg"]
        //var picUrl = pics[Math.floor(Math.random() * 2)];
        //$scope.Events.sendPicture(picUrl);


        image_manager.initialize();
        image_manager.show_dialog(
            {
                multiple: false,
                type: "picture",
                endpoint: $scope.endpoint,
                token_endpoint: $scope.token_endpoint
            },
            function (url) {
                if (url == null || url.length == 0)
                    return;
                //callback handle
                $scope.$apply(function () {
                    $scope.Events.sendPicture(url[0].url);
                });

            }
        );
    };

    $scope.Events.toggleSettingsPanel = function () {
        $scope.showSettingPanel = !$scope.showSettingPanel;
    };

    $scope.Events.toggleExpression = function () {
        $scope.showQuickReplyMessagesDiv = false;
        $scope.showWechatExpressionDiv = !$scope.showWechatExpressionDiv;
    };

    $scope.Events.toggleQuickReply = function () {
        $scope.showWechatExpressionDiv = false;
        $scope.showQuickReplyMessagesDiv = !$scope.showQuickReplyMessagesDiv;
        if ($scope.showQuickReplyMessagesDiv) {
            $scope.localFuncs.loadQuickReplies();
        }
    };

    /**
     * send a signal to the target csr saying that I want to gain the controll over the customer,
     * please forward him to me
     * @param conversation
     * @param $event
     */
    $scope.Events.requestForward = function (conversation, $event) {
        if ($event) {
            $event.stopPropagation();
        }
        resources.requestForward($scope.csr.csrId, $scope.csr.csrName, conversation.customer.userId, conversation.customer.name)
            .then(function (response) {
                if (response.data.result == "success") {
                    //signal sent successfully
                    utils.displayMessage(i18nFactory.format("requestSuccess", conversation.__servicingCsr));
                } else if (response.data.result == "noCsr") {
                    //some csr is out of service so the user is not serviced by anyone
                    utils.displayMessage(i18nFactory.get("noCsr"));
                    conversation.__servicingCsrId = null;
                    conversation.__servicingCsr = null;
                } else if (response.data.result == "myself") {
                    //the csr himself is actually servicing the customer
                    utils.displayMessage(i18nFactory.get("iAmTheCsr"));
                    conversation.__servicingCsrId = $scope.csr.csrId;
                    conversation.__servicingCsr = $scope.csr.csrName;
                }
            })
            .catch(function (response) {
                if (response.data.result == "error")
                    utils.displayMessage(i18nFactory.get("error") + ":" + response.data.error);
                else
                    utils.displayMessage(i18nFactory.get("error"));
            });
    };

    $scope.Events.selectDialog = function (conversation, $event) {
        //upon being loaded,the currentConversation must be empty
        if ($scope.currentConversation != null)
            $scope.currentConversation.unselect();
        $scope.localFuncs.closeAllOperationTools();
        $scope.currentConversation = conversation;
        $scope.notFirstLoad = false;
        conversation.select();

        $scope.Events.showUserDetails();

        if ($scope.status.currentType == $scope.constants.MY_CUSTOMERS || $scope.status.currentType == $scope.constants.ALL_CUSTOMERS) {
            //fetch messages from db
            if (conversation.isLoadingMoreMessages == true)
                return;
            conversation.messages = [];
            $scope.Events.fetchMoreMessages(conversation, true);

            if ($scope.status.currentType == $scope.constants.MY_CUSTOMERS && !conversation.customer.hasGone) {
                $scope.Events.fetchCsrInfo(conversation, $event);
            }
        } else {
            $timeout(function () {
                var messageJQueryObj = $(".messages");
                messageJQueryObj.scrollTop(messageJQueryObj.get(0).scrollHeight + 1000);
            }, 10);
        }
    };

    $scope.Events.addToMyReceptionList = function ($event, conversation) {
        $event.stopPropagation();
        if (conversation.messages == null || conversation.messages.length == 0) {
            //almost impossbile case
            utils.displayMessage("noHistoryMessage");
            return;
        }
        var lastMessage = conversation.messages[conversation.messages.length - 1];
        var createdTimeStr = utils.ripTimezoneInfoOff(lastMessage.createdTime);
        var createdTime = utils.getLongMilliSeconds(createdTimeStr);
        var nowTime = new Date().getTime();

        //cannot send message to the customer if the last message was two days before
        if (nowTime - createdTime >= 47 * 3600 * 1000) {
            utils.displayMessage(i18nFactory.get("conversationInvalidated"));
            return;
        }

        resources.addToMyReceptionList($scope.csr.csrId, conversation.customer.userId)
            .then(function (response) {
                if (response.data.result == "success") {
                    utils.displayMessage(i18nFactory.get("addCustomerSuccess"));
                    return;
                } else if (response.data.result == "preempted") {
                    utils.displayMessage(i18nFactory.get("customerPreempted"));
                    return;
                }
            })
            .catch(function (response) {
                if (response.data.result == "error") {
                    utils.displayMessage(i18nFactory.get("error") + ":" + util.inspect(response.data.error));
                }
            });
    };

    $scope.Events.refreshUser = function (conversation, $event) {
        $scope.Events.fetchCsrInfo(conversation, $event);
        conversation.customer.basicInfoLoaded = false;
        $scope.localFuncs.loadUserInfo(conversation.customer);
    };

    $scope.Events.fetchCsrInfo = function (conversation, $event) {
        if ($event) {
            $event.stopPropagation();
        }
        if ($scope.currentConversation != conversation)
            $scope.Events.selectDialog(conversation);
        conversation.__servicingCsr = null;
        conversation.__status = $scope.constants.LOADING;
        $timeout(function () {
            resources.getCsrByUserId(conversation.customer.userId)
                .then(function (response) {
                    if (response.data && response.data.csrId != null) {
                        var csrId = response.data.csrId;
                        var csr = utils.tryInittingCsr(csrId);
                        conversation.__servicingCsr = csr.csrName;
                        conversation.__servicingCsrId = csrId;
                    }
                    conversation.__status = $scope.constants.LOADED;
                });
        }, 500);
    };

    $scope.Events.sendTextMessage = function ($event) {
        if (($event != null && ($event.altKey || $event.ctrlKey) && ($event.keyCode == 13 || $event.keyCode == 10))
            || $event == null) {

            if ($event) {
                $event.stopPropagation();
                $event.preventDefault();
            }

            if ($scope.conversationInput.trim() == "") {
                //delete redundant spaces
                $scope.conversationInput = "";
                utils.displayMessage(i18nFactory.get("nonEmptyMessage"));
                return;
            }

            var message = new Message($scope.constants.CSR_MESSAGE, $scope.constants.TEXT_MESSAGE, $scope.conversationInput.trim());
            message.safeContent = utils.encodeHtml(message.content);
            message.safeContent = $sce.trustAsHtml(transformFilter(message.safeContent));

            $scope.conversationInput = "";

            $scope.Events.sendMessage(message);
        }
    };

    $scope.Events.sendPicture = function (picUrl) {
        var message = new Message($scope.constants.CSR_MESSAGE, $scope.constants.PICTURE_MESSAGE, "");
        message.setMediaUrl(picUrl);
        $scope.Events.sendMessage(message);
    };

    $scope.Events.sendMessage = function (message) {
        message.setUserId($scope.currentConversation.customer.userId);
        message.setCsrId($scope.csrId);
        message.setSent(Message.SENDING);
        message.setCsrName($scope.csr.csrName);
        message.setAvatar($scope.csr.avatar);
        $scope.currentConversation.addReply(message);

        var transformedMessage = $scope.localFuncs.wrapMsgIntoApiFormat(message);

        $timeout(function () {
            var messagesJQueryObj = $(".messages");
            var newScrollHeight = messagesJQueryObj.get(0).scrollHeight;
            messagesJQueryObj.scrollTop(newScrollHeight + 1000);
        }, 10);

        resources.sendMessage(transformedMessage)
            .then(function (response) {
                var sentMessage = response.data;
                if (sentMessage.sendSuccess) {
                    message.setSent(Message.SENT);
                    message.setCreatedTime(sentMessage.createdTime);
                } else {
                    message.setCreatedTime(sentMessage.createdTime);
                    message.setSent(Message.FAILED);
                    message.resendId = sentMessage.id.id;
                }

            })
            .catch(function (error) {
                console.log(error);
                message.setSent(Message.FAILED);
            });
    };

    $scope.Events.resendMessage = function (message) {
        message.setSent(Message.SENDING);
        $timeout(function () {
            if (message.resendId == null) {
                utils.displayMessage(i18nFactory.get("cannotSendThisMessage"));
                message.setSent(Message.FAILED);
                return;
            }

            resources.resendMessage(message.resendId)
                .then(function (response) {
                    var sentMessage = response.data;

                    if (sentMessage.sendSuccess) {
                        message.setSent(Message.SENT);
                        message.setCreatedTime(sentMessage.createdTime);
                    } else {
                        message.setCreatedTime(sentMessage.createdTime);
                        message.setSent(Message.FAILED);
                    }
                })
                .catch(function (err) {
                    message.setSent(Message.FAILED);
                    console.log(err);
                });
        }, 500);
    };


    $scope.Events.switchToInReception = function () {
        $scope.localFuncs.reset();
        $scope.conversationList = $scope.inReceptionConversations;
        $scope.status.currentType = $scope.constants.IN_RECEPTION;
        $(".messages").height("450px");
    };


    $scope.$watch("conversationInput", function () {
        var pattern = /(\r\n|\n|\r)/g;
        var newLineLength = 0;
        var match = $scope.conversationInput.match(pattern);
        if (match != null) {
            newLineLength = match.length;
        }
        //$scope.remaining = $scope.constants.MAX_CHARACTER - newLineLength - $scope.conversationInput.length;
        $scope.remaining = $scope.constants.MAX_CHARACTER - $scope.conversationInput.length;
    });

    $scope.Events.addQuickReplyToTextarea = function (quickReply) {
        var content = $scope.conversationInput;
        var toBeInserted = quickReply.content;
        if ($scope.localFuncs.checkLength(content.length + toBeInserted.length)) {
            $scope.localFuncs.insertIntoTextarea(toBeInserted);
            $scope.showQuickReplyMessagesDiv = false;
            $(".input-textarea").focus();
        } else {
            utils.displayMessage(i18nFactory.get("messageTooLong"));
        }
    };

    $scope.Events.removeNewReplyEditInput = function ($index, id) {
        resources.removeQuickReply(id)
            .then(function () {
                $scope.quickReplies.splice($index, 1);
                utils.displayMessage(i18nFactory.get("quickReplyRemoved"));
            })
            .catch(function () {
                utils.displayMessage(i18nFactory.get("quickReplyFailed"));
                return;
            });

    };

    $scope.Events.addNewReply = function ($event) {
        if ($event.keyCode != 13)
            return;

        var replyContent = $scope.newReplyInput.trim();
        if (replyContent == "") {
            utils.displayMessage(i18nFactory.get("nonEmptyReply"));
        } else {
            var $index = $scope.editIndex;
            if ($index == -1) {
                resources.addNewQuickReply(replyContent)
                    .then(function (response) {
                        var responseReply = response.data;
                        var newReply = new QuickReply(responseReply.id.id, responseReply.content);
                        $scope.quickReplies.unshift(newReply);
                        $scope.newReplyInput = "";
                        utils.displayMessage(i18nFactory.get("quickReplyAdded"));
                    })
                    .catch(function () {
                        utils.displayMessage(i18nFactory.get("quickReplyFailed"));
                        return;
                    });

            } else {
                resources.updateQuickReply($scope.editId, replyContent)
                    .then(function () {
                        $scope.quickReplies[$index].content = replyContent;
                        $scope.newReplyInput = "";
                        utils.displayMessage(i18nFactory.get("quickReplyUpdated"));
                    })
                    .catch(function () {
                        utils.displayMessage(i18nFactory.get("quickReplyFailed"));
                        return;
                    });

            }
            $scope.showNewReplyEditInput = false;
        }
    };

    $scope.Events.showNewReplyEditInput = function ($index, quickReply) {
        $scope.showNewReplyEditInput = true;
        $scope.editId = quickReply.id;
        $scope.editIndex = $index;
        $timeout(function () {
            $scope.newReplyInput = quickReply.content;
            $(".new-reply-edit-input").focus();
        }, 100);
    };

    $scope.Events.hideNewReplyEditInput = function () {
        $scope.showNewReplyEditInput = false;
        $scope.newReplyInput = "";
    };

    $scope.$on("EXPRESSION_CLOSE", function () {
        $scope.showWechatExpressionDiv = false;
    });

    $scope.$on("EXPRESSION_SELECTED", function (event, exp) {
        var content = $scope.conversationInput;
        var toBeInserted = util.format("[%s]", exp);
        if ($scope.localFuncs.checkLength(content.length + toBeInserted.length)) {
            $scope.localFuncs.insertIntoTextarea(toBeInserted);
            $scope.showWechatExpressionDiv = false;
            $(".input-textarea").focus();
        } else {
            utils.displayMessage(i18nFactory.get("messageTooLong"));
        }
    });
};
