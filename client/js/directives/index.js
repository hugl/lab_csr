/**
 * Created by qiucheng on 15/5/14.
 */
module.exports = angular.module("directives", [])
    .directive("tagSelect", require("./tag-select.directive"))
    .directive("ngScroll", require("./ngScroll.directive"))
    .directive("slideBar", require("./slide-bar.directive"))
    .directive("media", require("./media.directive"))
    .directive("wechatExpression", require("./wechat-expression.directive"))
    .directive("deleteMark", require("./delete-mark.directive"));