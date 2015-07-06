/**
 * Created by qiucheng on 15/5/24.
 */

module.exports = function ($rootScope, resources) {
    try {
        //all the csrs that is used in the current session
        $rootScope.csrs = [];

        var openerHtmlEle = window.opener.document.getElementsByTagName("html")[0];
        var host = openerHtmlEle.getAttribute("data-admin-host");
        var orgName = openerHtmlEle.getAttribute("data-org-name");
        $rootScope.host = host;
        $rootScope.orgName = orgName;

        var search = window.location.search;
        search = search.substring(1);
        var csrId = search.split("=")[1];
        $rootScope.csrId = Number(csrId);

        var orgObj = resources.getOrganization(orgName);

        $rootScope.orgId = orgObj.results[0].id.id;

        var groupObj = resources.getMyCustomersGroup($rootScope.orgId, csrId);

        //my customers are stored in this group
        if (groupObj && groupObj.results && groupObj.results.length > 0) {
            $rootScope.myGroupId = groupObj.results[0].id.id;
        } else {
            //if the user group does not exist, create a new one
            var newGroupObj = resources.createMyCustomersGroup($rootScope.orgId, $rootScope.csrId);
            if (newGroupObj && newGroupObj.id && newGroupObj.id.id) {
                $rootScope.myGroupId = newGroupObj.id.id;
            }
        }

        if ($rootScope.myGroupId == null)
            throw new Error("my customer user group does not exist");

        $(".init-background-div").hide();
        $("#popup-background-div").show();
    } catch (error) {
        console.log(error.stack);
        alert("客服端初始化失败");
        //window.location.href = "about:blank";
    }
};