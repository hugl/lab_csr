/**
 * Created by qiucheng on 15/5/16.
 */
module.exports = function ($scope, $rootScope, $interval, utils) {
    $scope.constants = {};

    var openerHtml = window.opener.document.getElementsByTagName("html")[0];
    $scope.endpoint = openerHtml.getAttribute("data-public-host");
    $scope.token_endpoint = openerHtml.getAttribute("data-public-host");

    $scope.bigImageUrl = "";
    $scope.newReplyInput = "";
    $scope.showQuickReplyMessagesDiv = false;
    $scope.showWechatExpressionDiv = false;
    $scope.showSettingPanel = false;

    $scope.constants.MAX_CHARACTER = 500;
    $scope.constants.IN_RECEPTION = "IN_RECEPTION";
    $scope.constants.MY_CUSTOMERS = "MY_CUSTOMERS";
    $scope.constants.ALL_CUSTOMERS = "ALL_CUSTOMERS";

    //message content type
    $scope.constants.TEXT_MESSAGE = "Text";
    $scope.constants.PICTURE_MESSAGE = "Pic";
    $scope.constants.VOICE_MESSAGE = "Voice";
    $scope.constants.SHORT_VIDEO_MESSAGE = "ShortVideo";
    $scope.constants.VIDEO_MESSAGE = "Video";
    $scope.constants.LOCATION_MESSAGE = "Location";
    $scope.constants.LINK_MESSAGE = "Link";

    //message type
    $scope.constants.CUSTOMER_MESSAGE = "CUSTOMER_MESSAGE";
    $scope.constants.CSR_MESSAGE = "CSR_MESSAGE";

    //user details
    $scope.constants.DETAILS = "DETAILS";
    $scope.constants.ORDERS = "ORDERS";

    $scope.constants.NOTIFICATION = "notification";
    $scope.constants.AUTOSCROLLBAR = "autoScrollBar";

    $scope.constants.LOADING = "LOADING";
    $scope.constants.LOADED = "LOADED";

    $scope.searchUserName = "";

    $scope.status = {};

    $scope.tempData = {};
    $scope.tempData.currentConversationListBackup = [];

    $scope.status.currentType = $scope.constants.IN_RECEPTION;
    $scope.status.messageBeingLoaded = false;
    $scope.status.loadingConversation = true;
    $scope.status.showInputSearch = false;
    $scope.status.showAllCsrs = false;
    $scope.status.showCsrMetaInfo = false;

    $scope.status.showBigMap = false;

    //dialog settings
    $scope.settings = {};
    $scope.settings.notification = true;
    $scope.settings.autoScrollBarPosition = true;


    $scope.status.isShowingSearchResult = false;

    $scope.currentConversation = null;
    $scope.messages = [];

    $scope.inReceptionConversations = [];
    //this is used to show conversation list:1.in reception,my customer and all customers
    $scope.conversationList = $scope.inReceptionConversations;
    $scope.conversationInput = "";


    //plan to deprecate this attribute since we have csr object below
    //FIXME
    $scope.csrId = $rootScope.csrId;
    $scope.csr = utils.tryInittingCsr($scope.csrId);

    $scope.quickReplies = [];

    $scope.socket = null;

    $scope.status.startTime = new Date().getTime();
    $scope.status.minutes = "00";
    $scope.status.seconds = "00";

    $interval(function () {
        var now = new Date().getTime();
        var diff = (now - $scope.status.startTime) / 1000;
        var minutes = Math.floor(diff / 60);
        var seconds = Math.floor(diff % 60);
        //I dont use angular here is because angular would try to "refresh" that whole page every second!
        $("#minutes").text(utils.addZero(minutes));
        $("#seconds").text(utils.addZero(seconds));
    }, 1000);
};