/**
 * Created by qiucheng on 15/5/12.
 */
module.exports =
    angular.module("services", ["ngResource"])
        .factory("TagModel", require("./tag.model"))
        .factory("TagResource", require("./tag.resource"))
        .factory("TagOperations", require("./tag-operations.factory"))
        .factory("resources", require("./resources"))
        .factory("utils", require("./utils"))
        .factory("i18nFactory", require("./i18n.factory"))
        .factory("popupMessage", require("./popup-message.factory"))
        .factory("randomGenerator", require("./generate-random-data.factory"))
        .factory('adminHttpInterceptorFactory', require('./admin-http-interceptor.factory'));