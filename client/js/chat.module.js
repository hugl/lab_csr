/**
 * Created by qiucheng on 15/5/12.
 */
require("./angular");
require("ng-resource")(window, angular);

if (window.opener == null || window.opener.location.href.indexOf("admin/wechat/csr") == -1) {
    window.location.href = "about:blank";
    return;
}

$(document).on("keypress", function (event) {
    if (event.keyCode == 117) {
        event.stopPropagation();
    }
});

angular.module("silkcloudChat", [
    require("./services").name,
    require("./directives").name,
    require("./filters").name,
    require("./controllers").name
]).run(["$rootScope", "resources", "$timeout", function ($rootScope, resources, $timeout) {
    require("./run")($rootScope, resources);
}]);