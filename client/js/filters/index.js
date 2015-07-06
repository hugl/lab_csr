/**
 * Created by qiucheng on 15/5/5.
 */
module.exports = angular.module("filters", [])
    .filter("lengthLimit", require("./strlength-limit.filter"))
    .filter("transform", require("./transform.filter"))
    .filter("timeStr", require("./timestr.filter"))
    .filter("rTranslate", require("./r-translate.filter"));