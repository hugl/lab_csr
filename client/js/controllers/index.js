/**
 * Created by qiucheng on 15/5/12.
 */
module.exports = angular.module("controllers", [])
    .controller("popupController", require("./popup-message-controller"))
    .controller("chatController", require("./chat-controller"));